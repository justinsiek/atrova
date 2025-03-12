import os
import logging
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Get the bot token from environment variables
BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
if not BOT_TOKEN:
    raise ValueError("No TELEGRAM_BOT_TOKEN found in .env file")

# Define command handler functions
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Send a message when the command /start is issued."""
    user = update.effective_user
    await update.message.reply_text(f'Hi {user.first_name}! I am your Atrova task assistant. Send me a message to add tasks.')

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Send a message when the command /help is issued."""
    await update.message.reply_text('You can send me messages like: "Remind me to buy groceries tomorrow at 5pm"')

async def echo(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Echo the user message and process it."""
    message_text = update.message.text
    user = update.effective_user
    
    # Log the message
    logger.info(f"Received message from {user.first_name} ({user.id}): {message_text}")
    print(f"Message: {message_text}")
    
    # In the future, this is where you'll process the message with Groq
    # For now, just echo it back
    await update.message.reply_text(f"I received your message: {message_text}")
    
    # In the future: Parse the message, extract task data, and add to your system
    # task_data = process_with_groq(message_text)
    # add_task_to_database(user.id, task_data)

def main():
    """Set up and run the bot with polling."""
    print("Bot is starting with polling...")
    
    # Create the Application
    application = Application.builder().token(BOT_TOKEN).build()

    # Register handlers
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("help", help_command))
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, echo))

    # Start the Bot with polling
    print("Bot is running! Press Ctrl+C to stop.")
    application.run_polling(allowed_updates=Update.ALL_TYPES)
    
    print("Bot stopped")

if __name__ == '__main__':
    main() 