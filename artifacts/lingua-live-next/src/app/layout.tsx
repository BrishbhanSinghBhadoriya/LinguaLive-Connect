import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppDataProvider } from "@/contexts/AppDataContext";

export const metadata: Metadata = {
  title: "LinguaLive AI – Real-Time Voice Translation",
  description:
    "Real-time AI voice translation for Indian languages. Speak in one language, hear it in another — instantly.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <AppDataProvider>
            {children}
          </AppDataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
