from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
schedule = []

@app.route('/api/task', methods=['POST'])
def add_task():
    try:
        new_task = request.get_json()
        # Optionally validate the new_task fields here
        schedule.append(new_task)
        return jsonify({'result': 'Task added successfully.', 'schedule': schedule}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("Starting server...")
    app.run(debug=True, port=8080)
    print("Server started!")