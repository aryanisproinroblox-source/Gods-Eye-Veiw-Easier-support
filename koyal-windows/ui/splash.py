import customtkinter as ctk
import time
from .theme import BG_COLOR, ACCENT_COLOR, TEXT_COLOR

class SplashScreen(ctk.CTkToplevel):
    def __init__(self, parent, on_complete):
        super().__init__(parent)
        self.overrideredirect(True)
        self.geometry("400x300")
        self.configure(fg_color=BG_COLOR)
        
        # Center on screen
        ws = self.winfo_screenwidth()
        hs = self.winfo_screenheight()
        x = (ws/2) - (400/2)
        y = (hs/2) - (300/2)
        self.geometry(f"+{int(x)}+{int(y)}")
        
        self.on_complete = on_complete
        
        self.title_label = ctk.CTkLabel(self, text="Koyal", font=("Arial", 36, "bold"), text_color=ACCENT_COLOR)
        self.title_label.pack(expand=True)
        
        self.tagline = ctk.CTkLabel(self, text="You talk. Koyal transcribes.", font=("Arial", 16), text_color=TEXT_COLOR)
        self.tagline.pack(pady=20)
        
        self.after(2000, self.finish)

    def finish(self):
        self.destroy()
        self.on_complete()
