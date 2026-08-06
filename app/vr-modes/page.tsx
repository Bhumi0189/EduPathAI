
'use client';

import React from 'react';
import PracticalVRIntegration from '@/components/PracticalVRIntegration';
import AnimatedBackground from '@/components/AnimatedSphere';

export default function VRModesPage() {
  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <PracticalVRIntegration />
    </div>
  );
}
