
'use client';

import { useState, useEffect } from 'react';
import { detectVRDevice, trackVREvent } from '@/lib/vr-utils';

export const useVRSupport = () => {
  const [isVRSupported, setIsVRSupported] = useState(false);
  const [isVRActive, setIsVRActive] = useState(false);
  const [vrDevice, setVRDevice] = useState<string | null>(null);
  const [vrCapabilities, setVRCapabilities] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkVRSupport = async () => {
      try {
        const vrInfo = await detectVRDevice();
        setIsVRSupported(vrInfo.isVRSupported);
        setVRDevice(vrInfo.deviceName);
        setVRCapabilities(vrInfo.capabilities);
      } catch (error) {
        console.error('Error checking VR support:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkVRSupport();
  }, []);

  const enterVR = async (videoId?: string) => {
    if (!isVRSupported) {
      alert('VR is not supported on this device. Try using a VR headset or mobile device with VR capabilities.');
      return false;
    }

    try {
      if ('xr' in navigator) {
        const session = await (navigator as any).xr.requestSession('immersive-vr');
        setIsVRActive(true);
        trackVREvent('vr_session_start', { videoId, device: vrDevice });
        return true;
      }
    } catch (error) {
      console.error('Failed to enter VR:', error);
      // Fallback to fullscreen for mobile VR
      if (vrCapabilities.includes('Mobile VR')) {
        setIsVRActive(true);
        return true;
      }
    }
    
    return false;
  };

  const exitVR = () => {
    setIsVRActive(false);
    trackVREvent('vr_session_end', { device: vrDevice });
  };

  return {
    isVRSupported,
    isVRActive,
    vrDevice,
    vrCapabilities,
    isLoading,
    enterVR,
    exitVR
  };
};
