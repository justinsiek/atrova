from flask import Flask, jsonify, request
from flask_cors import CORS
from llama import LlamaChat
import json

app = Flask(__name__)
CORS(app)
llama = LlamaChat()
schedule = []

@app.route('/api/chat', methods=['GET'])
def chat():
    chat_str = request.args.get('chat', default='', type=str)
    
    try:
        result = llama.get_task_details(chat_str)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    schedule.append(result)
    return jsonify({'result': result, 'schedule': schedule})

if __name__ == '__main__':
    print("Starting server...")
    app.run(debug=True, port=8080)
    print("Server started!")