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

# Add this helper function before the event endpoints
def map_event_fields(event_data):
    """Maps camelCase frontend fields to snake_case database fields"""
    field_mapping = {
        'startTime': 'start_time',
        'endTime': 'end_time',
        'aiGenerated': 'ai_generated'
    }
    
    mapped_event = {}
    for key, value in event_data.items():
        mapped_key = field_mapping.get(key, key)
        mapped_event[mapped_key] = value
    
    return mapped_event

# Add this helper function next to your existing map_event_fields function
def map_event_fields_to_camel_case(event_data):
    """Maps snake_case database fields to camelCase frontend fields"""
    field_mapping = {
        'start_time': 'startTime',
        'end_time': 'endTime',
        'ai_generated': 'aiGenerated'
    }
    
    mapped_event = {}
    for key, value in event_data.items():
        mapped_key = field_mapping.get(key, key)
        mapped_event[mapped_key] = value
    
    return mapped_event

# Add these helper functions for tasks, similar to the event mapping functions
def map_task_fields(task_data):
    """Maps camelCase frontend fields to snake_case database fields"""
    field_mapping = {
        'dueDate': 'due_date',
        # No need to map 'duration' as it's the same in both cases
    }
    
    mapped_task = {}
    for key, value in task_data.items():
        mapped_key = field_mapping.get(key, key)
        mapped_task[mapped_key] = value
    
    return mapped_task

def map_task_fields_to_camel_case(task_data):
    """Maps snake_case database fields to camelCase frontend fields"""
    field_mapping = {
        'due_date': 'dueDate',
        # No need to map 'duration' as it's the same in both cases
    }
    
    mapped_task = {}
    for key, value in task_data.items():
        mapped_key = field_mapping.get(key, key)
        mapped_task[mapped_key] = value
    
    return mapped_task

# Tasks API endpoints
@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    try:
        response = supabase.table("tasks").select("*").execute()
        # Transform data to camelCase for frontend
        transformed_data = [map_task_fields_to_camel_case(task) for task in response.data]
        return jsonify(transformed_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/tasks', methods=['POST'])
def add_task():
    try:
        new_task = request.get_json()
        # Generate a unique ID if not provided
        if 'id' not in new_task:
            new_task['id'] = str(uuid.uuid4())
        
        # Map camelCase to snake_case
        mapped_task = map_task_fields(new_task)
        
        response = supabase.table("tasks").insert(mapped_task).execute()
        if response.data:
            # Convert response back to camelCase for frontend
            result = map_task_fields_to_camel_case(response.data[0])
            return jsonify({'result': 'Task added successfully', 'task': result}), 201
        return jsonify({'error': 'Failed to add task'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/tasks/<task_id>', methods=['PUT'])
def update_task(task_id):
    try:
        updated_task = request.get_json()
        # Map camelCase to snake_case
        mapped_task = map_task_fields(updated_task)
        
        response = supabase.table("tasks").update(mapped_task).eq("id", task_id).execute()
        
        if response.data and len(response.data) > 0:
            # Convert response back to camelCase for frontend
            task_camelcase = map_task_fields_to_camel_case(response.data[0])
            return jsonify({'result': 'Task updated successfully', 'task': task_camelcase}), 200
        return jsonify({'error': 'Task not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/tasks/<task_id>', methods=['DELETE'])
def delete_task(task_id):
    try:
        # First get the task to return it in the response
        get_response = supabase.table("tasks").select("*").eq("id", task_id).execute()
        
        if not get_response.data or len(get_response.data) == 0:
            return jsonify({'error': 'Task not found'}), 404
            
        task_to_delete = get_response.data[0]
        
        # Delete the task
        delete_response = supabase.table("tasks").delete().eq("id", task_id).execute()
        
        # Instead of checking .error attribute, check if we have data in the response
        if delete_response.data is not None:
            # Convert to camelCase before returning to frontend
            task_camelcase = map_task_fields_to_camel_case(task_to_delete)
            return jsonify({'result': 'Task deleted successfully', 'task': task_camelcase}), 200
        
        return jsonify({'error': 'Failed to delete task'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Events API endpoints
@app.route('/api/events', methods=['GET'])
def get_events():
    try:
        response = supabase.table("events").select("*").execute()
        
        # Transform data to camelCase for frontend
        transformed_data = [map_event_fields_to_camel_case(event) for event in response.data]
        
        return jsonify(transformed_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/events', methods=['POST'])
def add_event():
    try:
        new_event = request.get_json()
        # Generate a unique ID if not provided
        if 'id' not in new_event:
            new_event['id'] = str(uuid.uuid4())
        
        # Map camelCase to snake_case
        mapped_event = map_event_fields(new_event)
        
        response = supabase.table("events").insert(mapped_event).execute()
        if response.data:
            # Convert response back to camelCase for frontend
            result = map_event_fields_to_camel_case(response.data[0])
            return jsonify({'result': 'Event added successfully', 'event': result}), 201
        return jsonify({'error': 'Failed to add event'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/events/<event_id>', methods=['PUT'])
def update_event(event_id):
    try:
        updated_event = request.get_json()
        # Map camelCase to snake_case
        mapped_event = map_event_fields(updated_event)
        
        response = supabase.table("events").update(mapped_event).eq("id", event_id).execute()
        
        if response.data and len(response.data) > 0:
            # Convert response back to camelCase for frontend
            event_camelcase = map_event_fields_to_camel_case(response.data[0])
            return jsonify({'result': 'Event updated successfully', 'event': event_camelcase}), 200
        return jsonify({'error': 'Event not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/events/<event_id>', methods=['DELETE'])
def delete_event(event_id):
    try:
        # First get the event to return it in the response
        get_response = supabase.table("events").select("*").eq("id", event_id).execute()
        
        if not get_response.data or len(get_response.data) == 0:
            return jsonify({'error': 'Event not found'}), 404
            
        event_to_delete = get_response.data[0]
        
        # Delete the event
        delete_response = supabase.table("events").delete().eq("id", event_id).execute()
        
        # Instead of checking .error attribute, check if we have data in the response
        if delete_response.data is not None:
            # Convert to camelCase before returning to frontend
            event_camelcase = map_event_fields_to_camel_case(event_to_delete)
            return jsonify({'result': 'Event deleted successfully', 'event': event_camelcase}), 200
        
        return jsonify({'error': 'Failed to delete event'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)