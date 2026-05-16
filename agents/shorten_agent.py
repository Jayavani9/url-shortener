import hashlib
from agents.storage_agent import save_url
from config import BASE_URL

def make_short_code(url):
    return hashlib.md5(url.encode()).hexdigest()[:6]

def run(context):
    url = context.get("url", "").strip()

    if not url:
        return {"success": False, "error": "Missing url", "status": 400}

    if not url.startswith(("http://", "https://")):
        return {"success": False, "error": "URL must start with http:// or https://", "status": 422}

    code = make_short_code(url)
    save_url(code, url)

    return {
        "success": True,
        "code": code,
        "short_url": f"{BASE_URL}/{code}"
    }