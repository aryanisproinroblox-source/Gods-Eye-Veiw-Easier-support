import pystray
from PIL import Image, ImageDraw
import threading

def create_image():
    # Generate a dummy icon since we don't have logo.png
    image = Image.new('RGB', (64, 64), color=(9, 9, 11))
    dc = ImageDraw.Draw(image)
    dc.ellipse((16, 16, 48, 48), fill=(200, 255, 0))
    return image

class TrayIcon:
    def __init__(self, app):
        self.app = app
        self.icon = pystray.Icon("Koyal")
        self.icon.icon = create_image()
        self.icon.title = "Koyal (Listening)" if app.config['listening_mode_active'] else "Koyal (Paused)"
        self.update_menu()

    def update_menu(self):
        mode_text = "Disable Listening" if self.app.config['listening_mode_active'] else "Enable Listening"
        self.icon.menu = pystray.Menu(
            pystray.MenuItem(mode_text, self.toggle_listening),
            pystray.MenuItem("History", self.app.show_history),
            pystray.MenuItem("Settings", self.app.show_settings),
            pystray.MenuItem("Quit", self.quit_app)
        )

    def toggle_listening(self):
        active = not self.app.config['listening_mode_active']
        self.app.set_listening_mode(active)
        self.icon.title = "Koyal (Listening)" if active else "Koyal (Paused)"
        self.update_menu()

    def quit_app(self):
        self.icon.stop()
        self.app.quit()

    def run(self):
        threading.Thread(target=self.icon.run, daemon=True).start()
