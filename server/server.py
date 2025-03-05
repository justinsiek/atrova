from flask import Flask, jsonify, request
from flask_cors import CORS
from supabase import create_client
import os
from dotenv import load_dotenv
import uuid

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize Supabase client
supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_KEY")

if not supabase_url or not supabase_key:
    raise ValueError("Missing Supabase credentials. Please set SUPABASE_URL and SUPABASE_KEY environment variables.")

supabase = create_client(supabase_url, supabase_key)
# Tasks API endpoints
@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    try:
        response = supabase.table("tasks").select("*").execute()
        return jsonify(response.data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/tasks', methods=['POST'])
def add_task():
    try:
        new_task = request.get_json()
        if 'id' not in new_task:
            new_task['id'] = str(uuid.uuid4())
        
        response = supabase.table("tasks").insert(new_task).execute()
        if response.data:
            return jsonify({'result': 'Task added successfully', 'task': response.data[0]}), 201
        return jsonify({'error': 'Failed to add task'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/tasks/<task_id>', methods=['PUT'])
def update_task(task_id):
    try:
        updated_task = request.get_json()
        response = supabase.table("tasks").update(updated_task).eq("id", task_id).execute()
        
        if response.data and len(response.data) > 0:
            return jsonify({'result': 'Task updated successfully', 'task': response.data[0]}), 200
        return jsonify({'error': 'Task not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/tasks/<task_id>', methods=['DELETE'])
def delete_task(task_id):
    try:
        get_response = supabase.table("tasks").select("*").eq("id", task_id).execute()
        
        if not get_response.data or len(get_response.data) == 0:
            return jsonify({'error': 'Task not found'}), 404
            
        task_to_delete = get_response.data[0]
        delete_response = supabase.table("tasks").delete().eq("id", task_id).execute()
        
        if delete_response.data is not None:
            return jsonify({'result': 'Task deleted successfully', 'task': task_to_delete}), 200
        
        return jsonify({'error': 'Failed to delete task'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Events API endpoints
@app.route('/api/events', methods=['GET'])
def get_events():
    try:
        response = supabase.table("events").select("*").execute()
        return jsonify(response.data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/events', methods=['POST'])
def add_event():
    try:
        new_event = request.get_json()
        if 'id' not in new_event:
            new_event['id'] = str(uuid.uuid4())
        
        response = supabase.table("events").insert(new_event).execute()
        if response.data:
            return jsonify({'result': 'Event added successfully', 'event': response.data[0]}), 201
        return jsonify({'error': 'Failed to add event'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/events/<event_id>', methods=['PUT'])
def update_event(event_id):
    try:
        updated_event = request.get_json()
        response = supabase.table("events").update(updated_event).eq("id", event_id).execute()
        
        if response.data and len(response.data) > 0:
            return jsonify({'result': 'Event updated successfully', 'event': response.data[0]}), 200
        return jsonify({'error': 'Event not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/events/<event_id>', methods=['DELETE'])
def delete_event(event_id):
    try:
        get_response = supabase.table("events").select("*").eq("id", event_id).execute()
        
        if not get_response.data or len(get_response.data) == 0:
            return jsonify({'error': 'Event not found'}), 404
            
        event_to_delete = get_response.data[0]
        delete_response = supabase.table("events").delete().eq("id", event_id).execute()
        
        if delete_response.data is not None:
            return jsonify({'result': 'Event deleted successfully', 'event': event_to_delete}), 200
        
        return jsonify({'error': 'Failed to delete event'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)