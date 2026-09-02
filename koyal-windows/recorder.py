import sounddevice as sd
import numpy as np

class Recorder:
    def __init__(self, sample_rate=16000, channels=1):
        self.sample_rate = sample_rate
        self.channels = channels
        self.recording = False
        self.frames = []
        self.stream = None

    def start(self):
        self.recording = True
        self.frames = []
        self.stream = sd.InputStream(
            samplerate=self.sample_rate,
            channels=self.channels,
            dtype='float32',
            callback=self._callback
        )
        self.stream.start()

    def stop(self):
        self.recording = False
        if self.stream:
            self.stream.stop()
            self.stream.close()
            self.stream = None
        
        if not self.frames:
            return np.array([], dtype=np.float32)
        return np.concatenate(self.frames, axis=0).flatten()

    def _callback(self, indata, frames, time, status):
        if self.recording:
            self.frames.append(indata.copy())
