from flask import request
from config import API_KEY

def run(context):
    key = request.headers.get("X-API-Key")

    if not key:
        return {"success": False, "error": "Missing API key", "status": 401}
    
    if key != API_KEY:
        return {"success": False, "error": "Invalid API key", "status": 401}
    
    return {"success": True}

