from faster_whisper import WhisperModel
import os

MODEL_DIR = os.path.join(os.getenv('APPDATA'), 'Koyal', 'models')

class Transcriber:
    def __init__(self, model_size="small"):
        self.model_size = model_size
        self.model = None

    def load_model(self):
        if self.model is None:
            # Use GPU if available, else CPU
            # int8 for fast execution
            self.model = WhisperModel(self.model_size, device="auto", compute_type="int8", download_root=MODEL_DIR)

    def transcribe(self, audio_data):
        self.load_model()
        if len(audio_data) == 0:
            return ""
        
        segments, info = self.model.transcribe(audio_data, beam_size=5)
        text = " ".join([segment.text for segment in segments])
        return text.strip()
