"use client";

import type React from "react";
import { Suspense } from "react";
import { AuthProvider } from "@/lib/auth-context";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </Suspense>
  );
}