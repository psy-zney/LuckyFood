import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Alert, NativeModules, Platform } from 'react-native';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';
const GoogleSignin: any = {
  configure: () => {},
  hasPlayServices: async () => {},
  signIn: async () => ({ data: { user: null } }),
  signOut: async () => {},
};
import { useAppStore } from '../store';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
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
  const { user, setUser } = useAppStore();
  const [isAuthenticated, setIsAuthenticated] = useState(!!user.uid);
  const [isLoading, setIsLoading] = useState(false);
  const hasGoogleNativeModule = Boolean((NativeModules as any)?.RNGoogleSignin);

  useEffect(() => {
    if (!hasGoogleNativeModule) return;
    try {
      GoogleSignin.configure({
        iosClientId: '1060999764283-m1mmnunbr78e379s0q321m9btq3psm4d.apps.googleusercontent.com',
        webClientId: '1060999764283-ag0lc1hkfphaik6eg6f1tnmb5j08s7a9.apps.googleusercontent.com',
        offlineAccess: true,
      });
    } catch (e) {
      console.error('[Auth] GoogleSignin configure error:', e);
    }
  }, [hasGoogleNativeModule]);

  useEffect(() => {
    setIsAuthenticated(!!user.uid);
  }, [user.uid]);

  const login = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setIsAuthenticated(true);
    } catch (error) {
      console.error('[Auth] Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      if (!hasGoogleNativeModule) {
        Alert.alert(
          'Google Sign-In chưa sẵn sàng',
          Platform.OS === 'android'
            ? 'Bạn đang chạy bản app không có native module Google. Hãy build lại bằng `expo run:android` hoặc dev client.'
            : 'Bản app hiện tại chưa tích hợp native module Google Sign-In.'
        );
        return;
      }
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      const googleUser = response.data?.user;

      if (googleUser) {
        setUser({
          uid: googleUser.id,
          displayName: googleUser.name || 'Người dùng Google',
          email: googleUser.email,
          avatarUrl: googleUser.photo,
          role: 'user',
          currentStreak: 0,
          highestStreak: 0,
          lastCookedDate: null,
          favoriteFoodIds: [],
        });
        setIsAuthenticated(true);
      }
    } catch (error: any) {
      console.error('[Auth] Google Login error:', error);
      if (error?.code !== 'SIGN_IN_CANCELLED') {
        Alert.alert('Lỗi đăng nhập', 'Không thể đăng nhập bằng Google. Vui lòng thử lại.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setIsAuthenticated(true);
    } catch (error) {
      console.error('[Auth] Register error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (hasGoogleNativeModule) {
        await GoogleSignin.signOut();
      }
    } catch (error) {
      console.error('[Auth] Google Logout error:', error);
    }
    setUser({
      uid: null,
      displayName: 'Khách',
      email: null,
      avatarUrl: null,
      role: 'user',
      currentStreak: 0,
      highestStreak: 0,
      lastCookedDate: null,
      favoriteFoodIds: [],
    });
    setIsAuthenticated(false);
  };

  const value: AuthContextType = {
    isAuthenticated,
    isLoading,
    login,
    loginWithGoogle,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
