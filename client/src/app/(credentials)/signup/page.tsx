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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    
    if (!agreeToTerms) {
      alert("Please agree to the terms and conditions");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sign up');
      }

      // Redirect to login page on success
      window.location.href = '/login';
      
    } catch (error) {
      console.error('Signup error:', error);
      alert(error instanceof Error ? error.message : 'Failed to sign up');
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ backgroundColor: COLORS.background }}
    >
      {/* Enhanced Background Elements */}
      <div 
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-20 border-2 border-solid"
        style={{ 
          backgroundColor: COLORS.eventPink, 
          transform: "translate(20%, -30%)",
          borderColor: "#e3b3ac" 
        }}
      />
      <div 
        className="absolute top-[40%] right-[40%] w-[400px] h-[400px] rounded-full opacity-10 border-2 border-solid"
        style={{ 
          backgroundColor: COLORS.eventBlue, 
          borderColor: "#b6cede" 
        }}
      />
      <div 
        className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full opacity-20 border-2 border-solid"
        style={{ 
          backgroundColor: COLORS.eventMint, 
          transform: "translate(-20%, 30%)",
          borderColor: "#bacbb7" 
        }}
      />
      {/* Decorative Calendar Elements */}
      <div 
        className="absolute top-16 right-[47%] h-40 w-40 rounded-lg -rotate-12 shadow-md z-0 border-2 border-solid hidden lg:block"
        style={{ 
          backgroundColor: COLORS.eventPink,
          borderColor: "#e3b3ac"
        }}
      />
      <div 
        className="absolute bottom-12 right-[12%] h-48 w-48 rounded-lg rotate-12 shadow-md z-0 border-2 border-solid hidden lg:block"
        style={{ 
          backgroundColor: COLORS.eventMint,
          borderColor: "#bacbb7"
        }}
      />
      <div 
        className="absolute top-40 left-48 h-36 w-36 rounded-lg -rotate-12 shadow-sm z-0 border-2 border-solid hidden lg:block"
        style={{ 
          backgroundColor: COLORS.eventBlue, 
          opacity: 0.8,
          borderColor: "#b6cede"
        }}
      />
      <div 
        className="absolute bottom-60 right-[54%] h-24 w-24 rounded-lg rotate-12 shadow-sm z-0 border-2 border-solid hidden lg:block"
        style={{ 
          backgroundColor: COLORS.eventOrange, 
          opacity: 0.8,
          borderColor: "#e7c3a7"
        }}
      />
      
      {/* Header Area */}
      <header className="w-full px-6 pt-6 flex justify-between items-center z-10">
        <div className="flex items-center">
          <Link href="/">
            <span className={`text-3xl font-bold ${domine.className}`} style={{ color: COLORS.darkBrown }}>
              atrova
            </span>
          </Link>
        </div>
      </header>
      
      {/* Content Container with Enhanced Styling */}
      <main className="flex-1 flex items-center justify-center z-10 px-6 mt-[-3rem]">
        <div className="w-full max-w-5xl flex flex-col md:flex-row items-center gap-12 relative">        
          {/* Left side content with enhanced styling */}
          <div className="w-full md:w-5/12">
            <h1 
              className={`text-4xl font-bold ${domine.className} mb-6 text-center md:text-left`}
              style={{ color: COLORS.darkBrown }}
            >
              Join Atrova today
            </h1>
            <p className="mb-8 text-center md:text-left text-lg" style={{ color: COLORS.mediumBrown }}>
              Create your account and start organizing your schedule with our AI-powered calendar.
            </p>
            
            <div className="hidden md:block space-y-8">
              <div className="flex items-center">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mr-5 shadow-sm transform transition-transform duration-300 hover:scale-110"
                  style={{ backgroundColor: COLORS.eventMint }}
                >
                  <Sparkles color={COLORS.darkBrown} size={18} />
                </div>
                <div>
                  <h3 className="font-medium mb-1" style={{ color: COLORS.darkBrown }}>AI-powered scheduling</h3>
                  <p className="text-sm" style={{ color: COLORS.mediumBrown }}>Get intelligent suggestions for optimal time management</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mr-5 shadow-sm transform transition-transform duration-300 hover:scale-110"
                  style={{ backgroundColor: COLORS.eventPink }}
                >
                  <User color={COLORS.darkBrown} size={18} />
                </div>
                <div>
                  <h3 className="font-medium mb-1" style={{ color: COLORS.darkBrown }}>Personalized experience</h3>
                  <p className="text-sm" style={{ color: COLORS.mediumBrown }}>Calendar that adapts to your unique preferences</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mr-5 shadow-sm transform transition-transform duration-300 hover:scale-110"
                  style={{ backgroundColor: COLORS.eventBlue }}
                >
                  <ChevronRight color={COLORS.darkBrown} size={18} />
                </div>
                <div>
                  <h3 className="font-medium mb-1" style={{ color: COLORS.darkBrown }}>Quick onboarding</h3>
                  <p className="text-sm" style={{ color: COLORS.mediumBrown }}>Start organizing your life in just a few minutes</p>
                </div>
              </div>
            </div>

            {/* Testimonial section */}
            <div className="hidden md:block mt-12 p-5 rounded-lg border border-gray-100 shadow-sm" 
                 style={{ 
                   backgroundColor: "#f7f5f2", // Slightly darker than background
                   borderColor: COLORS.borderLight 
                 }}>
              <div className="flex items-center mb-3">
                <div>
                  <div className="font-medium" style={{ color: COLORS.darkBrown }}>Leo W.</div>
                  <div className="text-xs" style={{ color: COLORS.lightBrown }}>Photographer</div>
                </div>
              </div>
              <p className="text-sm italic" style={{ color: COLORS.mediumBrown }}>
                "Atrova changed my life. The AI suggestions are surprisingly accurate!"
              </p>
            </div>
          </div>
          
          {/* Sign-up Form with enhanced styling */}
          <div className="w-full md:w-7/12">
            <div 
              className="relative p-8 rounded-xl shadow-lg z-10 transition-all duration-300 hover:shadow-xl"
              style={{ 
                backgroundColor: COLORS.paperWhite, 
                border: `1px solid ${COLORS.borderLight}`,
                boxShadow: '0 10px 25px rgba(0,0,0,0.05)'
              }}
            >
              <div className="absolute -top-3 -right-3 flex items-center justify-center h-14 w-14 rounded-full shadow-md z-20 transform transition-transform duration-300 hover:scale-110"
                   style={{ backgroundColor: COLORS.accent1 }}>
                <Sparkles size={22} color="white" />
              </div>
              
              <div className="text-center mb-8">
                <h2 
                  className={`text-2xl font-bold ${domine.className}`}
                  style={{ color: COLORS.darkBrown }}
                >
                  Create your account
                </h2>
                <p className="mt-2" style={{ color: COLORS.mediumBrown }}>
                  Fill in your details to get started with Atrova
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
                  className="w-full flex items-center justify-center px-6 py-3 rounded-lg transition-all duration-200 focus:outline-none text-white hover:shadow-md hover:scale-[1.02] transform"
                  style={{ backgroundColor: COLORS.accent1 }}
                >
                  Create Account
                  <ChevronRight size={18} className="ml-2" />
                </button>
              </form>

              <div className="mt-8 text-center">
                <p style={{ color: COLORS.mediumBrown }}>
                  Already have an account?{' '}
                  <Link 
                    href="/login" 
                    className="hover:underline transition-colors duration-200"
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
    </div>
  )
}

export default SignupPage