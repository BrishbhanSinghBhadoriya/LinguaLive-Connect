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
  signOut: () => Promise<void>;
  upgradePlan: (newPlan: SubscriptionTier) => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount — verify session cookie with server
  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then(r => r.json())
      .then(data => {
        if (data.user) setUser(data.user);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const signIn = async (email: string, password: string) => {
    const res = await fetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Sign in failed");
    setUser(data.user);
  };

  const signUp = async (name: string, email: string, password: string) => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Sign up failed");
    setUser(data.user);
  };

  const signOut = async () => {
    await fetch("/api/auth/signout", { method: "POST", credentials: "include" }).catch(() => {});
    setUser(null);
  };

  const upgradePlan = (newPlan: SubscriptionTier) => {
    if (user) setUser({ ...user, subscription: newPlan });
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, upgradePlan, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
