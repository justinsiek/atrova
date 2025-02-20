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
    
    # Build a prompt with instruct tags.
    # The instruct tags help indicate that the content inside is a strict instruction.
    extraction_prompt = (
        "[INST] Extract the task details from the following message and output ONLY a JSON object with exactly the keys 'task' and 'date'. Do NOT include any text, commentary, or additional keys. "
        "The JSON must reflect only the information provided in the message, with no extra derivation. EXTREMELY IMPORTANT: DO NOT INCLUDE ANY OTHER TEXT OR COMMENTARY. THE ENTIRE RESPONSE SHOULD BE A SINGLE JSON OBJECT.\n"
        f"Message: {chat_str}\n "
        "[/INST]"
    )
    
    # Run the prompt through the model.
    model_response = llama.get_response(extraction_prompt)

    start_index = model_response.find('{')
    end_index = model_response.find('}', start_index)
    json_extract = model_response[start_index:end_index+1] #TODO: ADD ERROR HANDLING

    json_obj = json.loads(json_extract) #TODO: ADD ERROR HANDLING

    schedule.append(json_obj)

    return jsonify({'result': json_extract, 'schedule': schedule})

if __name__ == '__main__':
    print("Starting server...")
    app.run(debug=True, port=8080)
    print("Server started!")