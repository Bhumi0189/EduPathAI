export const loadThreeJS = async () => {
  if (typeof window === 'undefined') {
    return null;
  }
  
  try {
    const THREE = await import('three');
    return THREE;
  } catch (error) {
    console.error('Failed to load Three.js:', error);
    return null;
  }
};

// WebXR utilities for actual VR support
export const initializeWebXR = async (renderer: any) => {
  if (!navigator.xr) {
    console.log('WebXR not supported');
    return false;
  }

  try {
    const isSupported = await navigator.xr.isSessionSupported('immersive-vr');
    if (isSupported) {
      renderer.xr.enabled = true;
      return true;
    }
  } catch (error) {
    console.error('WebXR initialization failed:', error);
  }
  return false;
};