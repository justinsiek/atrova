from flask import Flask, jsonify, request
from flask_cors import CORS
from llama import LlamaChat

app = Flask(__name__)
CORS(app)
llama = LlamaChat()
schedule = []

@app.route('/api/chat', methods=['GET'])
def chat():
    chat_str = request.args.get('chat', default='0', type=str)  
    schedule.append(chat_str)
    return jsonify({'result': chat_str, 'schedule': schedule})

if __name__ == '__main__':
    print("Starting server...")
    app.run(debug=True, port=8080)
    print("Server started!")