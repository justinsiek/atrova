"use client"

import React, { useState } from 'react'
import { Domine } from "next/font/google"
import Link from 'next/link'
import { COLORS } from "@/constants/colors"
import { Mail, Lock, User, ChevronRight, Sparkles } from 'lucide-react'

const domine = Domine({
  subsets: ['latin'],
  weight: '700',
})

const SignupPage = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreeToTerms, setAgreeToTerms] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle sign up logic here
    console.log({ name, email, password, confirmPassword, agreeToTerms })
  }

  return (
    <div 
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ backgroundColor: COLORS.background }}
    >
      {/* Background Decorative Elements */}
      <div 
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-20 border-2 border-solid"
        style={{ 
          backgroundColor: COLORS.eventPink, 
          transform: "translate(20%, -30%)",
          borderColor: "#e3b3ac" 
        }}
      />
      <div 
        className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-20 border-2 border-solid"
        style={{ 
          backgroundColor: COLORS.eventMint, 
          transform: "translate(-20%, 30%)",
          borderColor: "#bacbb7" 
        }}
      />
      
      {/* Decorative Calendar Elements */}
      <div 
        className="absolute top-40 right-20 h-36 w-36 rounded-lg rotate-12 shadow-md z-0 border-2 border-solid hidden lg:block"
        style={{ 
          backgroundColor: COLORS.eventPink,
          borderColor: "#e3b3ac"
        }}
      />
      <div 
        className="absolute bottom-40 left-20 h-36 w-36 rounded-lg -rotate-12 shadow-md z-0 border-2 border-solid hidden lg:block"
        style={{ 
          backgroundColor: COLORS.eventMint,
          borderColor: "#bacbb7"
        }}
      />
      <div 
        className="absolute top-80 left-28 h-28 w-28 rounded-lg -rotate-12 shadow-sm z-0 border-2 border-solid hidden lg:block"
        style={{ 
          backgroundColor: COLORS.eventBlue, 
          opacity: 0.8,
          borderColor: "#b6cede"
        }}
      />
      <div 
        className="absolute bottom-60 right-40 h-24 w-24 rounded-lg rotate-12 shadow-sm z-0 border-2 border-solid hidden lg:block"
        style={{ 
          backgroundColor: COLORS.eventOrange, 
          opacity: 0.8,
          borderColor: "#e7c3a7"
        }}
      />
      
      {/* Header Area */}
      <header className="w-full p-6 flex justify-between items-center z-10">
        <div className="flex items-center">
          <Link href="/">
            <span className={`text-3xl font-bold ${domine.className}`} style={{ color: COLORS.darkBrown }}>
              atrova
            </span>
          </Link>
        </div>
      </header>
      
      {/* Content Container */}
      <main className="flex-1 flex items-center justify-center z-10 px-6 py-12">
        <div className="w-full max-w-4xl flex flex-col md:flex-row items-center gap-12">
          {/* Left side content */}
          <div className="w-full md:w-5/12">
            <h1 
              className={`text-3xl font-bold ${domine.className} mb-6 text-center md:text-left`}
              style={{ color: COLORS.darkBrown }}
            >
              Join Atrova today
            </h1>
            <p className="mb-6 text-center md:text-left" style={{ color: COLORS.mediumBrown }}>
              Create your account and start organizing your schedule with our AI-powered calendar.
            </p>
            
            <div className="hidden md:block">
              <div className="flex items-center mb-6">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center mr-4"
                  style={{ backgroundColor: COLORS.eventMint }}
                >
                  <Sparkles color={COLORS.darkBrown} size={16} />
                </div>
                <span style={{ color: COLORS.mediumBrown }}>
                  AI-powered scheduling suggestions
                </span>
              </div>
              
              <div className="flex items-center mb-6">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center mr-4"
                  style={{ backgroundColor: COLORS.eventPink }}
                >
                  <User color={COLORS.darkBrown} size={16} />
                </div>
                <span style={{ color: COLORS.mediumBrown }}>
                  Personalized time management
                </span>
              </div>
              
              <div className="flex items-center">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center mr-4"
                  style={{ backgroundColor: COLORS.eventBlue }}
                >
                  <ChevronRight color={COLORS.darkBrown} size={16} />
                </div>
                <span style={{ color: COLORS.mediumBrown }}>
                  Start organizing in minutes
                </span>
              </div>
            </div>
          </div>
          
          {/* Sign-up Form */}
          <div className="w-full md:w-7/12">
            <div 
              className="relative p-8 rounded-lg shadow-lg z-10"
              style={{ 
                backgroundColor: COLORS.paperWhite, 
                border: `1px solid ${COLORS.borderLight}`,
                boxShadow: '0 10px 25px rgba(0,0,0,0.05)'
              }}
            >
              <div className="absolute -top-3 -right-3 flex items-center justify-center h-12 w-12 rounded-full shadow-md z-20"
                   style={{ backgroundColor: COLORS.accent1 }}>
                <Sparkles size={20} color="white" />
              </div>
              
              <div className="text-center mb-6">
                <h2 
                  className={`text-2xl font-bold ${domine.className}`}
                  style={{ color: COLORS.darkBrown }}
                >
                  Create your account
                </h2>
                <p className="mt-2" style={{ color: COLORS.mediumBrown }}>
                  Fill in your details to get started
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label 
                    htmlFor="name" 
                    className="block text-sm font-medium mb-2"
                    style={{ color: COLORS.darkBrown }}
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={18} color={COLORS.lightBrown} />
                    </div>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 block w-full border rounded-lg p-3 bg-white focus:outline-none transition-colors duration-200"
                      style={{ 
                        borderColor: COLORS.borderMedium,
                        color: COLORS.darkBrown
                      }}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label 
                    htmlFor="email" 
                    className="block text-sm font-medium mb-2"
                    style={{ color: COLORS.darkBrown }}
                  >
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={18} color={COLORS.lightBrown} />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 block w-full border rounded-lg p-3 bg-white focus:outline-none transition-colors duration-200"
                      style={{ 
                        borderColor: COLORS.borderMedium,
                        color: COLORS.darkBrown
                      }}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label 
                    htmlFor="password" 
                    className="block text-sm font-medium mb-2"
                    style={{ color: COLORS.darkBrown }}
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} color={COLORS.lightBrown} />
                    </div>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 block w-full border rounded-lg p-3 bg-white focus:outline-none transition-colors duration-200"
                      style={{ 
                        borderColor: COLORS.borderMedium,
                        color: COLORS.darkBrown
                      }}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label 
                    htmlFor="confirmPassword" 
                    className="block text-sm font-medium mb-2"
                    style={{ color: COLORS.darkBrown }}
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} color={COLORS.lightBrown} />
                    </div>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 block w-full border rounded-lg p-3 bg-white focus:outline-none transition-colors duration-200"
                      style={{ 
                        borderColor: COLORS.borderMedium,
                        color: COLORS.darkBrown
                      }}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <div className="mb-6 flex items-center">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="h-4 w-4 rounded"
                    style={{ 
                      borderColor: COLORS.borderMedium,
                      color: COLORS.accent1
                    }}
                    required
                  />
                  <label 
                    htmlFor="terms" 
                    className="ml-2 block text-sm"
                    style={{ color: COLORS.mediumBrown }}
                  >
                    I agree to the <a href="#" className="underline" style={{ color: COLORS.accent1 }}>Terms of Service</a> and <a href="#" className="underline" style={{ color: COLORS.accent1 }}>Privacy Policy</a>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center px-6 py-3 rounded-lg transition-all duration-200 focus:outline-none text-white hover:shadow-md"
                  style={{ backgroundColor: COLORS.accent1 }}
                >
                  Create Account
                  <ChevronRight size={18} className="ml-2" />
                </button>
              </form>

              <div className="mt-6 text-center">
                <p style={{ color: COLORS.mediumBrown }}>
                  Already have an account?{' '}
                  <Link 
                    href="/login" 
                    className="hover:underline"
                    style={{ color: COLORS.accent1, fontWeight: 'bold' }}
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-6 px-6 text-center z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-sm" style={{ color: COLORS.lightBrown }}>
            &copy; {new Date().getFullYear()} Atrova. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default SignupPage