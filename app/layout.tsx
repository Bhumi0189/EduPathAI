import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
// import BotpressChat from "@/components/BotpressChat";
import StudyTimeTracker from '@/components/StudyTimeTracker'

const inter = Inter({ subsets: ["latin"] });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
  : undefined;

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "EduPath AI | Personalized AI Learning Platform",
    template: "%s | EduPath AI",
  },
  description:
    "Learn faster with personalized AI coaching, adaptive learning paths, practical courses, quizzes, and immersive VR education from EduPath AI.",
  applicationName: "EduPath AI",
  keywords: [
    "AI learning platform",
    "personalized education",
    "AI tutor",
    "adaptive learning",
    "online courses",
    "VR learning",
    "career learning paths",
  ],
  authors: [{ name: "EduPath AI" }],
  creator: "EduPath AI",
  publisher: "EduPath AI",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: siteUrl ? { canonical: "/" } : undefined,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "EduPath AI",
    title: "EduPath AI | Personalized AI Learning Platform",
    description:
      "Personalized AI coaching, adaptive learning paths, practical courses, quizzes, and immersive VR education.",
  },
  twitter: {
    card: "summary",
    title: "EduPath AI | Personalized AI Learning Platform",
    description:
      "Personalized AI coaching and adaptive learning paths for smarter education.",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "EduPath AI",
  description: metadata.description,
  url: siteUrl?.toString(),
  educationalCredentialAwarded: "Learning certificates",
};

function AuthProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <StudyTimeTracker />
      {children}
      {/* Chatbot injected globally (if needed) */}
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <Suspense fallback={<div className="app-loading-screen"><div className="app-loading-spinner" /><span>Loading EduPath AI...</span></div>}>
          <AuthProviderWrapper>{children}</AuthProviderWrapper>
        </Suspense>
      </body>
    </html>
  );
}