import json
import os

CONFIG_DIR = os.path.join(os.getenv('APPDATA'), 'Koyal')
CONFIG_PATH = os.path.join(CONFIG_DIR, 'config.json')

DEFAULT_CONFIG = {
    'selected_model': 'small',
    'listening_mode_active': True,
    'language': 'en',
    'first_run': True
}

def load_config():
    if not os.path.exists(CONFIG_PATH):
        save_config(DEFAULT_CONFIG)
        return DEFAULT_CONFIG.copy()
    try:
        with open(CONFIG_PATH, 'r') as f:
            config = json.load(f)
            # Merge defaults for missing keys
            for key, val in DEFAULT_CONFIG.items():
                if key not in config:
                    config[key] = val
            return config
    except Exception:
        return DEFAULT_CONFIG.copy()

def save_config(config):
    os.makedirs(CONFIG_DIR, exist_ok=True)
    with open(CONFIG_PATH, 'w') as f:
        json.dump(config, f, indent=4)
