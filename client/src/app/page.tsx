'use client'

import { useState } from "react";

export default function Home() {
  const [chat, setChat] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [schedule, setSchedule] = useState<any[]>([]);

  const handleSend = async () => {
    // Encode the chat input to safely include it in the URL
    const res = await fetch(`http://localhost:8080/api/chat?chat=${encodeURIComponent(chat)}`);
    const data = await res.json();
    setResponse(data.result);
    setSchedule(data.schedule);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-8">
      <div className="w-full max-w-5xl px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Chat Input and Response */}
          <div className="flex-1 space-y-8">
            {/* Chat Input Section */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h1 className="text-2xl font-bold mb-4">Chat Input</h1>
              <textarea
                className="w-full border border-gray-300 p-2 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                value={chat}
                onChange={(e) => setChat(e.target.value)}
                placeholder="Enter your chat here..."
              />
              <button
                onClick={handleSend}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Send
              </button>
            </div>

            {/* Response Section */}
            {response && (
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-3">Response</h2>
                <pre>{JSON.stringify(response, null, 2)}</pre>
              </div>
            )}
          </div>

          {/* Right Column: Schedule */}
          {schedule && schedule.length > 0 && (
            <div className="w-full lg:w-1/3">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Schedule</h2>
                <ul className="space-y-4">
                  {schedule.map((item, index) => (
                    <li key={index} className="border border-gray-200 p-4 rounded-md">
                      <p className="font-medium">
                        <span className="font-bold">Task:</span> {item.task}
                      </p>
                      <p className="mt-1">
                        <span className="font-bold">Date:</span> {item.timestamp}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
