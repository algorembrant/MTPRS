import requests
import os
from pathlib import Path

BASE_URL = "http://localhost:8000"

def test_backend():
    print(f"Testing backend at {BASE_URL}...")
    
    # 1. Health Check
    try:
        r = requests.get(f"{BASE_URL}/")
        print(f"Root: {r.status_code} - {r.json()}")
    except Exception as e:
        print(f"Failed to connect: {e}")
        return

    # 2. Upload
    dummy_file = "test_upload.xlsx"
    # Create empty dummy file
    with open(dummy_file, "wb") as f:
        f.write(b"dummy excel content")
        
    files = {'file': (dummy_file, open(dummy_file, 'rb'))}
    try:
        r = requests.post(f"{BASE_URL}/upload", files=files)
        print(f"Upload: {r.status_code} - {r.json()}")
    except Exception as e:
        print(f"Upload failed: {e}")
    finally:
        os.remove(dummy_file)

    # 3. List Processed
    try:
        r = requests.get(f"{BASE_URL}/processed")
        print(f"Processed: {r.status_code} - {r.json()}")
    except Exception as e:
        print(f"List processed failed: {e}")

if __name__ == "__main__":
    test_backend()
