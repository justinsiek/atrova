"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/Sidebar";
import Calendar from "@/components/Calendar";
import { COLORS } from "@/constants/colors";
import { Task } from "@/components/sidebar/types";
import { EventType } from "@/types";
import { fetchTasks, fetchEvents } from "@/services/api";
import LoadingAnimation from "@/components/LoadingAnimation";

// Central configuration for calendar hour height
const HOUR_HEIGHT = 75;

// Define the color options to match the available event colors
const EVENT_COLORS = ["pink", "mint", "blue", "purple", "orange"] as const;
type EventColor = typeof EVENT_COLORS[number];

// Function to get a random color
const getRandomColor = (): EventColor => {
  const randomIndex = Math.floor(Math.random() * EVENT_COLORS.length);
  return EVENT_COLORS[randomIndex];
};

export default function Page() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [showEventForm, setShowEventForm] = useState(false);
  const [aiStatus, setAiStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<EventType[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  
  // Redirect if not authenticated and not loading
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Load both tasks and events in parallel
  useEffect(() => {
    const loadData = async () => {
      if (!isAuthenticated) return;
      
      setIsDataLoading(true);
      setDataError(null);
      
      try {
        console.log("Starting to load tasks");
        const tasksData = await fetchTasks();
        console.log("Tasks loaded, now loading events");
        
        // Small delay to ensure tasks are fully processed
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const eventsData = await fetchEvents();
        
        console.log("Successfully loaded tasks and events:", {
          tasksCount: tasksData.length,
          eventsCount: eventsData.length
        });
        
        setTasks(tasksData);
        setEvents(eventsData);
      } catch (error) {
        console.error("Error loading data:", error);
        setDataError("Failed to load your data. Please refresh and try again.");
      } finally {
        setIsDataLoading(false);
      }
    };
    
    if (isAuthenticated && !isLoading) {
      loadData();
    }
  }, [isAuthenticated, isLoading]);

  const handleScheduleWithAI = () => {
    setAiStatus('loading');
    setTimeout(() => {
      setAiStatus('success');
      setTimeout(() => setAiStatus('idle'), 3000);
    }, 2000);
  };

  // Show loading while auth state is being determined
  if (isLoading) {
    return <LoadingAnimation message="Authenticating..." />;
  }

  // Don't render anything if not authenticated
  if (!isAuthenticated) {
    return <div className="flex h-screen items-center justify-center">Redirecting to login...</div>;
  }

  // Show loading while data is being loaded
  if (isDataLoading) {
    return <LoadingAnimation message="Loading tasks and events..." />;
  }

  // Show error message if data loading failed
  if (dataError) {
    return (
      <div className="flex h-screen items-center justify-center flex-col">
        <div className="text-red-500 mb-4">{dataError}</div>
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => window.location.reload()}
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen" style={{ backgroundColor: COLORS.background }}>
      <Sidebar 
        onNewEvent={() => setShowEventForm(true)} 
        scheduleWithAI={handleScheduleWithAI}
        aiStatus={aiStatus}
        unscheduledTasks={3}
        getRandomColor={getRandomColor}
        initialTasks={tasks}
        hourHeight={HOUR_HEIGHT}
      />
      <div className="flex-1">
        <Calendar 
          showForm={showEventForm} 
          setShowForm={setShowEventForm}
          scheduleWithAI={handleScheduleWithAI}
          aiStatus={aiStatus}
          getRandomColor={getRandomColor}
          initialEvents={events}
          hourHeight={HOUR_HEIGHT}
        />
      </div>
    </div>
  );
}
