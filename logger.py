import logging

logging.basicConfig(
    filename="server.log",
    level=logging.INFO,
    format="%(asctime)s  %(levelname)s  %(message)s"
)


log = logging.getLogger(__name__)