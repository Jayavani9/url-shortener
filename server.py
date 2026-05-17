from flask import Flask, request, jsonify, redirect
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_cors import CORS
from config import PORT, SECRET_KEY, RATE_LIMIT
from logger import log
import orchestrator
from agents.storage_agent import init_db

app = Flask(__name__)
app.secret_key = SECRET_KEY
CORS(app)                    # ← right here, after app is created

limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=[RATE_LIMIT]
)

init_db()

@app.post("/shorten")
@limiter.limit(RATE_LIMIT)
def shorten_url():
    data    = request.get_json() or {}
    context = {"url": data.get("url", "")}
    log.info("Shorten request for %s", context["url"])
    return orchestrator.handle("shorten", context)

@app.get("/<string:code>")
def redirect_url(code):
    context = {"code": code}
    log.info("Redirect request for code %s", code)
    result  = orchestrator.handle("redirect", context)
    if result[1] == 200:
        return redirect(result[0].get_json()["original"], 302)
    return result

@app.get("/urls")
def analytics():
    context = {}
    log.info("Analytics request")
    return orchestrator.handle("analytics", context)

@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Not found"}), 404

@app.errorhandler(500)
def server_error(e):
    log.error("Server error: %s", str(e))
    return jsonify({"error": "Internal server error"}), 500

if __name__ == "__main__":
    log.info("Server starting on port %s", PORT)
    app.run(host="0.0.0.0", port=PORT, threaded=True)