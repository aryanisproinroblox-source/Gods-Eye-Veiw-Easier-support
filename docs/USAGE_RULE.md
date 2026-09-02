# Koyal Usage Guide

> You talk. Koyal transcribes. All on your device.

---

## Table of Contents
1. [PC (Windows)](#pc-windows)
2. [Mobile (Android)](#mobile-android)
3. [Model Selection](#model-selection)
4. [Transcription History](#transcription-history)
5. [Tips & Tricks](#tips--tricks)
6. [Troubleshooting](#troubleshooting)

---

## PC (Windows)

### First Launch
1. Install Koyal for Windows from the website or GitHub Releases.
2. On first launch, the splash screen appears followed by a 3-slide onboarding.
3. You will be prompted to download a model (Lite recommended for first-time users).
4. After download, Koyal starts in the **system tray** (bottom-right clock area on Windows).

### Recording with the C Key

> **How it works:** Koyal intercepts the `C` key **only when Listening Mode is active**. When it is off, C types normally everywhere.

**Step-by-step:**
1. Right-click the Koyal tray icon → **"Start Listening"** (or use the toggle).
2. Put your cursor in any text field (Notepad, Chrome, Slack, Word — anywhere).
3. **Hold the `C` key** → a small floating overlay appears with waveform animation indicating Koyal is recording.
4. **Speak** your text naturally. You can say "um", pause, self-correct — Koyal handles it.
5. **Release the `C` key** → recording stops. Koyal transcribes in ~1-3 seconds.
6. The transcribed text is automatically **typed at your cursor position**.

### Tray Icon Menu
- **Start/Stop Listening** — toggles C-key interception on/off
- **Open History** — opens the transcription history window
- **Settings** — change model, language, hotkey
- **Quit** — exits Koyal completely

### Changing the Hotkey
If you want a different trigger key (e.g. `Alt+V` or `F9`):
- Tray icon → Settings → Hotkey → choose your preferred key.

### Tips for Best Results
- Speak at a **normal, conversational pace**.
- Keep your **microphone 10–30 cm from your mouth**.
- For noisy environments, use the **Medium model** for higher accuracy.
- You can dictate in **Hindi, English, or mix both** — Whisper detects language automatically.

---

## Mobile (Android)

### First Launch
1. Install the Koyal APK from the website or Google Play.
2. Complete the 3-slide onboarding.
3. Download your chosen model (Lite recommended for phones under 6 GB RAM).
4. Grant the required permissions when prompted:

### Required Permissions

| Permission | Why it is needed |
|---|---|
| **Microphone** | To capture your voice for transcription |
| **Display over other apps** | To show the floating bubble above all apps |
| **Accessibility Service** | To detect text fields and inject text into them |
| **Notifications** | Required by Android for foreground services (the bubble) |

> **Note on Accessibility Service:** Koyal uses Android's Accessibility API — the same system used by screen readers and productivity tools. This lets Koyal detect when you tap into a text field and inject the transcribed text back in. Koyal does NOT log keystrokes or read screen content beyond detecting text field focus.

### Recording with the Floating Bubble

1. After permissions are granted, a **floating Koyal bird bubble** will appear whenever you tap into a text field in any app.
2. **Tap the bubble once** → recording starts. The bubble animates with green waveform rings.
3. **Speak** your message.
4. **Tap the bubble again** (or wait for auto-silence detection) → transcription begins.
5. The transcribed text is **inserted directly into the text field** you were typing in.
6. The bubble shrinks back to its resting state.

### Moving the Bubble
- **Long-press and drag** the bubble to reposition it anywhere on your screen.

### Enabling / Disabling the Bubble
- Open the Koyal app → toggle **"Floating Bubble"** on or off.
- When off, the bubble does not appear over other apps.

### Android Tips
- For **WhatsApp / Telegram**: tap into the message box, then tap the bubble.
- For **SMS / Messages**: works the same way.
- The bubble remembers its last position on screen.
- If the bubble disappears, go to Koyal app → re-enable the Accessibility Service (some phones reset it after updates).

---

## Model Selection

### When to use Koyal Lite (Whisper Small)
- Everyday voice typing — messages, notes, searches
- Devices with 4 GB RAM or less
- When you want fast transcription (near real-time)
- General conversation, simple sentences

### When to use Koyal Medium (CrisperWhisper)
- Technical dictation (code comments, documentation)
- Medical, legal, or scientific vocabulary
- Complex multilingual content
- Devices with 6 GB+ RAM

### Switching Models
- **Windows:** Tray icon → Settings → Model → select Lite or Medium → confirm.
- **Android:** Open Koyal app → Settings → Model → switch.
- Note: The new model loads into memory on next recording. You may notice a ~3 second delay on the first transcription after switching.

---

## Transcription History

All your transcriptions are saved locally and never uploaded anywhere.

### Accessing History
- **Windows:** Tray icon → Open History
- **Android:** Koyal app main screen

### Features
- **Search** — full-text search across all past transcriptions
- **Copy** — one-tap copy of any transcription
- **Delete** — swipe left (Android) or click the trash icon (Windows)
- **Export** — Windows: File → Export as .txt; Android: Share button

---

## Tips & Tricks

1. **Filler words:** Koyal automatically removes "um", "uh", "like" and other fillers when it detects them mid-sentence.
2. **Punctuation:** Say "period", "comma", "question mark", "exclamation" to insert punctuation. Whisper also auto-inserts based on sentence structure.
3. **New paragraph:** Say "new paragraph" or "new line".
4. **Battery (Android):** For best results, ensure Koyal has a Battery Optimization exemption: Settings → Battery → Koyal → Unrestricted.
5. **Startup (Windows):** Koyal can be added to Windows startup: Tray → Settings → "Start with Windows".

---

## Troubleshooting

### Windows

**C key is not triggering recording:**
- Make sure Listening Mode is active (tray icon should be lit/green).
- Run Koyal as Administrator if your target app is elevated (some games or admin windows).

**Transcription is slow:**
- Lite model is recommended. Medium takes longer on CPUs without GPU.
- Close other heavy applications to free RAM.

**Text not appearing in app:**
- Some apps block programmatic text input (e.g. some password fields, browser address bars when focused). This is a system restriction.

### Android

**Bubble not appearing:**
- Ensure Accessibility Service is enabled: Android Settings → Accessibility → Koyal → On.
- Ensure "Display over other apps" permission is granted.

**Text not injecting into some apps:**
- Some apps (banking apps, secure keyboards) block accessibility injection for security. This is expected behavior.

**Model download failing:**
- Ensure you have a stable internet connection and sufficient storage (500 MB for Lite, 1.6 GB for Medium).

---

*Koyal is open source. Found a bug or want to contribute? Visit the GitHub repository.*
