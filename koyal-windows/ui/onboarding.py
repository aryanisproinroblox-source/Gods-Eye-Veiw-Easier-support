import customtkinter as ctk
from .theme import BG_COLOR, SURFACE_COLOR, ACCENT_COLOR, TEXT_COLOR

class OnboardingScreen(ctk.CTkToplevel):
    def __init__(self, parent, on_complete):
        super().__init__(parent)
        self.title("Welcome to Koyal")
        self.geometry("600x400")
        self.configure(fg_color=BG_COLOR)
        self.on_complete = on_complete
        
        self.slides = [
            ("Your Voice Your Device", "All transcriptions happen locally and offline."),
            ("Hold C to Record", "Hold the C key anywhere to start recording. Release to transcribe."),
            ("Choose Your Model", "Download the AI model that fits your needs.")
        ]
        self.current_slide = 0
        
        self.title_label = ctk.CTkLabel(self, text="", font=("Arial", 28, "bold"), text_color=ACCENT_COLOR)
        self.title_label.pack(pady=(50, 20))
        
        self.desc_label = ctk.CTkLabel(self, text="", font=("Arial", 16), text_color=TEXT_COLOR)
        self.desc_label.pack(pady=20)
        
        self.btn_frame = ctk.CTkFrame(self, fg_color="transparent")
        self.btn_frame.pack(side="bottom", pady=50)
        
        self.prev_btn = ctk.CTkButton(self.btn_frame, text="Back", command=self.prev_slide, fg_color=SURFACE_COLOR, hover_color="#27272a")
        self.prev_btn.pack(side="left", padx=10)
        
        self.next_btn = ctk.CTkButton(self.btn_frame, text="Next", command=self.next_slide, fg_color=ACCENT_COLOR, text_color=BG_COLOR, hover_color="#a3cc00")
        self.next_btn.pack(side="left", padx=10)
        
        self.update_slide()

    def update_slide(self):
        title, desc = self.slides[self.current_slide]
        self.title_label.configure(text=title)
        self.desc_label.configure(text=desc)
        
        if self.current_slide == 0:
            self.prev_btn.configure(state="disabled")
        else:
            self.prev_btn.configure(state="normal")
            
        if self.current_slide == len(self.slides) - 1:
            self.next_btn.configure(text="Get Started")
        else:
            self.next_btn.configure(text="Next")

    def prev_slide(self):
        if self.current_slide > 0:
            self.current_slide -= 1
            self.update_slide()

    def next_slide(self):
        if self.current_slide < len(self.slides) - 1:
            self.current_slide += 1
            self.update_slide()
        else:
            self.destroy()
            self.on_complete()
