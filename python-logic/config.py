from dotenv import load_dotenv
import os

class Config:
    def __init__(self):
        load_dotenv()
        self.ACCESS_TOKEN = os.getenv("WHATSAPP_TOKEN")
        self.PHONE_NUMBER_ID = os.getenv("PHONE_NUMBER_ID")
        self.VERIFY_TOKEN = os.getenv("VERIFY_TOKEN")