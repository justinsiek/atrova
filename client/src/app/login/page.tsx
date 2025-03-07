"use client"

import React, { useState } from 'react'
import { Domine } from "next/font/google"
import Link from 'next/link'
import { COLORS } from "@/constants/colors"
import { Mail, Lock } from 'lucide-react'

const domine = Domine({
  subsets: ['latin'],
  weight: '700',
})

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
    console.log({ email, password, rememberMe })
  }

  return (
    <div 
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ backgroundColor: COLORS.background }}
    >
      {/* Background Decorative Elements - Larger and positioned better */}
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
      
      {/* Header Area */}
      <header className="w-full p-6 flex justify-between items-center z-10">
        <div className="flex items-center">
          <Link href="/">
            <span className={`text-2xl font-bold ${domine.className}`} style={{ color: COLORS.darkBrown }}>
              atrova
            </span>
          </Link>
        </div>
        <div className="text-sm" style={{ color: COLORS.mediumBrown }}>
          Need help? <a href="#" className="underline" style={{ color: COLORS.accent1 }}>Contact support</a>
        </div>
      </header>
      
      {/* Content Container */}
      <main className="flex-1 flex items-center justify-center z-10 px-6 py-12">
        <div className="w-full max-w-4xl flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Left side content - Simple Minimal Design */}
          <div className="hidden md:block md:w-5/12">
            <h1 
              className={`text-3xl font-bold ${domine.className} mb-6`}
              style={{ color: COLORS.darkBrown }}
            >
              Welcome back to your AI-powered calendar
            </h1>
            <p className="mb-8" style={{ color: COLORS.mediumBrown }}>
              Log in to continue managing your schedule with Atrova's intelligent time management solutions.
            </p>
            
            {/* Simple Minimal Illustration */}
            <div className="flex justify-center">
              <div className="relative w-64 h-64 flex items-center justify-center">
                {/* Simple colored rectangles */}
                <div 
                  className="absolute w-40 h-40 rounded-lg transform rotate-45"
                  style={{ 
                    backgroundColor: COLORS.eventPink,
                    opacity: 0.3
                  }}
                ></div>
                
                <div 
                  className="absolute w-40 h-40 rounded-lg transform -rotate-12"
                  style={{ 
                    backgroundColor: COLORS.eventMint,
                    opacity: 0.3
                  }}
                ></div>
                
                <div 
                  className="absolute w-40 h-40 rounded-lg transform rotate-12"
                  style={{ 
                    backgroundColor: COLORS.eventBlue,
                    opacity: 0.3
                  }}
                ></div>
                
                {/* Simple logo-like center element */}
                <div 
                  className="absolute w-24 h-24 rounded-lg shadow-md z-10 flex items-center justify-center"
                  style={{ 
                    backgroundColor: COLORS.paperWhite,
                    transform: "rotate(45deg)"
                  }}
                >
                  <div 
                    className="w-12 h-12 rounded-full"
                    style={{ 
                      backgroundColor: COLORS.accent1,
                      opacity: 0.8
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Login Form */}
          <div className="w-full md:w-7/12 relative">
            <div 
              className="relative p-8 rounded-lg shadow-lg z-10"
              style={{ 
                backgroundColor: COLORS.paperWhite, 
                border: `1px solid ${COLORS.borderLight}`,
                boxShadow: '0 10px 25px rgba(0,0,0,0.05)'
              }}
            >
              <div className="text-center mb-6">
                <h2 
                  className={`text-3xl font-bold ${domine.className}`}
                  style={{ color: COLORS.darkBrown }}
                >
                  Sign In
                </h2>
                <p className="mt-2" style={{ color: COLORS.mediumBrown }}>
                  Continue to your calendar
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
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

                <div className="mb-6">
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

                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded"
                      style={{ 
                        borderColor: COLORS.borderMedium,
                        color: COLORS.accent1
                      }}
                    />
                    <label 
                      htmlFor="remember-me" 
                      className="ml-2 block text-sm"
                      style={{ color: COLORS.mediumBrown }}
                    >
                      Remember me
                    </label>
                  </div>
                  <Link 
                    href="/forgot-password" 
                    className="text-sm hover:underline"
                    style={{ color: COLORS.accent1 }}
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center px-6 py-3 rounded-lg transition-all duration-200 focus:outline-none text-white hover:shadow-md"
                  style={{ backgroundColor: COLORS.accent1 }}
                >
                  Log In
                </button>
              </form>

              <div className="mt-6 text-center">
                <p style={{ color: COLORS.mediumBrown }}>
                  Don't have an account?{' '}
                  <Link 
                    href="/register" 
                    className="hover:underline"
                    style={{ color: COLORS.accent1, fontWeight: 'bold' }}
                  >
                    Sign up
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

export default LoginPage