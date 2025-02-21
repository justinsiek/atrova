"use client"

import Sidebar from "@/components/Sidebar"
import Calendar from "@/components/Calendar"
import { useState } from "react"

export default function Page() {
  const [showEventForm, setShowEventForm] = useState(false);

  return (
    <div className="flex h-screen bg-[#fbf7f4]">
      <Sidebar onNewEvent={() => setShowEventForm(true)} />
      <div className="flex-1">
        <Calendar showForm={showEventForm} setShowForm={setShowEventForm} />
      </div>
    </div>
  )
}
