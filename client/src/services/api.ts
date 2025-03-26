// API endpoints
const API_URL = process.env.API_URL;

// Import the necessary types
import { Task } from '@/components/sidebar/types';
import { EventType } from '@/types';

// Add a helper function to get the auth token
const getAuthToken = () => localStorage.getItem('accessToken');

// Task-related API calls
export const fetchTasks = async () => {
  const token = getAuthToken();
  console.log("Fetching tasks with token:", token ? "Token exists" : "No token");
  try {
    const response = await fetch(`${API_URL}/tasks`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      }
    });
    console.log("Tasks response status:", response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error fetching tasks:", errorText);
      throw new Error('Failed to fetch tasks');
    }
    const data = await response.json();
    console.log("Fetched tasks:", data);
    return data;
  } catch (error) {
    console.error("Exception fetching tasks:", error);
    throw error;
  }
};

export const createTask = async (task: Omit<Task, 'id'>) => {
  const token = getAuthToken();
  console.log("Creating task with token:", token ? "Token exists" : "No token");
  try {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify(task),
    });
    console.log("Create task response status:", response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error creating task:", errorText);
      throw new Error('Failed to create task');
    }
    const data = await response.json();
    console.log("Created task:", data);
    return data;
  } catch (error) {
    console.error("Exception creating task:", error);
    throw error;
  }
};

export const updateTask = async (id: string, task: any) => {
  const token = getAuthToken();
  console.log("Updating task with token:", token ? "Token exists" : "No token", "Task ID:", id);
  try {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify(task),
    });
    console.log("Update task response status:", response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error updating task:", errorText);
      throw new Error('Failed to update task');
    }
    const data = await response.json();
    console.log("Updated task:", data);
    return data;
  } catch (error) {
    console.error("Exception updating task:", error);
    throw error;
  }
};

export const deleteTask = async (id: string) => {
  console.log(`Deleting task with ID: ${id}`);
  const token = getAuthToken();
  console.log("Deleting task with token:", token ? "Token exists" : "No token");
  try {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      }
    });
    
    console.log(`Delete task response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error deleting task: ${errorText}`);
      throw new Error('Failed to delete task');
    }
    
    const data = await response.json();
    console.log(`Delete task response data:`, data);
    return data;
  } catch (error) {
    console.error("Exception deleting task:", error);
    throw error;
  }
};

// Event-related API calls
export const fetchEvents = async () => {
  const token = getAuthToken();
  console.log("Fetching events with token:", token ? "Token exists" : "No token");
  try {
    const response = await fetch(`${API_URL}/events`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      }
    });
    console.log("Events response status:", response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error fetching events:", errorText);
      throw new Error('Failed to fetch events');
    }
    const data = await response.json();
    console.log("Fetched events:", data);
    return data;
  } catch (error) {
    console.error("Exception fetching events:", error);
    throw error;
  }
};

export const createEvent = async (event: Omit<EventType, 'id'>) => {
  const token = getAuthToken();
  console.log("Creating event with token:", token ? "Token exists" : "No token");
  try {
    const response = await fetch(`${API_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify(event),
    });
    console.log("Create event response status:", response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error creating event:", errorText);
      throw new Error('Failed to create event');
    }
    const data = await response.json();
    console.log("Created event:", data);
    return data;
  } catch (error) {
    console.error("Exception creating event:", error);
    throw error;
  }
};

export const updateEvent = async (id: string, event: any) => {
  const token = getAuthToken();
  console.log("Updating event with token:", token ? "Token exists" : "No token", "Event ID:", id);
  try {
    const response = await fetch(`${API_URL}/events/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify(event),
    });
    console.log("Update event response status:", response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error updating event:", errorText);
      throw new Error('Failed to update event');
    }
    const data = await response.json();
    console.log("Updated event:", data);
    return data;
  } catch (error) {
    console.error("Exception updating event:", error);
    throw error;
  }
};

export const deleteEvent = async (id: string) => {
  console.log(`Deleting event with ID: ${id}`);
  const token = getAuthToken();
  console.log("Deleting event with token:", token ? "Token exists" : "No token");
  try {
    const response = await fetch(`${API_URL}/events/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      }
    });
    
    console.log(`Delete event response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error deleting event: ${errorText}`);
      throw new Error('Failed to delete event');
    }
    
    const data = await response.json();
    console.log(`Delete event response data:`, data);
    return data;
  } catch (error) {
    console.error("Exception deleting event:", error);
    throw error;
  }
}; 