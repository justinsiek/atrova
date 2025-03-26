"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { Domine } from "next/font/google"
import { Mail, Lock, Sparkles } from 'lucide-react'
import { COLORS } from "@/constants/colors"
import { useAuth } from '@/contexts/AuthContext'

const API_URL = process.env.API_URL;

const domine = Domine({
  subsets: ['latin'],
  weight: '700',
})

const LoginPage = () => {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Use the auth context to login with all user info
      login(
        data.user.access_token, 
        data.user.refresh_token, 
        data.user.id,
        data.user.name || '',
        data.user.email
      );
      
      // Remember me functionality
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }

      // Redirect to dashboard
      window.location.href = '/dashboard';
      
    } catch (error) {
      console.error('Login error:', error);
      alert(error instanceof Error ? error.message : 'Failed to login');
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col relative overflow-hidden"
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
      
      {/* Decorative Calendar Elements */}
      <div 
        className="absolute top-40 right-48 h-36 w-36 rounded-lg rotate-12 shadow-md z-0 border-2 border-solid hidden lg:block"
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
      
      {/* Header */}
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
              Welcome back
            </h1>
            <p className="mb-8 text-center md:text-left" style={{ color: COLORS.mediumBrown }}>
              Sign in to continue managing your schedule with Atrova's intelligent time management solutions.
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
                  Resume where you left off
                </span>
              </div>
              
              <div className="flex items-center mb-6">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center mr-4"
                  style={{ backgroundColor: COLORS.eventPink }}
                >
                  <Sparkles color={COLORS.darkBrown} size={16} />
                </div>
                <span style={{ color: COLORS.mediumBrown }}>
                  New AI improvements every week
                </span>
              </div>
            </div>
          </div>
          
          {/* Right side - login form */}
          <div className="w-full md:w-7/12">
            <div 
              className="p-8 rounded-lg shadow-lg w-full max-w-md mx-auto relative"
              style={{ 
                backgroundColor: COLORS.paperWhite, 
                border: `1px solid ${COLORS.borderLight}` 
              }}
            >
              <div className="absolute -top-3 -right-3 flex items-center justify-center h-12 w-12 rounded-full shadow-md z-20"
                   style={{ backgroundColor: COLORS.accent1 }}>
                <Sparkles size={20} color="white" />
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
                  Sign In
                </button>
              </form>

              <div className="mt-6 text-center">
                <p style={{ color: COLORS.mediumBrown }}>
                  Don't have an account?{' '}
                  <Link 
                    href="/signup" 
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