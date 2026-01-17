import os
import shutil
from pathlib import Path
from typing import List
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directories
BASE_DIR = Path(__file__).parent.absolute()
UPLOAD_DIR = BASE_DIR / "[2]_Drop_xlsx_here"
OUTPUT_DIR = BASE_DIR / "[4]_output_csv_files"

# Ensure directories exist
UPLOAD_DIR.mkdir(exist_ok=True)
OUTPUT_DIR.mkdir(exist_ok=True)

@app.get("/")
async def root():
    return {"message": "MTParsee Backend Running"}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    if not file.filename.endswith(('.xlsx', '.xls')):
        raise HTTPException(status_code=400, detail="Only Excel files are allowed")
    
    file_path = UPLOAD_DIR / file.filename
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        return {"filename": file.filename, "message": "File uploaded successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/processed")
async def list_processed_folders():
    """List all result folders in the output directory"""
    if not OUTPUT_DIR.exists():
        return []
    
    results = []
    # Sort by modification time, newest first
    items = sorted(OUTPUT_DIR.iterdir(), key=os.path.getmtime, reverse=True)
    
    for item in items:
        if item.is_dir() and item.name.startswith("Upload-"):
            # Count files in the folder
            file_count = len(list(item.glob("*.*")))
            results.append({
                "id": item.name,
                "name": item.name,
                "created": item.stat().st_mtime,
                "file_count": file_count
            })
    return results

@app.get("/processed/{folder_id}")
async def list_folder_contents(folder_id: str):
    folder_path = OUTPUT_DIR / folder_id
    if not folder_path.exists():
        raise HTTPException(status_code=404, detail="Folder not found")
    
    files = []
    for item in folder_path.iterdir():
        if item.is_file():
            files.append({
                "name": item.name,
                "size": item.stat().st_size,
                "path": f"download/{folder_id}/{item.name}"
            })
    return files

@app.get("/download/{folder_id}/{filename}")
async def download_file(folder_id: str, filename: str):
    file_path = OUTPUT_DIR / folder_id / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    
    return FileResponse(path=file_path, filename=filename, media_type='application/octet-stream')

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
