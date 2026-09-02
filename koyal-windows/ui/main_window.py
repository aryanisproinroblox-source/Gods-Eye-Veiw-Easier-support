import customtkinter as ctk
from .theme import BG_COLOR, SURFACE_COLOR, ACCENT_COLOR, TEXT_COLOR

class MainWindow(ctk.CTk):
    def __init__(self, db):
        super().__init__()
        self.db = db
        self.title("Koyal History")
        self.geometry("800x600")
        self.configure(fg_color=BG_COLOR)
        
        self.search_var = ctk.StringVar()
        self.search_var.trace("w", self.on_search)
        
        search_entry = ctk.CTkEntry(self, textvariable=self.search_var, placeholder_text="Search transcriptions...", width=400, fg_color=SURFACE_COLOR, text_color=TEXT_COLOR)
        search_entry.pack(pady=20)
        
        self.scroll_frame = ctk.CTkScrollableFrame(self, fg_color="transparent")
        self.scroll_frame.pack(expand=True, fill="both", padx=20, pady=10)
        
        self.load_history()

    def load_history(self, query=""):
        for widget in self.scroll_frame.winfo_children():
            widget.destroy()
            
        if query:
            records = self.db.search(query)
        else:
            records = self.db.get_all()
            
        for r in records:
            # id, text, model, duration_ms, created_at, app_context
            frame = ctk.CTkFrame(self.scroll_frame, fg_color=SURFACE_COLOR, corner_radius=10)
            frame.pack(fill="x", pady=5, padx=5)
            
            header = ctk.CTkLabel(frame, text=f"{r[4]} | {r[2]} ({r[3]}ms)", text_color="#a1a1aa", font=("Arial", 10))
            header.pack(anchor="w", padx=10, pady=(10, 0))
            
            text_label = ctk.CTkLabel(frame, text=r[1], text_color=TEXT_COLOR, font=("Arial", 14), wraplength=700, justify="left")
            text_label.pack(anchor="w", padx=10, pady=(5, 10))
            
            copy_btn = ctk.CTkButton(frame, text="Copy", width=60, height=24, fg_color=ACCENT_COLOR, text_color=BG_COLOR, command=lambda text=r[1]: self.copy_to_clipboard(text))
            copy_btn.pack(anchor="e", padx=10, pady=(0, 10))

    def on_search(self, *args):
        self.load_history(self.search_var.get())

    def copy_to_clipboard(self, text):
        self.clipboard_clear()
        self.clipboard_append(text)
        self.update()
