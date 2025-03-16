import os
import logging
import requests
import time
import json
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

# Get Hugging Face API token
HF_API_TOKEN = os.getenv('HUGGINGFACE_API_TOKEN')
if not HF_API_TOKEN:
    raise ValueError("No HUGGINGFACE_API_TOKEN found in .env file")

# Simple polling implementation
class TelegramBot:
    def __init__(self, token):
        self.token = token
        self.api_url = f"https://api.telegram.org/bot{token}/"
        self.offset = 0
        
        # Setup Hugging Face API parameters
        self.setup_model()
        
    def setup_model(self):
        print("Setting up Llama 3.2 model API...")
        # Store API information directly
        self.hf_api_url = "https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-1B-Instruct"
        self.hf_headers = {"Authorization": f"Bearer {HF_API_TOKEN}"}
        print("Model API setup successfully!")
        
    def process_with_llama(self, text):
        try:
            # Format user input as Llama chat prompt
            prompt = text
            
            # Create payload for the API request
            payload = {
                "inputs": prompt,
                "parameters": {
                    "max_new_tokens": 512,
                    "temperature": 0.05,
                    "do_sample": True,
                    "return_full_text": False
                }
            }
            
            # Make the API request
            response = requests.post(
                self.hf_api_url,
                headers=self.hf_headers,
                json=payload
            )
            
            # Check for successful response
            if response.status_code == 200:
                result = response.json()
                
                # Extract the generated text
                if isinstance(result, list) and len(result) > 0:
                    return result[0]["generated_text"]
                else:
                    return str(result)
            else:
                error_msg = f"API error: {response.status_code} - {response.text}"
                logger.error(error_msg)
                return f"Sorry, I couldn't process that request. {error_msg}"
            
        except Exception as e:
            logger.error(f"Error processing with Llama model: {e}")
            return f"Error processing your request: {str(e)}"
        
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
            # Just process with Llama 3.2 and return the direct response
            model_response = self.process_with_llama(text)
            return self.send_message(chat_id, model_response)
    
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