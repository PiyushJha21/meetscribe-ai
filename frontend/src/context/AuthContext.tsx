"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ApiServiceError,
  getMeApi,
  getStoredToken,
  loginApi,
  logoutApi,
  removeStoredToken,
  setStoredToken,
} from "@/services/api";
import { User } from "@/types";

export interface LoginResult {
  success: boolean;
  user?: User;
  error?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const initAuth = useCallback(async () => {
    const storedToken = getStoredToken();
    if (!storedToken) {
      setUser(null);
      setToken(null);
      setIsLoading(false);
      return;
    }

    setToken(storedToken);
    try {
      const currentUser = await getMeApi();
      setUser(currentUser);
    } catch {
      removeStoredToken();
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const login = async (email: string, password: string): Promise<LoginResult> => {
    setIsLoading(true);
    try {
      const response = await loginApi({ email, password });
      setStoredToken(response.access_token);
      setToken(response.access_token);
      setUser(response.user);
      return { success: true, user: response.user };
    } catch (err: unknown) {
      let message = "Invalid email or password. Please try again.";
      if (err instanceof ApiServiceError) {
        if (err.status === 401) {
          message = err.message || "Invalid email or password. Please try again.";
        } else if (err.status === 0) {
          message = "Unable to connect to MeetScribe API. Please ensure the backend server is running.";
        } else {
          message = err.message || `Server error (${err.status}). Please try again later.`;
        }
      } else if (err instanceof Error) {
        message = err.message;
      }
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await logoutApi();
    } catch {
      // Best-effort logout call
    } finally {
      removeStoredToken();
      setUser(null);
      setToken(null);
      router.push("/login");
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const currentUser = await getMeApi();
      setUser(currentUser);
    } catch {
      // Ignored if session is invalid
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
