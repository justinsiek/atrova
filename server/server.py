from flask import Flask, jsonify, request
from flask_cors import CORS
from supabase import create_client, Client
import os
from dotenv import load_dotenv
import uuid
from werkzeug.security import generate_password_hash

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

# Add a helper function to get the current user ID from the auth token
def get_current_user_id():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None
    
    token = auth_header.split(' ')[1]
    try:
        # Verify the token with Supabase
        user = supabase.auth.get_user(token)
        return user.user.id
    except Exception as e:
        print(f"Error verifying token: {str(e)}")
        return None

# Tasks API endpoints
@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    try:
        user_id = get_current_user_id()
        if not user_id:
            return jsonify({'error': 'Unauthorized'}), 401
            
        # With RLS policies, Supabase will automatically filter tasks by user_id
        response = supabase.table("tasks").select("*").execute()
        return jsonify(response.data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/tasks', methods=['POST'])
def add_task():
    try:
        user_id = get_current_user_id()
        if not user_id:
            return jsonify({'error': 'Unauthorized'}), 401
            
        new_task = request.get_json()
        if 'id' not in new_task:
            new_task['id'] = str(uuid.uuid4())
        
        # Add the user_id to the task
        new_task['user_id'] = user_id
        
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
        user_id = get_current_user_id()
        if not user_id:
            return jsonify({'error': 'Unauthorized'}), 401
            
        # With RLS policies, Supabase will automatically filter events by user_id
        response = supabase.table("events").select("*").execute()
        return jsonify(response.data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/events', methods=['POST'])
def add_event():
    try:
        user_id = get_current_user_id()
        if not user_id:
            return jsonify({'error': 'Unauthorized'}), 401
            
        new_event = request.get_json()
        if 'id' not in new_event:
            new_event['id'] = str(uuid.uuid4())
        
        # Add the user_id to the event
        new_event['user_id'] = user_id
        
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

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        name = data.get('name')

        if not email or not password or not name:
            return jsonify({'error': 'Email, password, and name are required'}), 400

        # Create user in Supabase Auth
        try:
            user = supabase.auth.sign_up({
                "email": email,
                "password": password,
                "options": {
                    "data": {
                        "full_name": name
                    }
                }
            })

            return jsonify({
                'message': 'User created successfully',
                'user': {
                    'id': user.user.id,
                    'email': user.user.email,
                    'name': name
                }
            }), 201

        except Exception as e:
            # Handle specific Supabase errors
            error_msg = str(e)
            if "User already registered" in error_msg:
                return jsonify({'error': 'Email already registered'}), 409
            raise e

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400

        # Authenticate with Supabase
        try:
            auth_response = supabase.auth.sign_in_with_password({
                "email": email,
                "password": password
            })
            
            # Get user data
            user = auth_response.user
            session = auth_response.session
            
            # Get user's name from metadata
            user_name = user.user_metadata.get('full_name', '')

            return jsonify({
                'message': 'Login successful',
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'name': user_name,
                    'access_token': session.access_token,
                    'refresh_token': session.refresh_token
                }
            }), 200

        except Exception as e:
            # Handle specific Supabase errors
            error_msg = str(e)
            if "Invalid login credentials" in error_msg:
                return jsonify({'error': 'Invalid email or password'}), 401
            raise e

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/verify', methods=['GET'])
def verify_token():
    try:
        user_id = get_current_user_id()
        if not user_id:
            return jsonify({'authenticated': False}), 401
        
        # Get user info from Supabase
        user = supabase.auth.get_user(request.headers.get('Authorization').split(' ')[1])
        return jsonify({
            'authenticated': True,
            'user': {
                'id': user.user.id,
                'email': user.user.email,
                'name': user.user.user_metadata.get('full_name', '')
            }
        }), 200
    except Exception as e:
        print(f"Token verification error: {str(e)}")
        return jsonify({'authenticated': False, 'error': str(e)}), 401

if __name__ == '__main__':
    app.run(debug=True)