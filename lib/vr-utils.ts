// Utility functions for VR functionality

export interface VRVideo {
  id: number;
  title: string;
  youtubeId: string;
  instructor: string;
  duration: string;
  students: number;
  rating: number;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  subject: string;
  vrSupported: boolean;
  concepts: string[];
  vrFeatures: string[];
  thumbnail: string;
}

export interface VRSession {
  id: string;
  title: string;
  instructor: string;
  subject: string;
  startTime: string;
  duration: string;
  participants: number;
  maxParticipants: number;
  status: 'live' | 'upcoming' | 'ended';
  description: string;
}

// VR Device Detection
export const detectVRDevice = async (): Promise<{
  isVRSupported: boolean;
  deviceName: string | null;
  capabilities: string[];
}> => {
  if (typeof navigator === 'undefined') {
    return { isVRSupported: false, deviceName: null, capabilities: [] };
  }

  const capabilities: string[] = [];
  let deviceName: string | null = null;
  let isVRSupported = false;

  // Check for WebXR support
  if ('xr' in navigator) {
    try {
      const isImmersiveVRSupported = await (navigator as any).xr.isSessionSupported('immersive-vr');
      if (isImmersiveVRSupported) {
        isVRSupported = true;
        capabilities.push('WebXR', 'Immersive VR');
        deviceName = 'WebXR Compatible Device';
      }
    } catch (error) {
      console.log('WebXR not available:', error);
    }
  }

  // Check for WebVR (legacy)
  if ('getVRDisplays' in navigator) {
    try {
      const displays = await (navigator as any).getVRDisplays();
      if (displays.length > 0) {
        isVRSupported = true;
        deviceName = displays[0].displayName;
        capabilities.push('WebVR');
      }
    } catch (error) {
      console.log('WebVR not available:', error);
    }
  }

  // Check for mobile VR capabilities
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  if (isMobile) {
    capabilities.push('Mobile VR', 'Google Cardboard');
  }

  return { isVRSupported, deviceName, capabilities };
};

// VR Analytics Tracking
export const trackVREvent = (eventType: string, data: any) => {
  // Send analytics to your preferred service
  console.log('VR Event:', eventType, data);
  
  // Example: Send to Google Analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventType, {
      event_category: 'VR Learning',
      event_label: data.videoId || data.courseId,
      value: data.duration || 0
    });
  }
};

// Video Quality Optimization
export const getOptimalVideoQuality = (connection: any): string => {
  if (!connection) return '1080p';
  
  const effectiveType = connection.effectiveType;
  const downlink = connection.downlink;
  
  if (effectiveType === '4g' && downlink > 10) return '2160p'; // 4K
  if (effectiveType === '4g' && downlink > 5) return '1440p';  // QHD
  if (effectiveType === '4g') return '1080p';                  // HD
  if (effectiveType === '3g') return '720p';                   // SD
  return '480p'; // Low quality fallback
};
