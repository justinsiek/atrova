'use client'

import { useState } from "react";

export default function Home() {
  const [chat, setChat] = useState("");
  const [response, setResponse] = useState("");
  const [schedule, setSchedule] = useState([]);

  const handleSend = async () => {
    const response = await fetch(`http://localhost:8080/api/chat?chat=${chat}`);
    const data = await response.json();
    setResponse(data.result);
    setSchedule(data.schedule);
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <div className="flex items-center justify-center">
        <input type="text" value={chat} onChange={(e) => setChat(e.target.value)} placeholder="Enter chat here..." />
        <button onClick={handleSend}>Send</button>
      </div>
      <h1>{response}</h1>
      <h2>Schedule:</h2>
      <ul>
        {schedule.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
