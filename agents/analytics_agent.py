from agents.storage_agent import get_all_urls

def run(context):
    urls = get_all_urls()
    return {"success": True, "urls": urls}