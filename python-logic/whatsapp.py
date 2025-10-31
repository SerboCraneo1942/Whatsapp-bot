#import requests
#from config import Config

#class WhatsAppAPI:
    #def __init__(self):
       # cfg = Config()
        #self.token = cfg.ACCESS_TOKEN
        #self.phone_id = cfg.PHONE_NUMBER_ID
        #self.url = f"https://graph.facebook.com/v20.0/{self.phone_id}/messages"

    #def send_message(self, to: str, text: str):
       # headers = {
##            "Authorization": f"Bearer {self.token}",
 #           "Content-Type": "application/json"
 #       }
 #       data = {
  ##          "messaging_product": "whatsapp",
  #          "to": to,
  #          "type": "text",
  ##          "text": {"body": text}
  #      }
   #     resp = requests.post(self.url, headers=headers, json=data)
  #      return resp.status_code, resp.json()