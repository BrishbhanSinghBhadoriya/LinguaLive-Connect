"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type TranslationHistoryItem = {
  id: string;
  date: string;
  sourceText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
};

type AppDataType = {
  translationsToday: number;
  history: TranslationHistoryItem[];
  isLoading: boolean;
  addTranslation: (source: string, translated: string, sourceLang: string, targetLang: string) => void;
  refreshData: () => void;
};

const AppDataContext = createContext<AppDataType | undefined>(undefined);

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [translationsToday, setTranslationsToday] = useState<number>(0);
  const [history, setHistory] = useState<TranslationHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch data from "API" on mount
  const refreshData = async () => {
    setIsLoading(true);
    try {
      await delay(800); // Simulate API call
      
      // Mock API response
      const mockData = {
        translationsToday: Math.floor(Math.random() * 10),
        history: [
          {
            id: "1",
            date: "2 minutes ago",
            sourceText: "Hello, how are you?",
            translatedText: "नमस्ते, आप कैसे हैं?",
            sourceLang: "English",
            targetLang: "Hindi"
          },
          {
            id: "2",
            date: "1 hour ago",
            sourceText: "Thank you very much",
            translatedText: "धन्यवाद",
            sourceLang: "English",
            targetLang: "Hindi"
          },
          {
            id: "3",
            date: "Yesterday",
            sourceText: "See you tomorrow",
            translatedText: "कल मिलते हैं",
            sourceLang: "English",
            targetLang: "Hindi"
          }
        ]
      };
      
      setTranslationsToday(mockData.translationsToday);
      setHistory(mockData.history);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addTranslation = async (source: string, translated: string, sourceLang: string, targetLang: string) => {
    setIsLoading(true);
    try {
      await delay(500); // Simulate API call
      
      const newTranslation: TranslationHistoryItem = {
        id: Date.now().toString(),
        date: "Just now",
        sourceText: source,
        translatedText: translated,
        sourceLang,
        targetLang
      };
      
      setHistory(prev => [newTranslation, ...prev]);
      setTranslationsToday(prev => prev + 1);
    } catch (error) {
      console.error("Failed to add translation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <AppDataContext.Provider value={{ translationsToday, history, isLoading, addTranslation, refreshData }}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (context === undefined) {
    throw new Error("useAppData must be used within an AppDataProvider");
  }
  return context;
}
