import pyautogui
import time

def inject_text(text):
    if not text:
        return
    # Add a space before appending text if needed, but let's just type what we get
    # It might be better to copy to clipboard and paste for speed, but instructions say:
    # "Injects transcribed text at cursor position using pyautogui/keyboard"
    
    # Store current clipboard (optional, to restore later)
    # import pyperclip
    # old_clipboard = pyperclip.paste()
    # pyperclip.copy(text)
    # pyautogui.hotkey('ctrl', 'v')
    # pyperclip.copy(old_clipboard)
    
    # Using typewrite is direct but can be slow for long text
    # We will use clipboard for speed to avoid user frustration with long delays
    import pyperclip
    old_clip = pyperclip.paste()
    pyperclip.copy(text)
    # A tiny sleep is sometimes needed before ctrl+v
    time.sleep(0.05)
    pyautogui.hotkey('ctrl', 'v')
    time.sleep(0.05)
    pyperclip.copy(old_clip)

    # fallback pure pyautogui
    # pyautogui.write(text)
