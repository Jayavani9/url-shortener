from flask import jsonify 
from agents import auth_agent, shorten_agent, redirect_agent, analytics_agent


def handle(action,context):
    auth_res = auth_agent.run(context)

    if not auth_res["success"]:
        return jsonify({"error": auth_res["error"]}), auth_res["status"]
    
    if action == "shorten":
        res = shorten_agent.run(context)

    elif action == "analytics":
        res = analytics_agent.run(context)

    else:
        return jsonify({"error": f"Unknown action: {action}"}), 400
    
    if not res["success"]:
        return jsonify({"error": res["error"]}), res["status"]

    return jsonify(res), 200


