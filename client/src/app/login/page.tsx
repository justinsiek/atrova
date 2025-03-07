"use client"

import React, { useState } from 'react'
import { Domine } from "next/font/google"
import Link from 'next/link'
import { COLORS } from "@/constants/colors"
import {  Mail, Lock } from 'lucide-react'

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
      className="min-h-screen flex flex-col items-center justify-center p-6 md:p-0 relative overflow-hidden"
      style={{ backgroundColor: COLORS.background }}
    >
      {/* Background Decorative Elements */}
      <div 
        className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 border-2 border-solid"
        style={{ 
          backgroundColor: COLORS.eventPink, 
          transform: "translate(30%, -30%)",
          borderColor: "#e3b3ac" 
        }}
      />
      <div 
        className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-20 border-2 border-solid"
        style={{ 
          backgroundColor: COLORS.eventMint, 
          transform: "translate(-30%, 30%)",
          borderColor: "#bacbb7" 
        }}
      />
      
      {/* Header Area */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center">
        <div className="flex items-center">
          <span className={`text-2xl font-bold ${domine.className}`} style={{ color: COLORS.darkBrown }}>
            atrova
          </span>
        </div>
        <div className="text-sm" style={{ color: COLORS.mediumBrown }}>
          Need help? <a href="#" className="underline" style={{ color: COLORS.accent1 }}>Contact support</a>
        </div>
      </div>
      
      <div 
        className="w-full max-w-4xl flex items-center justify-center z-10"
      >
        {/* Login Form */}
        <div className="w-full max-w-md relative">
          {/* Decorative Calendar Elements */}
          <div 
            className="absolute -top-4 -right-8 h-36 w-36 rounded-lg rotate-12 shadow-md z-0 border-2 border-solid"
            style={{ 
              backgroundColor: COLORS.eventPink,
              borderColor: "#e3b3ac"
            }}
          ></div>
          
          <div 
            className="absolute -bottom-8 -left-8 h-36 w-36 rounded-lg -rotate-12 shadow-md z-0 border-2 border-solid"
            style={{ 
              backgroundColor: COLORS.eventMint,
              borderColor: "#bacbb7"
            }}
          ></div>
          
          {/* Small decorative elements */}
          <div 
            className="absolute top-20 -left-12 h-16 w-16 rounded-lg rotate-45 shadow-sm z-0 border-2 border-solid"
            style={{ 
              backgroundColor: COLORS.eventBlue, 
              opacity: 0.8,
              borderColor: "#b6cede"
            }}
          ></div>
          
          <div 
            className="absolute bottom-20 -right-14 h-20 w-20 rounded-lg rotate-45 shadow-sm z-0 border-2 border-solid"
            style={{ 
              backgroundColor: COLORS.eventOrange, 
              opacity: 0.8,
              borderColor: "#e7c3a7"
            }}
          ></div>
          
          {/* Login Form */}
          <div 
            className="relative p-8 rounded-lg shadow-lg z-10"
            style={{ backgroundColor: COLORS.paperWhite, border: `1px solid ${COLORS.borderLight}` }}
          >
            <div className="text-center mb-6">
              <h1 
                className={`text-3xl font-bold ${domine.className}`}
                style={{ color: COLORS.darkBrown }}
              >
                Welcome back
              </h1>
              <p className="mt-2" style={{ color: COLORS.mediumBrown }}>
                Sign in to continue to your calendar
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
      
      {/* Footer */}
      <div className="mt-16 mb-6 text-center text-sm z-10" style={{ color: COLORS.lightBrown }}>
        &copy; {new Date().getFullYear()} Atrova. All rights reserved.
      </div>
    </div>
  )
}

export default LoginPage