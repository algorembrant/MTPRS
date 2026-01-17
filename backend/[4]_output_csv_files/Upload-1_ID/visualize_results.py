import pandas as pd
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import os

def format_title(text):
    """
    Formats the column name for the graph title:
    1. Splits by '_'.
    2. If 'rolling' exists, keep only words AFTER it.
    3. Capitalize first letter (unless already all caps).
    4. Remove duplicates.
    """
    # Split by underscore
    words = text.split('_')
    
    # Handle 'rolling': Find the specific word and keep everything after it
    lower_words = [w.lower() for w in words]
    if 'rolling' in lower_words:
        try:
            # Find the index of the word 'rolling'
            index = lower_words.index('rolling')
            # Slice the list to keep only elements after 'rolling'
            words = words[index + 1:]
        except ValueError:
            pass

    # Deduplicate and Format
    clean_words = []
    seen = set()

    for word in words:
        # distinct check (case-insensitive) and skip empty strings or leftover 'rolling'
        if word.lower() not in seen and word.strip() != "" and word.lower() != 'rolling':
            seen.add(word.lower())
            
            # Capitalization Logic
            if word.isupper():
                # If text is already capslock (abbreviation), do not change
                clean_words.append(word)
            else:
                # Make first letter capslock
                clean_words.append(word.capitalize())

    return " ".join(clean_words)

def create_column_graphs(filename):
    # Check if file exists
    if not os.path.exists(filename):
        print(f"Error: The file '{filename}' was not found in the current directory.")
        return

    # Load the data
    try:
        df = pd.read_csv(filename)
    except Exception as e:
        print(f"Error reading the CSV file: {e}")
        return

    # Select only numeric columns (assuming we want to plot numerical data)
    cols_to_plot = df.select_dtypes(include=['number']).columns
    
    if len(cols_to_plot) == 0:
        print("No numeric columns found to plot.")
        # Fallback to all columns if no numeric found
        cols_to_plot = df.columns

    # Process titles according to rules
    formatted_titles = [format_title(col) for col in cols_to_plot]

    num_plots = len(cols_to_plot)
    print(f"Generating {num_plots} graphs...")

    # Create subplots: one row for each column
    fig = make_subplots(
        rows=num_plots, 
        cols=1, 
        subplot_titles=formatted_titles,  # Use the formatted titles here
        vertical_spacing=0.05 / max(1, (num_plots / 2)) # Adjust spacing dynamically
    )

    # Add a line graph for each column
    for i, col in enumerate(cols_to_plot):
        fig.add_trace(
            go.Scatter(
                x=df.index, 
                y=df[col], 
                mode='lines', 
                name=formatted_titles[i] # Update trace name to match title
            ),
            row=i + 1, 
            col=1
        )

    # Update the layout to use the white theme and ensure it's tall enough
    fig.update_layout(
        template='plotly_white',
        height=300 * num_plots,  # Set height: 300px per graph
        title_text=f"Visualization of {filename}",
        showlegend=False  # Hide legend to reduce clutter
    )

    # Show the graph
    fig.show()

if __name__ == "__main__":
    create_column_graphs('9_layer_output.csv')
