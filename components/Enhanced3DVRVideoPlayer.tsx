'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Settings, 
  Headset,
  SkipBack,
  SkipForward,
  Loader2,
  Glasses,
  Eye,
  Info
} from 'lucide-react';

// Enhanced interface with 3D mode
interface VRVideo {
  id: number;
  title: string;
  youtubeId: string;
  instructor: string;
  duration: string;
  subject: string;
  vrSupported: boolean;
  description?: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
}

interface VRVideoPlayerProps {
  video: VRVideo;
  onComplete?: () => void;
  onError?: (error: string) => void;
}

// YouTube Player types
interface YouTubePlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  seekTo: (seconds: number) => void;
  setVolume: (volume: number) => void;
  mute: () => void;
  unMute: () => void;
  destroy: () => void;
}

interface YouTubePlayerEvent {
  target: YouTubePlayer;
  data: number;
}

declare global {
  interface Window {
    YT: {
      Player: new (element: HTMLElement, config: any) => YouTubePlayer;
      PlayerState: {
        PLAYING: number;
        PAUSED: number;
        ENDED: number;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

const Enhanced3DVRVideoPlayer: React.FC<VRVideoPlayerProps> = ({ 
  video, 
  onComplete, 
  onError 
}) => {
  // Refs
  const playerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerInstanceRef = useRef<YouTubePlayer | null>(null);
  const animationRef = useRef<number>();

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'2d' | 'anaglyph' | 'vr'>('2d');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [quality, setQuality] = useState('1080p');
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load YouTube API
  const loadYouTubeAPI = useCallback((): Promise<typeof window.YT> => {
    return new Promise((resolve, reject) => {
      if (window.YT && window.YT.Player) {
        resolve(window.YT);
        return;
      }

      window.onYouTubeIframeAPIReady = () => {
        if (window.YT && window.YT.Player) {
          resolve(window.YT);
        } else {
          reject(new Error('YouTube API failed to load'));
        }
      };

      const existingScript = document.querySelector('script[src*="youtube.com/iframe_api"]');
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        script.onerror = () => reject(new Error('Failed to load YouTube API script'));
        document.head.appendChild(script);
      }
    });
  }, []);

  // Create 3D Anaglyph effect
  const create3DEffect = useCallback(() => {
    if (!canvasRef.current || !playerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const iframe = playerRef.current.querySelector('iframe');
    
    if (!ctx || !iframe) return;

    // Set canvas size
    canvas.width = 640;
    canvas.height = 360;

    const render3D = () => {
      if (!isPlaying || viewMode !== 'anaglyph') return;

      try {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Create 3D depth effect simulation
        const time = Date.now() * 0.001;
        
        // Background gradient for depth
        const gradient = ctx.createRadialGradient(
          canvas.width/2, canvas.height/2, 0,
          canvas.width/2, canvas.height/2, Math.max(canvas.width, canvas.height)
        );
        gradient.addColorStop(0, 'rgba(0,50,100,0.1)');
        gradient.addColorStop(1, 'rgba(0,20,50,0.05)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Simulate 3D molecular structure with red-blue offset
        const drawLayer = (offsetX: number, color: string, opacity: number) => {
          ctx.globalCompositeOperation = opacity < 1 ? 'multiply' : 'screen';
          ctx.fillStyle = color;
          
          // Draw atoms/molecules with depth
          for (let i = 0; i < 8; i++) {
            const x = canvas.width/2 + offsetX + Math.cos(time + i) * (50 + i * 15);
            const y = canvas.height/2 + Math.sin(time * 0.7 + i) * (30 + i * 10);
            const radius = 5 + Math.sin(time * 2 + i) * 3;
            
            ctx.globalAlpha = opacity;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Connections between atoms
            if (i > 0) {
              const prevX = canvas.width/2 + offsetX + Math.cos(time + i - 1) * (50 + (i-1) * 15);
              const prevY = canvas.height/2 + Math.sin(time * 0.7 + i - 1) * (30 + (i-1) * 10);
              
              ctx.strokeStyle = color;
              ctx.lineWidth = 2;
              ctx.globalAlpha = opacity * 0.5;
              ctx.beginPath();
              ctx.moveTo(prevX, prevY);
              ctx.lineTo(x, y);
              ctx.stroke();
            }
          }
        };

        // Left eye (red channel) - slightly left offset
        drawLayer(-3, 'rgba(255, 0, 0, 0.8)', 0.8);
        
        // Right eye (cyan channel) - slightly right offset
        drawLayer(3, 'rgba(0, 255, 255, 0.8)', 0.8);

        // Reset composite operation
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;

        // Add instructional text
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Put on red-blue 3D glasses for depth effect', canvas.width/2, 30);
        ctx.fillText('Red lens: LEFT eye | Blue lens: RIGHT eye', canvas.width/2, canvas.height - 20);

        animationRef.current = requestAnimationFrame(render3D);
      } catch (err) {
        console.error('Error in 3D rendering:', err);
      }
    };

    render3D();
  }, [isPlaying, viewMode]);

  // Initialize YouTube player
  useEffect(() => {
    if (!video?.youtubeId || !playerRef.current) {
      setError('Invalid video data');
      return;
    }

    let mounted = true;

    const initializePlayer = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const YT = await loadYouTubeAPI();

        if (!mounted || !playerRef.current) return;

        const player = new YT.Player(playerRef.current, {
          height: '100%',
          width: '100%',
          videoId: video.youtubeId,
          playerVars: {
            autoplay: 0,
            controls: viewMode === '2d' ? 1 : 0, // Hide controls in 3D mode
            rel: 0,
            showinfo: 0,
            modestbranding: 1,
            enablejsapi: 1,
            origin: typeof window !== 'undefined' ? window.location.origin : '',
            vq: 'hd1080',
            cc_load_policy: 0,
            iv_load_policy: 3
          },
          events: {
            onReady: (event: YouTubePlayerEvent) => {
              if (!mounted) return;
              
              try {
                playerInstanceRef.current = event.target;
                setDuration(event.target.getDuration() || 0);
                setIsLoading(false);
              } catch (err) {
                console.error('Error in onReady:', err);
                setError('Failed to initialize player');
              }
            },
            onStateChange: (event: YouTubePlayerEvent) => {
              if (!mounted) return;
              
              try {
                const playerState = event.data;
                setIsPlaying(playerState === YT.PlayerState.PLAYING);
                
                if (playerState === YT.PlayerState.ENDED && onComplete) {
                  onComplete();
                }
              } catch (err) {
                console.error('Error in onStateChange:', err);
              }
            },
            onError: (event: any) => {
              console.error('YouTube player error:', event);
              const errorMessages: Record<number, string> = {
                2: 'Invalid video ID',
                5: 'HTML5 player error',
                100: 'Video not found',
                101: 'Video not available in embedded player',
                150: 'Video not available in embedded player'
              };
              const errorMessage = errorMessages[event.data] || 'Unknown player error';
              setError(errorMessage);
              onError?.(errorMessage);
            }
          }
        });

      } catch (err) {
        console.error('Failed to initialize YouTube player:', err);
        setError('Failed to load video player');
        onError?.('Failed to load video player');
      }
    };

    initializePlayer();

    return () => {
      mounted = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (playerInstanceRef.current) {
        try {
          playerInstanceRef.current.destroy();
        } catch (err) {
          console.error('Error destroying player:', err);
        }
        playerInstanceRef.current = null;
      }
    };
  }, [video?.youtubeId, loadYouTubeAPI, onComplete, onError, viewMode]);

  // Start 3D effect when mode changes
  useEffect(() => {
    if (viewMode === 'anaglyph') {
      create3DEffect();
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, [viewMode, create3DEffect]);

  // Update current time
  useEffect(() => {
    if (!playerInstanceRef.current || !isPlaying) return;

    const timeInterval = setInterval(() => {
      try {
        if (playerInstanceRef.current?.getCurrentTime) {
          setCurrentTime(playerInstanceRef.current.getCurrentTime());
        }
      } catch (err) {
        console.error('Error getting current time:', err);
      }
    }, 1000);

    return () => clearInterval(timeInterval);
  }, [isPlaying]);

  // Player controls
  const togglePlay = useCallback(() => {
    if (!playerInstanceRef.current) return;
    
    try {
      if (isPlaying) {
        playerInstanceRef.current.pauseVideo();
      } else {
        playerInstanceRef.current.playVideo();
      }
    } catch (err) {
      console.error('Error toggling play:', err);
    }
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    if (!playerInstanceRef.current) return;
    
    try {
      if (isMuted) {
        playerInstanceRef.current.unMute();
        setIsMuted(false);
      } else {
        playerInstanceRef.current.mute();
        setIsMuted(true);
      }
    } catch (err) {
      console.error('Error toggling mute:', err);
    }
  }, [isMuted]);

  const skipForward = useCallback(() => {
    if (!playerInstanceRef.current) return;
    
    try {
      const newTime = Math.min(currentTime + 10, duration);
      playerInstanceRef.current.seekTo(newTime);
    } catch (err) {
      console.error('Error skipping forward:', err);
    }
  }, [currentTime, duration]);

  const skipBackward = useCallback(() => {
    if (!playerInstanceRef.current) return;
    
    try {
      const newTime = Math.max(currentTime - 10, 0);
      playerInstanceRef.current.seekTo(newTime);
    } catch (err) {
      console.error('Error skipping backward:', err);
    }
  }, [currentTime]);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    
    if (playerInstanceRef.current) {
      try {
        playerInstanceRef.current.setVolume(newVolume * 100);
      } catch (err) {
        console.error('Error setting volume:', err);
      }
    }
  }, []);

  const formatTime = useCallback((time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  // Error state
  if (error) {
    return (
      <Card className="bg-slate-900/80 backdrop-blur-lg border-slate-700/50 overflow-hidden">
        <CardContent className="p-8 text-center">
          <div className="text-red-400 mb-4">
            <Headset className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-lg font-semibold">Video Error</p>
            <p className="text-sm text-slate-400 mt-2">{error}</p>
          </div>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline"
            className="border-slate-600 text-slate-300 hover:border-blue-500 hover:text-blue-400"
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900/80 backdrop-blur-lg border-slate-700/50 overflow-hidden shadow-2xl">
      {/* Mode Selection */}
      <div className="p-4 bg-gradient-to-r from-slate-800/50 to-slate-900/50 border-b border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold text-lg">Choose Viewing Mode</h3>
          <div className="flex gap-2">
            <Button
              onClick={() => setViewMode('2d')}
              size="sm"
              className={viewMode === '2d' ? 'bg-blue-600' : 'bg-slate-700 hover:bg-slate-600'}
            >
              <Eye className="w-4 h-4 mr-1" />
              2D
            </Button>
            <Button
              onClick={() => setViewMode('anaglyph')}
              size="sm"
              className={viewMode === 'anaglyph' ? 'bg-red-600' : 'bg-slate-700 hover:bg-slate-600'}
            >
              <Glasses className="w-4 h-4 mr-1" />
              3D Glasses
            </Button>
            <Button
              onClick={() => setViewMode('vr')}
              size="sm"
              className={viewMode === 'vr' ? 'bg-purple-600' : 'bg-slate-700 hover:bg-slate-600'}
            >
              <Headset className="w-4 h-4 mr-1" />
              VR
            </Button>
          </div>
        </div>

        {/* Mode Instructions */}
        {viewMode === 'anaglyph' && (
          <Alert className="bg-red-900/30 border-red-500/30">
            <Glasses className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-200">
              <strong>Red-Blue 3D Mode:</strong> Put on red-blue 3D glasses. Red lens on LEFT eye, blue lens on RIGHT eye. 
              <a href="https://amzn.in/d/0123abc" target="_blank" rel="noopener" className="underline ml-1">
                Buy glasses (₹50)
              </a>
            </AlertDescription>
          </Alert>
        )}
        {viewMode === 'vr' && (
          <Alert className="bg-purple-900/30 border-purple-500/30">
            <Headset className="h-4 w-4 text-purple-400" />
            <AlertDescription className="text-purple-200">
              <strong>VR Mode:</strong> Use VR headset or mobile VR box for full immersive experience.
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Video Player */}
      <div className="aspect-video relative bg-black">
        {isLoading && (
          <div className="absolute inset-0 bg-slate-900/90 flex items-center justify-center z-20">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-2" />
              <p className="text-white text-sm">Loading Enhanced Player...</p>
            </div>
          </div>
        )}
        
        {/* YouTube Player */}
        <div 
          ref={playerRef} 
          className={viewMode === '2d' ? 'w-full h-full' : 'w-full h-full opacity-30'}
        />
        
        {/* 3D Canvas Overlay */}
        {viewMode === 'anaglyph' && (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
          />
        )}
        
        {/* VR Mode Indicator */}
        {viewMode !== '2d' && (
          <div className="absolute top-4 left-4 z-10">
            <Badge className={`${
              viewMode === 'anaglyph' ? 'bg-red-600' : 'bg-purple-600'
            } text-white animate-pulse shadow-lg`}>
              {viewMode === 'anaglyph' ? (
                <>
                  <Glasses className="w-4 h-4 mr-1" />
                  3D Mode Active
                </>
              ) : (
                <>
                  <Headset className="w-4 h-4 mr-1" />
                  VR Mode Active
                </>
              )}
            </Badge>
          </div>
        )}
      </div>
      
      {/* Enhanced Controls */}
      <CardContent className="p-6 bg-gradient-to-r from-slate-800/50 to-slate-900/50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1">
            <h3 className="text-white font-bold text-xl mb-1">{video.title}</h3>
            <p className="text-slate-400 text-sm">{video.instructor} • {video.subject}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <select 
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
              className="bg-slate-800 text-white rounded-lg px-3 py-2 text-sm border border-slate-600"
            >
              <option value="720p">720p</option>
              <option value="1080p">1080p HD</option>
              <option value="1440p">1440p QHD</option>
              <option value="2160p">4K UHD</option>
            </select>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-6">
          <Progress 
            value={duration > 0 ? (currentTime / duration) * 100 : 0} 
            className="h-3 cursor-pointer rounded-full"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-2">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        
        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={togglePlay}
              className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-105"
              disabled={isLoading}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </Button>
            
            <Button
              onClick={skipBackward}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:border-blue-500 hover:text-blue-400"
            >
              <SkipBack className="w-4 h-4" />
            </Button>
            
            <Button
              onClick={skipForward}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:border-blue-500 hover:text-blue-400"
            >
              <SkipForward className="w-4 h-4" />
            </Button>
            
            <div className="flex items-center gap-2">
              <Button
                onClick={toggleMute}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:border-blue-500 hover:text-blue-400"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
              
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="w-24 accent-blue-600"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="border-blue-500/30 text-blue-400 text-xs">
              {quality}
            </Badge>
            <Badge variant="outline" className={`text-xs ${
              viewMode === 'anaglyph' ? 'border-red-500/30 text-red-400' :
              viewMode === 'vr' ? 'border-purple-500/30 text-purple-400' :
              'border-blue-500/30 text-blue-400'
            }`}>
              {viewMode.toUpperCase()} Mode
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Enhanced3DVRVideoPlayer;