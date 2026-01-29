import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/api';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  token: string;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  updateAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const updateAuth = () => {
    const currentToken = apiService.getToken();
    setToken(currentToken);
    
    if (currentToken) {
      const payload = apiService.parseJwt(currentToken);
      if (payload) {
        const userData: User = {
          username: payload.sub || '',
          roles: payload.roles || []
        };
        setUser(userData);
        setIsAuthenticated(true);
        // Invalidar todas las queries para recargar datos
        queryClient.invalidateQueries();
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } else {
      setUser(null);
      setIsAuthenticated(false);
      // Limpiar el cache de queries cuando se cierre sesión
      queryClient.clear();
    }
  };

  useEffect(() => {
    updateAuth();
  }, [queryClient]);

  const login = async (username: string, password: string) => {
    try {
      const response = await apiService.login(username, password);
      apiService.setToken(response.accessToken);
      updateAuth();
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    apiService.clearToken();
    setUser(null);
    setToken('');
    setIsAuthenticated(false);
    // Limpiar el cache de queries
    queryClient.clear();
  };

  const isAdmin = user?.roles.includes('ROLE_ADMIN') || false;

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isAdmin,
    token,
    login,
    logout,
    updateAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
