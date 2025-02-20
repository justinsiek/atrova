from twilio.rest import Client

# Twilio credentials - replace these with your actual credentials
account_sid = '<YOUR_ACCOUNT_SID>'
auth_token = '<YOUR_AUTH_TOKEN>'
twilio_phone_number = '<YOUR_TWILIO_PHONE_NUMBER>'  # Example: "+12345678901"
my_phone_number = '<YOUR_PHONE_NUMBER>'             # Example: "+19876543210"

# Initialize Twilio client
client = Client(account_sid, auth_token)

def send_sms(message_body):
    """
    Sends an SMS using Twilio's API.
    """
    message = client.messages.create(
        body=message_body,
        from_=twilio_phone_number,
        to=my_phone_number
    )
    print(f"Sent message with SID: {message.sid}")

if __name__ == "__main__":
    send_sms("Hello from Twilio!")
