import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../app/globals.css";
import { AuthProvider } from "@/lib/auth-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EduPath AI - Personalized Learning Platform",
  description:
    "Transform your learning journey with AI-powered personalized education, VR experiences, and adaptive learning paths.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}