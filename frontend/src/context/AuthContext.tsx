import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as authLogin, refreshToken, getProfile } from '../api/auth';
import { AuthResponse, User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshAuthToken: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (token) {
          const userData = await getProfile(token);
          setUser(userData);
        }
      } catch (error) {
        console.error('Failed to initialize auth', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [token]);

  const login = async (email: string, password: string) => {
    const { access_token, refresh_token } = await authLogin({ email, password });
    localStorage.setItem('token', access_token);
    localStorage.setItem('refreshToken', refresh_token);
    setToken(access_token);
    // const userData = await getProfile(access_token);
    // setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setToken(null);
    setUser(null);
  };

  const refreshAuthToken = async () => {
    const storedRefreshToken = localStorage.getItem('refreshToken');
    if (!storedRefreshToken) {
      logout();
      return;
    }

    try {
      const { access_token, refresh_token } = await refreshToken(storedRefreshToken);
      localStorage.setItem('token', access_token);
      localStorage.setItem('refreshToken', refresh_token);
      setToken(access_token);
    } catch (error) {
      console.error('Failed to refresh token', error);
      logout();
    }
  };

  const value = {
    user,
    token,
    login,
    logout,
    refreshAuthToken,
    isAuthenticated: !!token,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};