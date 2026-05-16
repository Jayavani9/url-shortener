import sqlite3
import threading 
from config import DB_PATH

lock = threading.Lock()

def init_db():
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS urls(
                     code TEXT PRIMARY KEY,
                     original TEXT NOT NULL,
                     hits INTEGER DEFAULT 0
                     )
        """)
        conn.commit()

def save_url(code,original):
    with lock:
        with sqlite3.connect(DB_PATH) as conn:
            conn.execute(
                "INSERT OR IGNORE INTO urls(code,original) VALUES (?,?)",
                (code,original)
            )
            conn.commit()

def get_url(code):
    with lock:
        with sqlite3.connect(DB_PATH) as conn:
            ans = conn.execute(
                "SELECT original from urls where code = ?", (code,)
            ).fetchone()
    return ans[0] if ans else None

def increment_hits(code):
    with lock:
        with sqlite3.connect(DB_PATH) as conn:
            conn.execute(
                "UPDATE urls SET hits = hits+1 WHERE code = ?", (code,)
            )
            conn.commit()

def get_all_urls():
    with lock:
        with sqlite3.connect(DB_PATH) as conn:
            rows = conn.execute(
                "SELECT code, original, hits from urls"
            ).fetchall()
    return [{"code": r[0], "original": r[1], "hits": r[2]} for r in rows]
