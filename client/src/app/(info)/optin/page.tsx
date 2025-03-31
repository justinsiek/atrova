import React from 'react';
import { COLORS } from "@/constants/colors";

export default function Optin() {
  return (
    <div 
      className="min-h-screen w-full py-6 px-6"
      style={{ backgroundColor: COLORS.background }}
    >
      <div className="w-full bg-white p-8 rounded-lg shadow-md border border-[#E2DFD8]" style={{ borderColor: COLORS.borderLight }}>
        <h1 className="text-3xl font-bold mb-6" style={{ color: COLORS.darkBrown }}>
          SMS Messaging Consent
        </h1>
        
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3" style={{ color: COLORS.darkBrown }}>
            How You Opt In to Receive SMS Messages
          </h2>
          <p className="mb-4" style={{ color: COLORS.mediumBrown }}>
            By providing your mobile phone number during the sign-up process and checking the consent checkbox, you agree to receive text messages from Atrova about your schedule, appointments, and related notifications. Your consent is not required as a condition of purchasing any goods or services.
          </p>
          
          <div className="border rounded-lg p-4 mb-4 bg-gray-50">
            <h3 className="font-semibold mb-2" style={{ color: COLORS.darkBrown }}>Sample Opt-in Interface:</h3>
            <div className="flex items-start mb-3">
              <input type="checkbox" disabled checked className="mt-1 mr-3" />
              <label style={{ color: COLORS.mediumBrown }}>
                I agree to receive text messages from Atrova about my schedule and appointments. Message & data rates may apply. Reply STOP to unsubscribe.
              </label>
            </div>
            <div className="flex items-center mt-4">
              <input 
                type="text" 
                placeholder="Phone Number" 
                disabled 
                className="px-4 py-2 border rounded mr-3" 
                style={{ borderColor: COLORS.borderLight }}
              />
              <button 
                disabled
                className="px-4 py-2 rounded-lg text-white"
                style={{ backgroundColor: COLORS.accent1, opacity: 0.8 }}
              >
                Submit
              </button>
            </div>
          </div>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3" style={{ color: COLORS.darkBrown }}>
            Message Frequency
          </h2>
          <p className="mb-3" style={{ color: COLORS.mediumBrown }}>
            Message frequency varies based on your scheduling needs. You may receive:
          </p>
          <ul className="list-disc pl-5 mb-4" style={{ color: COLORS.mediumBrown }}>
            <li>Appointment reminders and confirmations</li>
            <li>Schedule updates and changes</li>
            <li>Task due date notifications</li>
            <li>Responses to your schedule-related inquiries</li>
          </ul>
          <p style={{ color: COLORS.mediumBrown }}>
            Message and data rates may apply. Contact your wireless provider for details about your plan.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3" style={{ color: COLORS.darkBrown }}>
            Sample Messages
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg mb-4 border" style={{ borderColor: COLORS.borderLight }}>
            <p className="italic mb-2" style={{ color: COLORS.darkBrown }}>
              "Reminder: Your meeting with John Smith is tomorrow at 2:00 PM. Reply CONFIRM to confirm or RESCHEDULE to change."
            </p>
            <p className="italic mb-2" style={{ color: COLORS.darkBrown }}>
              "You've been assigned a new task: Complete Q1 Report. Due date: Friday, April 15. Reply INFO for more details."
            </p>
            <p className="italic" style={{ color: COLORS.darkBrown }}>
              "Hello from Atrova! You're now subscribed to schedule notifications. Reply HELP for assistance or STOP to unsubscribe."
            </p>
          </div>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3" style={{ color: COLORS.darkBrown }}>
            How to Opt Out of Receiving SMS Messages
          </h2>
          <p className="mb-3" style={{ color: COLORS.mediumBrown }}>
            You can opt out of receiving SMS messages from Atrova at any time by:
          </p>
          <ul className="list-disc pl-5 mb-4" style={{ color: COLORS.mediumBrown }}>
            <li>Replying to any of our messages with the word "STOP"</li>
            <li>Changing your notification preferences in your account settings</li>
            <li>Contacting our support team</li>
          </ul>
          <p style={{ color: COLORS.mediumBrown }}>
            After you opt out, we will send you a final message confirming that you have been unsubscribed. No further messages will be sent unless you opt back in.
          </p>
        </section>

          <p className="text-xs mt-8" style={{ color: COLORS.mediumBrown }}>
            This SMS consent policy was last updated on: March 31, 2025
          </p>
      </div>
    </div>
  );
}
