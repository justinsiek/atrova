from flask import Flask, jsonify, request
from flask_cors import CORS
import uuid

app = Flask(__name__)
CORS(app)

# In-memory storage (replace with a database in production)
tasks = []
events = []

# Tasks API endpoints
@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    return jsonify(tasks)

@app.route('/api/tasks', methods=['POST'])
def add_task():
    try:
        new_task = request.get_json()
        # Generate a unique ID if not provided
        if 'id' not in new_task:
            new_task['id'] = str(uuid.uuid4())
        tasks.append(new_task)
        return jsonify({'result': 'Task added successfully', 'task': new_task}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/tasks/<task_id>', methods=['PUT'])
def update_task(task_id):
    try:
        updated_task = request.get_json()
        for i, task in enumerate(tasks):
            if task['id'] == task_id:
                tasks[i] = updated_task
                return jsonify({'result': 'Task updated successfully', 'task': updated_task}), 200
        return jsonify({'error': 'Task not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/tasks/<task_id>', methods=['DELETE'])
def delete_task(task_id):
    try:
        for i, task in enumerate(tasks):
            if task['id'] == task_id:
                deleted_task = tasks.pop(i)
                return jsonify({'result': 'Task deleted successfully', 'task': deleted_task}), 200
        return jsonify({'error': 'Task not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Events API endpoints
@app.route('/api/events', methods=['GET'])
def get_events():
    return jsonify(events)

@app.route('/api/events', methods=['POST'])
def add_event():
    try:
        new_event = request.get_json()
        # Generate a unique ID if not provided
        if 'id' not in new_event:
            new_event['id'] = str(uuid.uuid4())
        events.append(new_event)
        return jsonify({'result': 'Event added successfully', 'event': new_event}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/events/<event_id>', methods=['PUT'])
def update_event(event_id):
    try:
        updated_event = request.get_json()
        for i, event in enumerate(events):
            if event['id'] == event_id:
                events[i] = updated_event
                return jsonify({'result': 'Event updated successfully', 'event': updated_event}), 200
        return jsonify({'error': 'Event not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/events/<event_id>', methods=['DELETE'])
def delete_event(event_id):
    try:
        for i, event in enumerate(events):
            if event['id'] == event_id:
                deleted_event = events.pop(i)
                return jsonify({'result': 'Event deleted successfully', 'event': deleted_event}), 200
        return jsonify({'error': 'Event not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)