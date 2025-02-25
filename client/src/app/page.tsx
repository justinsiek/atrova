"use client"

import Sidebar from "@/components/Sidebar"
import Calendar from "@/components/Calendar"
import { useState } from "react"
import { COLORS } from "@/constants/colors"

export default function Page() {
  const [showEventForm, setShowEventForm] = useState(false);
  const [aiStatus, setAiStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  
  const handleScheduleWithAI = () => {
    setAiStatus('loading');
    // Simulate AI scheduling
    setTimeout(() => {
      setAiStatus('success');
      setTimeout(() => setAiStatus('idle'), 3000);
    }, 2000);
  };

  return (
    <div className="flex h-screen" style={{ backgroundColor: COLORS.background }}>
      <Sidebar 
        onNewEvent={() => setShowEventForm(true)} 
        scheduleWithAI={handleScheduleWithAI}
        aiStatus={aiStatus}
        unscheduledTasks={3}
      />
      <div className="flex-1">
        <Calendar 
          showForm={showEventForm} 
          setShowForm={setShowEventForm}
          scheduleWithAI={handleScheduleWithAI}
          aiStatus={aiStatus}
        />
      </div>
    </div>
  )
}
