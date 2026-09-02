import customtkinter as ctk
import threading
try:
    from ui.theme import BG_COLOR, SURFACE_COLOR, ACCENT_COLOR, TEXT_COLOR
except ImportError:
    from theme import BG_COLOR, SURFACE_COLOR, ACCENT_COLOR, TEXT_COLOR
from model_downloader import download_model

class ModelDownloadScreen(ctk.CTkToplevel):
    def __init__(self, parent, on_complete):
        super().__init__(parent)
        self.title("Download Model")
        self.geometry("600x400")
        self.configure(fg_color=BG_COLOR)
        self.on_complete = on_complete
        
        ctk.CTkLabel(self, text="Select a Model", font=("Arial", 24, "bold"), text_color=ACCENT_COLOR).pack(pady=30)
        
        self.model_var = ctk.StringVar(value="small")
        
        lite_btn = ctk.CTkRadioButton(self, text="Lite (small, ~466MB, Faster)", variable=self.model_var, value="small", text_color=TEXT_COLOR)
        lite_btn.pack(pady=10)
        
        medium_btn = ctk.CTkRadioButton(self, text="Medium (large-v2, ~1.5GB, More Accurate)", variable=self.model_var, value="large-v2", text_color=TEXT_COLOR)
        medium_btn.pack(pady=10)
        
        self.progress = ctk.CTkProgressBar(self, width=400, progress_color=ACCENT_COLOR)
        self.progress.pack(pady=30)
        self.progress.set(0)
        
        self.status_label = ctk.CTkLabel(self, text="", text_color=TEXT_COLOR)
        self.status_label.pack()
        
        self.download_btn = ctk.CTkButton(self, text="Download & Continue", command=self.start_download, fg_color=ACCENT_COLOR, text_color=BG_COLOR)
        self.download_btn.pack(pady=20)

    def start_download(self):
        self.download_btn.configure(state="disabled")
        model = self.model_var.get()
        self.status_label.configure(text=f"Downloading {model} model...")
        
        def progress_cb(pct):
            self.progress.set(pct / 100.0)
            
        def task():
            success = download_model(model, progress_cb)
            if success:
                self.after(0, self.finish)
            else:
                self.after(0, lambda: self.status_label.configure(text="Download failed. Try again."))
                self.after(0, lambda: self.download_btn.configure(state="normal"))
                
        threading.Thread(target=task, daemon=True).start()

    def finish(self):
        self.destroy()
        self.on_complete(self.model_var.get())
