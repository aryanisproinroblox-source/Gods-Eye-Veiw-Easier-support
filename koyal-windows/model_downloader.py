import huggingface_hub
import os
from .config import CONFIG_DIR

MODEL_DIR = os.path.join(CONFIG_DIR, 'models')

def download_model(model_size, progress_callback=None):
    os.makedirs(MODEL_DIR, exist_ok=True)
    repo_id = f"Systran/faster-whisper-{model_size}"
    
    # In a real app we'd hook into tqdm for huggingface_hub, 
    # but we can just use snapshot_download.
    if progress_callback:
        progress_callback(10)
        
    try:
        huggingface_hub.snapshot_download(repo_id=repo_id, local_dir=os.path.join(MODEL_DIR, f"models--Systran--faster-whisper-{model_size}"))
        if progress_callback:
            progress_callback(100)
        return True
    except Exception as e:
        print(f"Error downloading model: {e}")
        return False
