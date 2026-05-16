from flask import request, jsonify
from config import API_KEY


def require_api_key():
    key = request.headers.get("X-API-KEY")

    if not key:
        return jsonify({"error": "Missing API key"}), 401
    
    if key != API_KEY:
        return jsonify({"error": "Invalid API key"}), 401
    return None