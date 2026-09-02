import sys
import os
import customtkinter as ctk

from config import load_config, save_config
from db import Database
from hotkey_manager import HotkeyManager
from ui.theme import apply_theme
from ui.splash import SplashScreen
from ui.onboarding import OnboardingScreen
from ui.model_download import ModelDownloadScreen
from ui.main_window import MainWindow
from ui.overlay import RecordingOverlay
from tray import TrayIcon

class KoyalApp:
    def __init__(self):
        self.config = load_config()
        self.db = Database()
        apply_theme()
        
        # Root window for Tkinter lifecycle, kept hidden
        self.root = ctk.CTk()
        self.root.withdraw()
        
        self.overlay = RecordingOverlay()
        
        self.hotkey_mgr = HotkeyManager(overlay_callback=self.on_overlay_toggle)
        self.tray = TrayIcon(self)
        
        self.main_window = None

    def on_overlay_toggle(self, show):
        if show:
            self.overlay.show()
        else:
            self.overlay.hide()

    def set_listening_mode(self, active):
        self.config['listening_mode_active'] = active
        self.hotkey_mgr.set_active(active)
        save_config(self.config)

    def show_history(self):
        if self.main_window is None or not self.main_window.winfo_exists():
            self.main_window = MainWindow(self.db)
        self.main_window.deiconify()
        self.main_window.focus()

    def show_settings(self):
        # Settings stub
        pass

    def start(self):
        if self.config.get('first_run', True):
            self.run_first_time_setup()
        else:
            self.hotkey_mgr.start()
            self.tray.run()
            self.root.mainloop()

    def run_first_time_setup(self):
        def on_splash_done():
            OnboardingScreen(self.root, on_onboarding_done)
            
        def on_onboarding_done():
            ModelDownloadScreen(self.root, on_model_downloaded)
            
        def on_model_downloaded(model_name):
            self.config['selected_model'] = model_name
            self.config['first_run'] = False
            save_config(self.config)
            self.hotkey_mgr.transcriber.model_size = model_name
            self.hotkey_mgr.start()
            self.tray.run()
            
        SplashScreen(self.root, on_splash_done)
        self.root.mainloop()

    def quit(self):
        self.hotkey_mgr.stop()
        self.root.quit()
        sys.exit(0)

if __name__ == "__main__":
    app = KoyalApp()
    app.start()
