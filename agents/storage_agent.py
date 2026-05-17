import psycopg2
import threading
from config import DATABASE_URL

lock = threading.Lock()

def get_conn():
    return psycopg2.connect(DATABASE_URL)

def init_db():
    with lock:
        with get_conn() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    CREATE TABLE IF NOT EXISTS urls (
                        code     TEXT PRIMARY KEY,
                        original TEXT NOT NULL,
                        hits     INTEGER DEFAULT 0
                    )
                """)
            conn.commit()

def save_url(code, original):
    with lock:
        with get_conn() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    "INSERT INTO urls (code, original) VALUES (%s, %s) ON CONFLICT (code) DO NOTHING",
                    (code, original)
                )
            conn.commit()

def get_url(code):
    with lock:
        with get_conn() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    "SELECT original FROM urls WHERE code = %s", (code,)
                )
                row = cur.fetchone()
    return row[0] if row else None

def increment_hits(code):
    with lock:
        with get_conn() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    "UPDATE urls SET hits = hits + 1 WHERE code = %s", (code,)
                )
            conn.commit()

def get_all_urls():
    with lock:
        with get_conn() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    "SELECT code, original, hits FROM urls"
                )
                rows = cur.fetchall()
    return [{"code": r[0], "original": r[1], "hits": r[2]} for r in rows]