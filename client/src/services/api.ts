// API endpoints
const API_URL = 'http://localhost:5000/api';

// Import the necessary types
import { Task } from '@/components/sidebar/types';
import { EventType } from '@/types';

// Task-related API calls
export const fetchTasks = async () => {
  const response = await fetch(`${API_URL}/tasks`);
  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }
  return response.json();
};

export const createTask = async (task: Omit<Task, 'id'>) => {
  const response = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  });
  if (!response.ok) {
    throw new Error('Failed to create task');
  }
  return response.json();
};

export const updateTask = async (id: string, task: any) => {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  });
  if (!response.ok) {
    throw new Error('Failed to update task');
  }
  return response.json();
};

export const deleteTask = async (id: string) => {
  console.log(`Deleting task with ID: ${id}`);
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'DELETE',
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
};

// Event-related API calls
export const fetchEvents = async () => {
  const response = await fetch(`${API_URL}/events`);
  if (!response.ok) {
    throw new Error('Failed to fetch events');
  }
  return response.json();
};

export const createEvent = async (event: Omit<EventType, 'id'>) => {
  const response = await fetch(`${API_URL}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  });
  if (!response.ok) {
    throw new Error('Failed to create event');
  }
  return response.json();
};

export const updateEvent = async (id: string, event: any) => {
  const response = await fetch(`${API_URL}/events/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  });
  if (!response.ok) {
    throw new Error('Failed to update event');
  }
  return response.json();
};

export const deleteEvent = async (id: string) => {
  console.log(`Deleting event with ID: ${id}`);
  const response = await fetch(`${API_URL}/events/${id}`, {
    method: 'DELETE',
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
}; 