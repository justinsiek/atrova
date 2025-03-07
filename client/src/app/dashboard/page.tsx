"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/Sidebar";
import Calendar from "@/components/Calendar";
import { useState } from "react";
import { COLORS } from "@/constants/colors";

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
  
  // Redirect if not authenticated and not loading
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleScheduleWithAI = () => {
    setAiStatus('loading');
    setTimeout(() => {
      setAiStatus('success');
      setTimeout(() => setAiStatus('idle'), 3000);
    }, 2000);
  };

  // Show loading while auth state is being determined
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  // Don't render anything if not authenticated
  if (!isAuthenticated) {
    return <div className="flex h-screen items-center justify-center">Redirecting to login...</div>;
  }

  return (
    <div className="flex h-screen" style={{ backgroundColor: COLORS.background }}>
      <Sidebar 
        onNewEvent={() => setShowEventForm(true)} 
        scheduleWithAI={handleScheduleWithAI}
        aiStatus={aiStatus}
        unscheduledTasks={3}
        getRandomColor={getRandomColor}
      />
      <div className="flex-1">
        <Calendar 
          showForm={showEventForm} 
          setShowForm={setShowEventForm}
          scheduleWithAI={handleScheduleWithAI}
          aiStatus={aiStatus}
          getRandomColor={getRandomColor}
        />
      </div>
    </div>
  );
}
