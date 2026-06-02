
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type SubscriptionTier = "free" | "basic" | "premium" | "enterprise";

type User = {
  id: string;
  name: string;
  email: string;
  subscription: SubscriptionTier;
};

type AuthContextType = {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
  upgradePlan: (newPlan: SubscriptionTier) => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is in localStorage on initial load
    const savedUser = localStorage.getItem("linguaLiveUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    // Mock sign in - in real app, call your backend API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo: any email/password works
    const mockUser: User = {
      id: "1",
      name: email.split("@")[0],
      email,
      subscription: email.includes("premium") ? "premium" : email.includes("basic") ? "basic" : "free"
    };
    
    setUser(mockUser);
    localStorage.setItem("linguaLiveUser", JSON.stringify(mockUser));
  };

  const signUp = async (name: string, email: string, password: string) => {
    // Mock sign up - in real app, call your backend API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: Date.now().toString(),
      name,
      email,
      subscription: "free" // Default to free tier
    };
    
    setUser(mockUser);
    localStorage.setItem("linguaLiveUser", JSON.stringify(mockUser));
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("linguaLiveUser");
  };

  const upgradePlan = (newPlan: SubscriptionTier) => {
    if (user) {
      const updatedUser = { ...user, subscription: newPlan };
      setUser(updatedUser);
      localStorage.setItem("linguaLiveUser", JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, upgradePlan, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
