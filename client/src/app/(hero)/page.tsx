import React from 'react'
import Link from 'next/link'
import { Domine } from "next/font/google"
import { ChevronRight, Calendar, Sparkles, CheckCircle } from 'lucide-react'
import { COLORS } from "@/constants/colors"

const domine = Domine({
  subsets: ['latin'],
  weight: '700',
})

const Hero = () => {
  return (
    <div 
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ backgroundColor: COLORS.background }}
    >
      {/* Background Decorative Elements */}
      <div 
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-30 border-2 border-solid"
        style={{ 
          backgroundColor: COLORS.eventPink, 
          transform: "translate(30%, -30%)",
          borderColor: "#e3b3ac" 
        }}
      />
      <div 
        className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-20 border-2 border-solid"
        style={{ 
          backgroundColor: COLORS.eventMint, 
          transform: "translate(-30%, 30%)",
          borderColor: "#bacbb7" 
        }}
      />
      
      {/* Decorative Calendar Elements */}
      <div 
        className="absolute top-[40%] right-32 h-48 w-48 rounded-lg rotate-12 shadow-md z-0 border-2 border-solid hidden lg:block"
        style={{ 
          backgroundColor: COLORS.eventPink,
          borderColor: "#e3b3ac"
        }}
      />
      <div 
        className="absolute bottom-24 left-20 h-36 w-36 rounded-lg -rotate-12 shadow-md z-0 border-2 border-solid hidden lg:block"
        style={{ 
          backgroundColor: COLORS.eventMint,
          borderColor: "#bacbb7"
        }}
      />
      <div 
        className="absolute top-[21%] left-12 h-40 w-40 rounded-lg -rotate-12 shadow-sm z-0 border-2 border-solid hidden lg:block"
        style={{ 
          backgroundColor: COLORS.eventBlue, 
          opacity: 0.8,
          borderColor: "#b6cede"
        }}
      />
      <div 
        className="absolute bottom-96 right-1/4 h-24 w-24 rounded-lg rotate-12 shadow-sm z-0 border-2 border-solid hidden lg:block"
        style={{ 
          backgroundColor: COLORS.eventOrange, 
          opacity: 0.8,
          borderColor: "#e7c3a7"
        }}
      />
      
      {/* Header */}
      <header className="w-full pt-6 pb-10 px-6 flex justify-between items-center z-10">
        <div className="flex items-center">
          <span className={`text-3xl font-bold ${domine.className}`} style={{ color: COLORS.darkBrown }}>
            atrova
          </span>
        </div>
        <nav className="hidden md:flex space-x-8 items-center">
          <a href="/optin" className="text-sm font-medium hover:underline" style={{ color: COLORS.mediumBrown }}>
            Opt In Policy
          </a>
          <Link 
            href="/login" 
            className="text-sm font-medium hover:underline"
            style={{ color: COLORS.accent1 }}
          >
            Sign In
          </Link>
          <Link 
            href="/signup" 
            className="px-4 py-2 rounded-lg transition-all duration-200 text-white hover:shadow-md"
            style={{ backgroundColor: COLORS.accent1 }}
          >
            Get Started
          </Link>
        </nav>
        <div className="md:hidden">
          {/* Mobile menu button would go here */}
        </div>
      </header>
      
      {/* Hero Section */}
      <main className="flex-1 flex flex-col-reverse lg:flex-row lg:items-start justify-center px-6 py-12 lg:py-0 z-10 ml-16 mr-6">
        {/* Left column (copy) */}
        <div className="lg:w-1/2 pt-12 lg:pt-0 text-center lg:text-left mt-16">
          <h1 
            className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 ${domine.className}`}
            style={{ color: COLORS.darkBrown }}
          >
            Effortlessly organize your time with AI
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-lg mx-auto lg:mx-0" style={{ color: COLORS.mediumBrown }}>
            Let Atrova intelligently schedule your tasks and events, making your calendar work for you. Spend less time planning, more time doing.
          </p>
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              href="/signup" 
              className="px-8 py-3 rounded-lg transition-all duration-200 text-white hover:shadow-md flex items-center justify-center"
              style={{ backgroundColor: COLORS.accent1 }}
            >
              Start for free
              <ChevronRight size={18} className="ml-2" />
            </Link>
            <Link 
              href="/login" 
              className="px-8 py-3 rounded-lg transition-all duration-200 hover:bg-opacity-10 flex items-center justify-center"
              style={{ 
                border: `1px solid ${COLORS.accent1}`, 
                color: COLORS.accent1 
              }}
            >
              Log In
            </Link>
          </div>
        </div>
        
        {/* Right column (calendar preview) */}
        <div className="lg:w-3/5 mb-12 lg:mb-0 lg:mt-4">
          
            
            <img 
              src="/laptop.png" 
              alt="Atrova Calendar Preview" 
              className="w-full"
              style={{ borderColor: COLORS.borderLight }}
            />
            
            
        </div>
      </main>
      
      {/* Feature section */}
      <section id="features" className="py-16 px-6 z-10">
        <div className="max-w-6xl mx-auto">
          <h2 
            className={`text-3xl text-center font-bold mb-12 ${domine.className}`}
            style={{ color: COLORS.darkBrown }}
          >
            Intelligent scheduling that adapts to you
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div 
              className="p-6 rounded-lg shadow-md"
              style={{ backgroundColor: COLORS.paperWhite, border: `1px solid ${COLORS.borderLight}` }}
            >
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: COLORS.eventMint }}
              >
                <Calendar color={COLORS.darkBrown} size={20} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: COLORS.darkBrown }}>
                Smart Calendar
              </h3>
              <p style={{ color: COLORS.mediumBrown }}>
                View and manage your schedule with our intuitive, beautiful calendar interface.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div 
              className="p-6 rounded-lg shadow-md"
              style={{ backgroundColor: COLORS.paperWhite, border: `1px solid ${COLORS.borderLight}` }}
            >
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: COLORS.eventPink }}
              >
                <Sparkles color={COLORS.darkBrown} size={20} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: COLORS.darkBrown }}>
                AI Scheduling
              </h3>
              <p style={{ color: COLORS.mediumBrown }}>
                Let our AI find the perfect time slots for your tasks based on your preferences and habits.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div 
              className="p-6 rounded-lg shadow-md"
              style={{ backgroundColor: COLORS.paperWhite, border: `1px solid ${COLORS.borderLight}` }}
            >
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: COLORS.eventBlue }}
              >
                <CheckCircle color={COLORS.darkBrown} size={20} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: COLORS.darkBrown }}>
                Task Management
              </h3>
              <p style={{ color: COLORS.mediumBrown }}>
                Create, prioritize, and complete tasks with ease. Track your productivity over time.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonial section (optional) */}
      <section className="py-16 px-6 z-10" style={{ backgroundColor: 'rgba(203, 153, 126, 0.05)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xl italic mb-6" style={{ color: COLORS.mediumBrown }}>
            "Atrova has completely transformed how I manage my time. The AI scheduling feature is like having a personal assistant who knows my work habits perfectly."
          </p>
          <p className="font-bold" style={{ color: COLORS.darkBrown }}>
            — Andrew Hwang, Founder of Sonder
          </p>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-16 px-6 z-10">
        <div 
          className="max-w-4xl mx-auto p-8 rounded-lg text-center"
          style={{ backgroundColor: COLORS.paperWhite, border: `1px solid ${COLORS.borderLight}`, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
        >
          <h2 
            className={`text-3xl font-bold mb-4 ${domine.className}`}
            style={{ color: COLORS.darkBrown }}
          >
            Ready to take control of your schedule?
          </h2>
          <p className="text-lg mb-8" style={{ color: COLORS.mediumBrown }}>
            Join a few users who are already saving time with Atrova.
          </p>
          <Link 
            href="/signup" 
            className="px-8 py-3 rounded-lg transition-all duration-200 text-white hover:shadow-md inline-flex items-center justify-center"
            style={{ backgroundColor: COLORS.accent1 }}
          >
            Get started for free
            <ChevronRight size={18} className="ml-2" />
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="p-6 text-center z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-sm" style={{ color: COLORS.lightBrown }}>
            &copy; {new Date().getFullYear()} Atrova. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Hero;