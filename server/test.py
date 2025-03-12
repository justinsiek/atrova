import os
import logging
import requests
import time
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Get bot token
BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
if not BOT_TOKEN:
    raise ValueError("No TELEGRAM_BOT_TOKEN found in .env file")

# Simple polling implementation
class TelegramBot:
    def __init__(self, token):
        self.token = token
        self.api_url = f"https://api.telegram.org/bot{token}/"
        self.offset = 0
        
    def get_updates(self):
        params = {
            'offset': self.offset,
            'timeout': 30
        }
        response = requests.get(f"{self.api_url}getUpdates", params=params)
        return response.json()
    
    def send_message(self, chat_id, text):
        params = {
            'chat_id': chat_id,
            'text': text
        }
        response = requests.post(f"{self.api_url}sendMessage", params=params)
        return response.json()
    
    def process_message(self, message):
        chat_id = message['chat']['id']
        text = message.get('text', '')
        user = message.get('from', {})
        username = user.get('first_name', 'User')
        
        logger.info(f"Message from {username} ({user.get('id')}): {text}")
        print(f"Message: {text}")
        
        # Handle commands
        if text.startswith('/start'):
            return self.send_message(chat_id, f"Hi {username}! I am your Atrova task assistant. Send me a message to add tasks.")
        elif text.startswith('/help'):
            return self.send_message(chat_id, "You can send me messages like: \"Remind me to buy groceries tomorrow at 5pm\"")
        else:
            # Echo the message (replace with Groq integration later)
            return self.send_message(chat_id, f"I received your message: {text}")
    
    def run(self):
        print("Bot is starting with polling...")
        print("Bot is running! Press Ctrl+C to stop.")
        
        try:
            while True:
                updates = self.get_updates()
                
                if updates.get('ok') and updates.get('result'):
                    for update in updates['result']:
                        if 'message' in update:
                            self.process_message(update['message'])
                        
                        # Update offset to acknowledge processed updates
                        self.offset = update['update_id'] + 1
                
                time.sleep(1)
        except KeyboardInterrupt:
            print("Bot stopped")

def main():
    bot = TelegramBot(BOT_TOKEN)
    bot.run()

if __name__ == '__main__':
    main()