'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { SmokeBackground } from '../components/smoke-background';
import { CursorGlow } from '../components/cursor-glow';

// Dynamic imports to avoid SSR issues
const VRLearningHub = dynamic(() => import('@/components/VRLearningHub'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-white">Loading VR Learning Hub...</p>
      </div>
    </div>
  )
});

const AnimatedBackground = dynamic(() => import('@/components/AnimatedSphere'), {
  ssr: false
});

export default function VRLearningPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Initializing VR Environment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* Decorative/background layers */}
      <SmokeBackground />
      {/* <AnimatedBackground /> */}
      <CursorGlow />

      {/* Main VR Hub */}
      <VRLearningHub />
    </div>
  );
}