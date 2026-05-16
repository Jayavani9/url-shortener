from agents.storage_agent import get_url, increment_hits


def run(context):
    code = context.get("code", "").strip()

    if not code:
        return {"success": False, "error": "Missing code", "status": 400}
    original = get_url(code)
    if not original:
        return {"success": False, "error": "Short code not found", "status": 404}
    
    increment_hits(code)

    return {"success": True, "original": original}
