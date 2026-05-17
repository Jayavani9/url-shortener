from flask import jsonify
from agents import auth_agent, shorten_agent, redirect_agent, analytics_agent

def handle(action, context):

    # skip auth for redirect — it's public
    if action == "redirect":
        result = redirect_agent.run(context)
        if not result["success"]:
            return jsonify({"error": result["error"]}), result["status"]
        return jsonify(result), 200

    # auth required for everything else
    auth_result = auth_agent.run(context)
    if not auth_result["success"]:
        return jsonify({"error": auth_result["error"]}), auth_result["status"]

    if action == "shorten":
        result = shorten_agent.run(context)
    elif action == "analytics":
        result = analytics_agent.run(context)
    else:
        return jsonify({"error": f"Unknown action: {action}"}), 400

    if not result["success"]:
        return jsonify({"error": result["error"]}), result["status"]

    return jsonify(result), 200