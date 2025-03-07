"use client"

import React, { useState } from 'react'
import { Domine } from "next/font/google"
import Link from 'next/link'
import { COLORS } from "@/constants/colors"
import { Calendar, Mail, Lock } from 'lucide-react'

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
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ backgroundColor: COLORS.background }}
    >
      <div 
        className="w-full max-w-md"
        style={{ maxWidth: "480px" }}
      >
        {/* Login Form with Accent Elements */}
        <div className="relative">
          {/* Colored Accent Elements */}
          <div 
            className="absolute -top-4 -right-16 w-48 h-48 rounded-lg rotate-12 shadow-sm"
            style={{ backgroundColor: COLORS.eventPink }}
          />
          <div 
            className="absolute -bottom-6 -left-12 w-48 h-48 rounded-lg -rotate-12 shadow-sm"
            style={{ backgroundColor: COLORS.eventMint }}
          />
          
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
                <Calendar size={18} className="mr-2" />
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
      <div className="mt-8 text-center text-sm" style={{ color: COLORS.lightBrown }}>
        &copy; {new Date().getFullYear()} Atrova. All rights reserved.
      </div>
    </div>
  )
}

export default LoginPage