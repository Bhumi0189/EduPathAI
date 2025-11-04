// STEP 10: Create hooks/useVRAnalytics.ts
// Analytics hook for tracking VR learning progress

'use client';

import { useState, useEffect } from 'react';

interface VRAnalyticsData {
  totalVRTime: number;
  sessionsCompleted: number;
  averageEngagement: number;
  preferredSubjects: string[];
  completionRate: number;
}

export const useVRAnalytics = (userId: string) => {
  const [analytics, setAnalytics] = useState<VRAnalyticsData>({
    totalVRTime: 0,
    sessionsCompleted: 0,
    averageEngagement: 0,
    preferredSubjects: [],
    completionRate: 0
  });

  const trackVideoStart = (videoId: string, subject: string) => {
    const event = {
      userId,
      videoId,
      subject,
      timestamp: new Date().toISOString(),
      eventType: 'video_start'
    };
    
    // Store in localStorage for now (in production, send to your backend)
    const events = JSON.parse(localStorage.getItem('vr_events') || '[]');
    events.push(event);
    localStorage.setItem('vr_events', JSON.stringify(events));
  };

  const trackVideoComplete = (videoId: string, subject: string, duration: number) => {
    const event = {
      userId,
      videoId,
      subject,
      duration,
      timestamp: new Date().toISOString(),
      eventType: 'video_complete'
    };
    
    const events = JSON.parse(localStorage.getItem('vr_events') || '[]');
    events.push(event);
    localStorage.setItem('vr_events', JSON.stringify(events));
    
    // Update analytics
    updateAnalytics();
  };

  const trackVRModeToggle = (videoId: string, isVRMode: boolean) => {
    const event = {
      userId,
      videoId,
      isVRMode,
      timestamp: new Date().toISOString(),
      eventType: 'vr_mode_toggle'
    };
    
    const events = JSON.parse(localStorage.getItem('vr_events') || '[]');
    events.push(event);
    localStorage.setItem('vr_events', JSON.stringify(events));
  };

  const updateAnalytics = () => {
    const events = JSON.parse(localStorage.getItem('vr_events') || '[]');
    const userEvents = events.filter((event: any) => event.userId === userId);
    
    const completedVideos = userEvents.filter((event: any) => event.eventType === 'video_complete');
    const totalTime = completedVideos.reduce((sum: number, event: any) => sum + (event.duration || 0), 0);
    
    const subjectCounts = completedVideos.reduce((counts: any, event: any) => {
      counts[event.subject] = (counts[event.subject] || 0) + 1;
      return counts;
    }, {});
    
    const preferredSubjects = Object.entries(subjectCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([subject]) => subject);

    setAnalytics({
      totalVRTime: Math.round(totalTime / 60), // Convert to minutes
      sessionsCompleted: completedVideos.length,
      averageEngagement: completedVideos.length > 0 ? 85 : 0, // Mock engagement score
      preferredSubjects,
      completionRate: completedVideos.length > 0 ? 78 : 0 // Mock completion rate
    });
  };

  useEffect(() => {
    updateAnalytics();
  }, [userId]);

  return {
    analytics,
    trackVideoStart,
    trackVideoComplete,
    trackVRModeToggle
  };
};