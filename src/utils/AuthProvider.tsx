import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAppStore } from '../store';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { user } = useAppStore();
  const [isAuthenticated, setIsAuthenticated] = useState(!!user.uid);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!user.uid);
  }, [user.uid]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate login - trong thực tế sẽ gọi API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsAuthenticated(true);
    } catch (error) {
      console.error('[Auth] Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate registration - trong thực tế sẽ gọi API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsAuthenticated(true);
    } catch (error) {
      console.error('[Auth] Register error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const value: AuthContextType = {
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
