import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
// import BotpressChat from "@/components/BotpressChat";
import StudyTimeTracker from '@/components/StudyTimeTracker'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EduPath AI - Personalized Learning Platform",
  description:
    "Transform your learning journey with AI-powered personalized education, VR experiences, and adaptive learning paths.",
};

function AuthProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <StudyTimeTracker />
      {children}
      {/* ✅ Chatbot injected globally (if needed) */}
      {/* <BotpressChat /> */}
    </AuthProvider>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Suspense fallback={<div>Loading...</div>}>
          <AuthProviderWrapper>{children}</AuthProviderWrapper>
        </Suspense>
      </body>
    </html>
  );
}