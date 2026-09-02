import customtkinter as ctk
import tkinter as tk
import threading
import time
try:
    from ui.theme import BG_COLOR, SURFACE_COLOR, ACCENT_COLOR, TEXT_COLOR
except ImportError:
    from theme import BG_COLOR, SURFACE_COLOR, ACCENT_COLOR, TEXT_COLOR

class RecordingOverlay:
    def __init__(self):
        self.window = ctk.CTkToplevel()
        self.window.overrideredirect(True)
        self.window.attributes("-topmost", True)
        self.window.attributes("-alpha", 0.9)
        self.window.configure(fg_color=SURFACE_COLOR)
        
        # Center horizontally at the bottom
        ws = self.window.winfo_screenwidth()
        hs = self.window.winfo_screenheight()
        w = 200
        h = 60
        x = (ws/2) - (w/2)
        y = hs - h - 100
        self.window.geometry(f"{w}x{h}+{int(x)}+{int(y)}")
        
        self.label = ctk.CTkLabel(self.window, text="Recording...", text_color=TEXT_COLOR, font=("Arial", 16, "bold"))
        self.label.pack(side="left", padx=20, pady=20)
        
        self.canvas = tk.Canvas(self.window, width=50, height=30, bg=SURFACE_COLOR, highlightthickness=0)
        self.canvas.pack(side="right", padx=20, pady=15)
        
        self.bars = []
        for i in range(5):
            bar = self.canvas.create_rectangle(i*10, 15, i*10+6, 30, fill=ACCENT_COLOR, outline="")
            self.bars.append(bar)
            
        self.is_animating = False
        self.window.withdraw() # Hide initially

    def animate(self):
        import random
        while self.is_animating:
            for i, bar in enumerate(self.bars):
                height = random.randint(5, 30)
                self.canvas.coords(bar, i*10, 30-height, i*10+6, 30)
            time.sleep(0.1)

    def show(self):
        self.window.deiconify()
        self.is_animating = True
        threading.Thread(target=self.animate, daemon=True).start()

    def hide(self):
        self.is_animating = False
        self.window.withdraw()
