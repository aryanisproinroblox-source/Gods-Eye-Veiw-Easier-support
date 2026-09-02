import sqlite3
import os

DB_DIR = os.path.join(os.getenv('APPDATA'), 'Koyal')
DB_PATH = os.path.join(DB_DIR, 'koyal.db')

class Database:
    def __init__(self):
        os.makedirs(DB_DIR, exist_ok=True)
        self.conn = sqlite3.connect(DB_PATH, check_same_thread=False)
        self.create_table()

    def create_table(self):
        query = """
        CREATE TABLE IF NOT EXISTS transcriptions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT,
            model TEXT,
            duration_ms INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            app_context TEXT
        )
        """
        self.conn.execute(query)
        self.conn.commit()

    def save(self, text, model, duration_ms, app_context=""):
        query = "INSERT INTO transcriptions (text, model, duration_ms, app_context) VALUES (?, ?, ?, ?)"
        self.conn.execute(query, (text, model, duration_ms, app_context))
        self.conn.commit()

    def get_all(self):
        cursor = self.conn.execute("SELECT id, text, model, duration_ms, created_at, app_context FROM transcriptions ORDER BY created_at DESC")
        return cursor.fetchall()

    def search(self, query_str):
        cursor = self.conn.execute(
            "SELECT id, text, model, duration_ms, created_at, app_context FROM transcriptions WHERE text LIKE ? ORDER BY created_at DESC",
            (f"%{query_str}%",)
        )
        return cursor.fetchall()

    def delete(self, id):
        self.conn.execute("DELETE FROM transcriptions WHERE id = ?", (id,))
        self.conn.commit()

    def export_txt(self, filepath):
        records = self.get_all()
        with open(filepath, 'w', encoding='utf-8') as f:
            for r in records:
                f.write(f"[{r[4]}] {r[1]}\n")
