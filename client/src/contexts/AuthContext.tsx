'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  userId: string | null;
  userName: string | null;
  userEmail: string | null;
  login: (accessToken: string, refreshToken: string, userId: string, userName: string, userEmail: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  userId: null,
  userName: null,
  userEmail: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const refreshToken = async (): Promise<boolean> => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        return false;
      }
      
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }
      
      const data = await response.json();
      
      localStorage.setItem('accessToken', data.user.access_token);
      localStorage.setItem('refreshToken', data.user.refresh_token);
      
      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  };

  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const id = localStorage.getItem('userId');
        const name = localStorage.getItem('userName');
        const email = localStorage.getItem('userEmail');
        
        if (token && id) {
          // Optionally validate token with server here
          setIsAuthenticated(true);
          setUserId(id);
          setUserName(name);
          setUserEmail(email);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        // Don't logout here, just set authenticated to false
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
    
    // Set up token refresh interval
    const refreshInterval = setInterval(async () => {
      if (isAuthenticated) {
        await refreshToken();
      }
    }, 7 * 24 * 60 * 60 * 1000); // Refresh every 7 days
    
    return () => clearInterval(refreshInterval);
  }, [isAuthenticated]);

  const login = (accessToken: string, refreshToken: string, userId: string, userName: string, userEmail: string) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('userId', userId);
    localStorage.setItem('userName', userName || '');
    localStorage.setItem('userEmail', userEmail || '');
    setIsAuthenticated(true);
    setUserId(userId);
    setUserName(userName);
    setUserEmail(userEmail);
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('rememberMe');
    setIsAuthenticated(false);
    setUserId(null);
    setUserName(null);
    setUserEmail(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isLoading,
      userId, 
      userName, 
      userEmail, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 