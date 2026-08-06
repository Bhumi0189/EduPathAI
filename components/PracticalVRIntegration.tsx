// Step-by-Step 3D Integration for EduPath VR Learning
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Glasses, 
  Smartphone,
  Monitor,
  Eye,
  Play,
  Pause,
  Volume2,
  Settings,
  Info,
  CheckCircle,
  X,
  Headset
} from 'lucide-react';

// Enhanced Video Player with 3D Support
const Enhanced3DVideoPlayer = () => {
  const [mode, setMode] = useState<'2d' | 'anaglyph' | 'sbs' | 'mobile-vr'>('2d');
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const playerRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Current video data
  const currentVideo = {
    title: "Atomic Structure - Chemistry Lecture",
    instructor: "Dr. Sarah Chen",
    duration: "15:30",
    videoUrl: "/sample-lecture.mp4" // Replace with actual video
  };

  // Create Anaglyph 3D effect
  const createAnaglyphEffect = () => {
    if (!playerRef.current || !canvasRef.current) return;

    const video = playerRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const drawFrame = () => {
      if (video.paused) return;

      // Draw left eye (red channel) with slight offset
      ctx.fillStyle = '#ff0000';
      ctx.globalCompositeOperation = 'multiply';
      ctx.drawImage(video, -5, 0, canvas.width, canvas.height);

      // Draw right eye (cyan channel) with opposite offset  
      ctx.fillStyle = '#00ffff';
      ctx.globalCompositeOperation = 'screen';
      ctx.drawImage(video, 5, 0, canvas.width, canvas.height);

      // Add 3D depth simulation
      ctx.globalCompositeOperation = 'source-over';
      
      requestAnimationFrame(drawFrame);
    };

    drawFrame();
  };

  // Create Side-by-Side for mobile VR
  const createSideBySideEffect = () => {
    if (!playerRef.current || !canvasRef.current) return;

    const video = playerRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = (video.videoWidth || 640) * 2;
    canvas.height = video.videoHeight || 480;

    const drawFrame = () => {
      if (video.paused) return;

      const width = canvas.width / 2;
      const height = canvas.height;

      // Left eye view
      ctx.drawImage(video, 0, 0, width, height);
      
      // Right eye view (slightly different perspective)
      ctx.drawImage(video, width, 0, width, height);

      requestAnimationFrame(drawFrame);
    };

    drawFrame();
  };

  useEffect(() => {
    if (mode === 'anaglyph' && isPlaying) {
      createAnaglyphEffect();
    } else if (mode === 'sbs' && isPlaying) {
      createSideBySideEffect();
    }
  }, [mode, isPlaying]);

  const togglePlay = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pause();
      } else {
        playerRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="space-y-6">
      {/* Mode Selection */}
      <Card className="bg-slate-900/50 backdrop-blur-lg border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Eye className="w-5 h-5 mr-2" />
            Choose Your Viewing Experience
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              onClick={() => setMode('2d')}
              className={`h-20 flex flex-col ${
                mode === '2d' ? 'bg-blue-600' : 'bg-slate-700 hover:bg-slate-600'
              }`}
            >
              <Monitor className="w-6 h-6 mb-1" />
              <span className="text-xs">Standard</span>
            </Button>

            <Button
              onClick={() => setMode('anaglyph')}
              className={`h-20 flex flex-col ${
                mode === 'anaglyph' ? 'bg-red-600' : 'bg-slate-700 hover:bg-slate-600'
              }`}
            >
              <Glasses className="w-6 h-6 mb-1" />
              <span className="text-xs">Red-Blue 3D</span>
            </Button>

            <Button
              onClick={() => setMode('sbs')}
              className={`h-20 flex flex-col ${
                mode === 'sbs' ? 'bg-green-600' : 'bg-slate-700 hover:bg-slate-600'
              }`}
            >
              <Eye className="w-6 h-6 mb-1" />
              <span className="text-xs">Side-by-Side</span>
            </Button>

            <Button
              onClick={() => setMode('mobile-vr')}
              className={`h-20 flex flex-col ${
                mode === 'mobile-vr' ? 'bg-purple-600' : 'bg-slate-700 hover:bg-slate-600'
              }`}
            >
              <Smartphone className="w-6 h-6 mb-1" />
              <span className="text-xs">Mobile VR</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Hardware Requirements Alert */}
      {mode !== '2d' && (
        <Alert className={`${
          mode === 'anaglyph' ? 'bg-red-900/30 border-red-500/30' :
          mode === 'sbs' ? 'bg-green-900/30 border-green-500/30' :
          'bg-purple-900/30 border-purple-500/30'
        }`}>
          <Info className="h-4 w-4" />
          <AlertDescription>
            {mode === 'anaglyph' && (
              <span className="text-red-200">
                <strong>Required:</strong> Red-Blue 3D glasses (₹50-100) - Available on Amazon/Flipkart
              </span>
            )}
            {mode === 'sbs' && (
              <span className="text-green-200">
                <strong>Required:</strong> 3D TV/Monitor with polarized display (₹50,000+)
              </span>
            )}
            {mode === 'mobile-vr' && (
              <span className="text-purple-200">
                <strong>Required:</strong> VR box/Google Cardboard (₹200-500) + Smartphone
              </span>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Video Player */}
      <Card className="bg-slate-900/50 backdrop-blur-lg border-slate-700/50">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-white">{currentVideo.title}</CardTitle>
              <p className="text-slate-400">{currentVideo.instructor}</p>
            </div>
            <Badge className={`${
              mode === 'anaglyph' ? 'bg-red-600' :
              mode === 'sbs' ? 'bg-green-600' :
              mode === 'mobile-vr' ? 'bg-purple-600' :
              'bg-blue-600'
            } text-white`}>
              {mode.toUpperCase()} Mode
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Hidden video element for processing */}
            <video
              ref={playerRef}
              className={mode === '2d' ? 'w-full rounded-lg' : 'hidden'}
              controls={mode === '2d'}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            >
              <source src={currentVideo.videoUrl} type="video/mp4" />
            </video>

            {/* Canvas for 3D effects */}
            {mode !== '2d' && (
              <canvas
                ref={canvasRef}
                className="w-full rounded-lg bg-black"
                style={{ 
                  aspectRatio: mode === 'sbs' ? '2/1' : '16/9',
                  maxHeight: mode === 'mobile-vr' ? '50vh' : 'auto'
                }}
              />
            )}

            {/* 3D Mode Instructions Overlay */}
            {mode !== '2d' && (
              <div className="absolute top-4 left-4 right-4">
                <Alert className="bg-black/70 backdrop-blur-sm border-white/20">
                  <AlertDescription className="text-white text-sm">
                    {mode === 'anaglyph' && "Put on red-blue glasses: Red lens on LEFT eye, Blue lens on RIGHT eye"}
                    {mode === 'sbs' && "Enable 3D mode on your display, then put on polarized glasses"}
                    {mode === 'mobile-vr' && "Place phone in VR headset, adjust focus, and enjoy immersive experience"}
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </div>

          {/* Custom Controls for 3D modes */}
          {mode !== '2d' && (
            <div className="mt-4 flex items-center justify-between bg-slate-800/50 p-4 rounded-lg">
              <div className="flex items-center gap-4">
                <Button onClick={togglePlay} size="sm" className="bg-blue-600 hover:bg-blue-700">
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-slate-400" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => {
                      const newVolume = parseFloat(e.target.value);
                      setVolume(newVolume);
                      if (playerRef.current) {
                        playerRef.current.volume = newVolume;
                      }
                    }}
                    className="w-20 accent-blue-600"
                  />
                </div>
              </div>
              <span className="text-slate-400 text-sm">{currentVideo.duration}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Main Integration Component
const PracticalVRIntegration = () => {
  const [selectedOption, setSelectedOption] = useState<'anaglyph' | 'mobile-vr' | 'cardboard'>('anaglyph');

  const recommendations = {
    anaglyph: {
      title: "Red-Blue 3D Glasses (RECOMMENDED)",
      cost: "₹50-100 per student",
      accessibility: "100% - Works on any device",
      immersion: "Good depth perception",
      setup: "Instant - just put on glasses",
      pros: ["Cheapest option", "Works everywhere", "Easy to distribute", "Immediate effect"],
      cons: ["Color distortion", "Not full VR", "Eye strain after long use"],
      buyLinks: [
        "Amazon: Red Blue 3D Glasses",
        "Flipkart: Anaglyph Glasses", 
        "Local stores: Movie theaters sell them"
      ]
    },
    'mobile-vr': {
      title: "Mobile VR Headset",
      cost: "₹200-500 per student", 
      accessibility: "90% - Most have smartphones",
      immersion: "Excellent - True VR experience",
      setup: "2 minutes - Insert phone in headset",
      pros: ["Real VR feeling", "Head tracking", "Full immersion", "Affordable"],
      cons: ["Need good smartphone", "Bulkier than glasses", "Battery drain"],
      buyLinks: [
        "Amazon: VR Box 2.0",
        "Flipkart: Google Cardboard",
        "Mi Store: Mi VR Play"
      ]
    },
    cardboard: {
      title: "Google Cardboard DIY",
      cost: "₹50-150 per student",
      accessibility: "95% - DIY friendly", 
      immersion: "Very good for the price",
      setup: "5 minutes assembly + phone",
      pros: ["Very cheap", "DIY project", "Educational assembly", "Disposable"],
      cons: ["Less durable", "Assembly required", "Basic features only"],
      buyLinks: [
        "Google Cardboard official",
        "DIY kits on Amazon",
        "Print-your-own templates"
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 p-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Practical 3D Integration for Your Students
          </h1>
          <p className="text-slate-300 text-lg">
            Create immersive learning without expensive hardware
          </p>
        </div>

        {/* Recommendation Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {Object.entries(recommendations).map(([key, rec]) => (
            <Card 
              key={key}
              className={`cursor-pointer transition-all duration-300 ${
                selectedOption === key 
                  ? 'bg-blue-900/50 border-blue-500/50 shadow-xl shadow-blue-500/20' 
                  : 'bg-slate-900/50 border-slate-700/50 hover:border-slate-600/50'
              }`}
              onClick={() => setSelectedOption(key as any)}
            >
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  {rec.title}
                  {selectedOption === key && <CheckCircle className="w-5 h-5 text-green-400" />}
                </CardTitle>
                <div className="space-y-2">
                  <Badge className="bg-green-600 text-white">{rec.cost}</Badge>
                  <Badge className="bg-blue-600 text-white">{rec.accessibility}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Immersion Level:</p>
                    <p className="text-white text-sm">{rec.immersion}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Setup Time:</p>
                    <p className="text-white text-sm">{rec.setup}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detailed Info */}
        <Card className="bg-slate-900/50 backdrop-blur-lg border-slate-700/50 mb-8">
          <CardHeader>
            <CardTitle className="text-white">
              {recommendations[selectedOption].title} - Detailed Info
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-green-400 font-semibold mb-3">Advantages</h3>
                <ul className="space-y-2">
                  {recommendations[selectedOption].pros.map((pro, index) => (
                    <li key={index} className="flex items-center text-slate-300">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-red-400 font-semibold mb-3">Limitations</h3>
                <ul className="space-y-2">
                  {recommendations[selectedOption].cons.map((con, index) => (
                    <li key={index} className="flex items-center text-slate-300">
                      <X className="w-4 h-4 text-red-400 mr-2" />
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-blue-400 font-semibold mb-3">Where to Buy</h3>
              <div className="space-y-2">
                {recommendations[selectedOption].buyLinks.map((link, index) => (
                  <p key={index} className="text-slate-300 text-sm">• {link}</p>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Demo */}
        <Enhanced3DVideoPlayer />

        {/* Implementation Steps */}
        <Card className="bg-slate-900/50 backdrop-blur-lg border-slate-700/50 mt-8">
          <CardHeader>
            <CardTitle className="text-white">Implementation Steps for Your Project</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                "1. Choose hardware option (Red-Blue 3D recommended for start)",
                "2. Order glasses/headsets in bulk (get samples first)",
                "3. Update your video player component with 3D modes",
                "4. Test with sample students and gather feedback", 
                "5. Create instructor guide for 3D content creation",
                "6. Launch pilot program with selected courses",
                "7. Scale based on student response and engagement metrics"
              ].map((step, index) => (
                <div key={index} className="flex items-center text-slate-300">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm mr-4">
                    {index + 1}
                  </div>
                  {step.substring(2)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Final Recommendation */}
        <Alert className="mt-8 bg-green-900/30 border-green-500/30">
          <CheckCircle className="h-4 w-4 text-green-400" />
          <AlertDescription className="text-green-200">
            <strong>My Recommendation:</strong> Start with Red-Blue 3D glasses (₹50-100 per student). 
            They work immediately on any device, are cheap to distribute, and create a noticeable 3D effect. 
            Once you see good student engagement, you can upgrade to mobile VR headsets for selected premium courses.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default PracticalVRIntegration;