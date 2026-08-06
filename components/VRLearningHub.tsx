"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@/hooks/useUser';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Search,
  Users,
  Clock,
  Star,
  BookOpen,
  Zap,
  Target,
  Brain,
  Globe,
  Atom,
  Dna,
  Award,
  Sparkles,
  Rocket
} from 'lucide-react';
 
// VR Educational Videos Database
const educationalVRVideos = {
  chemistry: [
    {
      id: 1,
      title: "Atomic Structure & Chemical Bonds",
      youtubeId: "yqLlgIaz1L0",
      instructor: "Dr. Sarah Chen",
      duration: "12:45",
      students: 2847,
      rating: 4.9,
      description: "Explore the microscopic world of atoms and molecules in immersive 3D",
      level: "Intermediate",
      subject: "Chemistry",
      vrSupported: true,
      concepts: ["Atomic Orbitals", "Chemical Bonding", "Molecular Geometry"],
      vrFeatures: ["3D Atomic Models", "Interactive Bonding", "Molecular Builder"],
      thumbnail: "https://img.youtube.com/vi/yqLlgIaz1L0/maxresdefault.jpg"
    },
    // User-provided lecture: Molecular Bonding Visualization (YouTube)
    {
      id: 18,
      title: "Molecular Bonding Visualization (Lecture)",
      youtubeId: "6Bwey5R85zc",
      instructor: "Lecture Video",
      duration: "14:30",
      students: 1540,
      rating: 4.6,
      description: "In-depth visualization of molecular bonding (user-provided lecture).",
      level: "Intermediate",
      subject: "Chemistry",
      vrSupported: false,
      concepts: ["Bonding", "Orbital Overlap"],
      vrFeatures: [],
      thumbnail: "https://img.youtube.com/vi/6Bwey5R85zc/maxresdefault.jpg"
    },
    // User-provided lecture: Introduction to Chemical Reactions (YouTube)
    {
      id: 19,
      title: "Introduction to Chemical Reactions",
      youtubeId: "iUdU3I0zZGk",
      instructor: "Lecture Video",
      duration: "12:00",
      students: 980,
      rating: 4.5,
      description: "Introductory lecture on chemical reactions (user-provided).",
      level: "Beginner",
      subject: "Chemistry",
      vrSupported: false,
      concepts: ["Reaction Types", "Energy Changes"],
      vrFeatures: [],
      thumbnail: "https://img.youtube.com/vi/iUdU3I0zZGk/maxresdefault.jpg"
    },
    // User-provided 2D video (YouTube)
    {
      id: 17,
      title: "2D VR Demo Video",
      youtubeId: "CIKEp6q-yng",
      instructor: "Provided Video",
      duration: "05:00",
      students: 120,
      rating: 4.2,
      description: "User-requested 2D video added to the chemistry list.",
      level: "Beginner",
      subject: "Chemistry",
      vrSupported: false,
      concepts: ["Demo"],
      vrFeatures: [],
      thumbnail: "https://img.youtube.com/vi/CIKEp6q-yng/maxresdefault.jpg"
    }
  ],
  biology: [
    // User-provided 3D Human Heart lecture (added per request)
    {
      id: 20,
      title: "Human Heart 360° Journey (3D)",
      youtubeId: "a-uF50BgMGM",
      instructor: "Dr. Lisa Wang",
      duration: "18:30",
      students: 4200,
      rating: 4.9,
      description: "Take a virtual 360° journey inside the human cardiovascular system (3D).",
      level: "Beginner",
      subject: "Biology",
      vrSupported: true,
      concepts: ["Heart Anatomy", "Blood Circulation", "Cardiac Cycle"],
      vrFeatures: ["3D Heart Model", "360 Video", "Interactive Exploration"],
      thumbnail: "https://img.youtube.com/vi/a-uF50BgMGM/maxresdefault.jpg"
    },
    // User-provided Cell Division supplemental video
    {
      id: 21,
      title: "Cell Division — Supplemental Lecture",
      youtubeId: "XKZhcYetvsc",
      instructor: "Provided Video",
      duration: "10:00",
      students: 150,
      rating: 4.4,
      description: "Supplemental lecture on mitosis and meiosis (user-provided).",
      level: "Intermediate",
      subject: "Biology",
      vrSupported: false,
      concepts: ["Mitosis", "Meiosis"],
      vrFeatures: [],
      thumbnail: "https://img.youtube.com/vi/XKZhcYetvsc/maxresdefault.jpg"
    },
     // User-provided supplemental Ecosystems video
    {
      id: 22,
      title: "Ecosystems Dynamics — Supplemental Video",
      youtubeId: "v6ubvEJ3KGM",
      instructor: "Provided Video",
      duration: "08:45",
      students: 200,
      rating: 4.3,
      description: "Supplemental video exploring ecosystem interactions and food chains (user-provided).",
      level: "Beginner",
      subject: "Biology",
      vrSupported: false,
      concepts: ["Ecosystems", "Food Webs"],
      vrFeatures: [],
      thumbnail: "https://img.youtube.com/vi/v6ubvEJ3KGM/maxresdefault.jpg"
    }
  ],
  physics: [
    {
      id: 4,
      title: "Electromagnetic Fields Visualization",
      youtubeId: "FWCN_uI5ygY",
      instructor: "Dr. Alex Kumar",
      duration: "16:45",
      students: 1687,
      rating: 4.6,
      description: "Visualize invisible electromagnetic phenomena in 3D space",
      level: "Advanced",
      subject: "Physics",
      vrSupported: true,
      concepts: ["Electric Fields", "Magnetic Fields", "Wave Propagation"],
      vrFeatures: ["Field Line Visualization", "Wave Animation", "Interactive Experiments"],
      thumbnail: "https://img.youtube.com/vi/FWCN_uI5ygY/maxresdefault.jpg"
    },
    // Dummy physics videos
    {
      id: 15,
      title: "Newtonian Mechanics Lab",
      youtubeId: "hY7m5jjJ9mM",
      instructor: "Dr. Motion",
      duration: "13:10",
      students: 890,
      rating: 4.4,
      description: "Hands-on experiments for forces, friction, and motion in 3D VR.",
      level: "Beginner",
      subject: "Physics",
      vrSupported: true,
      concepts: ["Forces", "Kinematics"],
      vrFeatures: ["Interactive Labs", "Slow-motion Playback"],
      thumbnail: "https://img.youtube.com/vi/hY7m5jjJ9mM/maxresdefault.jpg"
    }
  ]
};

const VRLearningHub = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [activeTab, setActiveTab] = useState('courses');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [showCourseModal, setShowCourseModal] = useState(false);
  // Model embed modal state
  const [showModelModal, setShowModelModal] = useState(false);
  const [modelEmbedUrl, setModelEmbedUrl] = useState<string | null>(null);

  const { user } = useUser();
  const [progressById, setProgressById] = useState<Record<string, number>>({});

  const subjects = ['all', 'chemistry', 'biology', 'physics'];
  
  // Get all videos and filter them
  const allVideos = Object.values(educationalVRVideos).flat();
  const filteredVideos = allVideos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = filterSubject === 'all' || video.subject.toLowerCase() === filterSubject;
    return matchesSearch && matchesSubject;  
  });

  const handleCourseSelect = (course: any) => {
    setSelectedCourse(course);
    setShowCourseModal(true);

    // record that the user started viewing this video
    if (user && user.id) {
      recordVideoStart(user.id, course);
    }
  };

  // fetch per-video progress for signed-in user
  useEffect(() => {
    let mounted = true
    const loadProgress = async () => {
      try {
        if (!user || !user.id) return
        const res = await fetch(`/api/progress?userId=${encodeURIComponent(user.id)}`)
        if (!res.ok) return
        const j = await res.json()
        // API returns { perVideo, raw }
        const perVideo = j?.perVideo || j?.pervideo || []
        const map: Record<string, number> = {}
        for (const p of perVideo) {
          if (p?.youtubeId) map[p.youtubeId] = typeof p.percent === 'number' ? p.percent : 0
        }
        if (mounted) setProgressById(map)
      } catch (err) {
        // ignore
      }
    }
    loadProgress()
    return () => { mounted = false }
  }, [user?.id])

  // Record video start to backend progress API
  const recordVideoStart = async (userId: string, course: any) => {
    try {
      const payload = {
        userId,
        activityType: 'videoStart',
        data: {
          title: course.title,
          youtubeId: course.youtubeId,
          subject: course.subject,
          startedAt: new Date().toISOString(),
        },
      };

      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      // don't block the UI on logging failures
      console.error('Failed to record video start', err);
    }
  };

  // Simple VR Video Player Component
  const VRVideoPlayer = ({ video }: { video: any }) => {
    const [viewMode, setViewMode] = useState('2d');
    const playerRef = React.useRef<any>(null);
    const playerContainerRef = React.useRef<HTMLDivElement | null>(null);
    const [hasStartedPlaying, setHasStartedPlaying] = useState(false);
    const heartbeatRef = React.useRef<number | null>(null);
  const progressIntervalRef = React.useRef<number | null>(null);
  const partialSentRef = React.useRef<boolean>(false);

    // helper: send studyTime seconds to backend
    const sendStudyTime = async (seconds: number) => {
      try {
        await fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user?.id, activityType: 'studyTime', data: { seconds } }),
        })
      } catch (err) {
        console.error('Failed to send studyTime', err)
      }
    }

    // send partial progress (percent: 0-100)
    const sendVideoPartial = async (percent: number) => {
      try {
        await fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user?.id, activityType: 'videoPartial', data: { youtubeId: video.youtubeId, title: video.title, subject: video.subject, percent, recordedAt: new Date().toISOString() } }),
        })
      } catch (err) {
        console.error('Failed to send videoPartial', err)
      }
    }

    // on complete, notify backend
    const sendVideoComplete = async () => {
      try {
        await fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user?.id, activityType: 'videoComplete', data: { youtubeId: video.youtubeId, title: video.title, subject: video.subject, completedAt: new Date().toISOString() } }),
        })
      } catch (err) {
        console.error('Failed to send videoComplete', err)
      }
    }

    useEffect(() => {
      // clean up previous player when video changes
      return () => {
        if (playerRef.current && typeof playerRef.current.destroy === 'function') {
          playerRef.current.destroy()
          playerRef.current = null
        }
        if (heartbeatRef.current) {
          window.clearInterval(heartbeatRef.current)
          heartbeatRef.current = null
        }
        setHasStartedPlaying(false)
      }
    }, [video?.youtubeId]);

    useEffect(() => {
      if (!video?.youtubeId || viewMode !== '2d') return;

      const loadYouTubeAPI = () => {
        return new Promise<void>((resolve) => {
          if ((window as any).YT && (window as any).YT.Player) return resolve();
          const tag = document.createElement('script')
          tag.src = 'https://www.youtube.com/iframe_api'
          const firstScriptTag = document.getElementsByTagName('script')[0]
          firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
          ;(window as any).onYouTubeIframeAPIReady = () => resolve()
        })
      }

      let mounted = true
      loadYouTubeAPI().then(() => {
        if (!mounted) return
        // create player
        const player = new (window as any).YT.Player(`yt-player-${video.youtubeId}`, {
          videoId: video.youtubeId,
          playerVars: { rel: 0, modestbranding: 1 },
          events: {
            onStateChange: (e: any) => {
              const YT = (window as any).YT
              if (!YT) return
              if (e.data === YT.PlayerState.PLAYING) {
                // first time play
                if (!hasStartedPlaying) {
                  setHasStartedPlaying(true)
                  // record video start
                  if (user && user.id) {
                    recordVideoStart(user.id, video)
                  }
                }
                // start heartbeat every 15s
                if (!heartbeatRef.current) {
                  heartbeatRef.current = window.setInterval(() => sendStudyTime(15), 15000)
                }
                // start progress checker every 5s to detect percent watched
                if (!progressIntervalRef.current) {
                  progressIntervalRef.current = window.setInterval(() => {
                    try {
                      const p = playerRef.current || player
                      if (!p || typeof p.getCurrentTime !== 'function' || typeof p.getDuration !== 'function') return
                      const current = p.getCurrentTime()
                      const dur = p.getDuration()
                      if (!dur || dur <= 0) return
                      const percent = Math.floor((current / dur) * 100)
                      // if >= 50% and we haven't sent partial yet, send it
                      if (percent >= 50 && !partialSentRef.current) {
                        partialSentRef.current = true
                        sendVideoPartial(percent)
                      }
                    } catch (err) {
                      console.error('progress check failed', err)
                    }
                  }, 5000) as unknown as number
                }
              } else if (e.data === YT.PlayerState.PAUSED) {
                if (heartbeatRef.current) {
                  window.clearInterval(heartbeatRef.current)
                  heartbeatRef.current = null
                }
                if (progressIntervalRef.current) {
                  window.clearInterval(progressIntervalRef.current)
                  progressIntervalRef.current = null
                }
              } else if (e.data === YT.PlayerState.ENDED) {
                if (heartbeatRef.current) {
                  window.clearInterval(heartbeatRef.current)
                  heartbeatRef.current = null
                }
                if (progressIntervalRef.current) {
                  window.clearInterval(progressIntervalRef.current)
                  progressIntervalRef.current = null
                }
                // record complete
                sendVideoComplete()
              }
            }
          }
        })
        playerRef.current = player
      })

      return () => { mounted = false }
    }, [video?.youtubeId, viewMode, user])

    // cleanup intervals & player on unmount or when video changes
    useEffect(() => {
      return () => {
        if (heartbeatRef.current) {
          window.clearInterval(heartbeatRef.current)
          heartbeatRef.current = null
        }
        if (progressIntervalRef.current) {
          window.clearInterval(progressIntervalRef.current)
          progressIntervalRef.current = null
        }
        partialSentRef.current = false
        if (playerRef.current && typeof playerRef.current.destroy === 'function') {
          try { playerRef.current.destroy() } catch (e) { /* ignore */ }
          playerRef.current = null
        }
      }
    }, [video?.youtubeId])

    return (
      <Card className="bg-slate-900/80 backdrop-blur-lg border-slate-700/50 overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-slate-800/50 to-slate-900/50 border-b border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold text-lg">3D Video Player</h3>
            <div className="flex gap-2">
              <Button
                onClick={() => setViewMode('2d')}
                size="sm"
                className={viewMode === '2d' ? 'bg-blue-600' : 'bg-slate-700 hover:bg-slate-600'}
              >
                2D
              </Button>
              <Button
                onClick={() => setViewMode('3d')}
                size="sm"
                className={viewMode === '3d' ? 'bg-red-600' : 'bg-slate-700 hover:bg-slate-600'}
              >
                3D Glasses
              </Button>
            </div>
          </div>
        </div>
        <div className="aspect-video bg-black flex items-center justify-center">
          {viewMode === '2d' && video?.youtubeId ? (
            <div className="w-full h-full relative">
              <div id={`yt-player-${video.youtubeId}`} ref={(el) => { playerContainerRef.current = el }} className="w-full h-full" />
            </div>
          ) : (
            <div className="text-center text-white">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-blue-600 rounded-full">
                <Play className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-semibold mb-2">{video?.title || 'VR Learning Video'}</h4>
              <Badge className={viewMode === '3d' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'}>
                {viewMode === '3d' ? 'Put on red-blue 3D glasses' : 'Standard viewing mode'}
              </Badge>
            </div>
          )}
        </div>
      </Card>
    );
  };

  // Simple Course Modal Component
  const CourseModal = (props: any) => {
    const { course, onClose } = props;
    if (!course) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">{course.title}</h2>
              <p className="text-slate-400 text-lg">{course.instructor} • {course.subject}</p>
            </div>
            <Button
              onClick={onClose}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:border-red-500 hover:text-red-400"
            >
              ✕
            </Button>
          </div>
          
          <VRVideoPlayer video={course} />
          
          <div className="mt-6">
            <h3 className="text-white font-semibold text-lg mb-3">Course Description</h3>
            <p className="text-slate-300 mb-4">{course.description}</p>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-400">Duration:</span>
                <span className="text-white ml-2">{course.duration}</span>
              </div>
              <div>
                <span className="text-slate-400">Students:</span>
                <span className="text-white ml-2">{course.students?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // Model Modal for embedding Sketchfab (or other web-based 3D viewers)
  const ModelModal = (props: any) => {
    const { embedUrl, onClose } = props;
    if (!embedUrl) return null;
    const [loaded, setLoaded] = useState(false);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
      let timer: NodeJS.Timeout | null = null;
      // If iframe hasn't loaded after 5s, show fallback — many browsers block embeds immediately
      if (!loaded) {
        timer = setTimeout(() => {
          setFailed(true);
        }, 5000);
      }
      return () => {
        if (timer) clearTimeout(timer);
      };
    }, [loaded]);

    const handleIFrameLoad = () => {
      // If it loads successfully, mark as loaded and clear failed
      setLoaded(true);
      setFailed(false);
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-transparent rounded-2xl p-4 max-w-6xl w-full max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {!failed ? (
            <>
              <div className="relative pt-[56.25%]">{/* 16:9 container */}
                <iframe
                  src={embedUrl}
                  title="3D Model Viewer"
                  className="absolute inset-0 w-full h-full border-0 rounded-lg bg-white"
                  // Use standardized feature policy tokens; 'vr' and 'xr' are unrecognized in some browsers
                  allow="autoplay; fullscreen; xr-spatial-tracking; accelerometer; gyroscope; camera; microphone;"
                  onLoad={(e) => {
                    console.log('Model iframe loaded', embedUrl, e);
                    handleIFrameLoad();
                  }}
                />
              </div>

              {!loaded && (
                <div className="mt-4 text-slate-300 text-sm">Loading model…</div>
              )}
            </>
          ) : (
            <div className="p-6 bg-slate-800 rounded-lg">
              <p className="text-slate-200 mb-4">The model could not be embedded in this page (the host or model may disallow embedding).</p>
              <div className="flex items-center gap-2">
                <Button variant="outline" asChild className="text-white">
                  <a
                    href={typeof embedUrl === 'string' ? embedUrl.replace('/embed?','/viewer?') : '#'}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open on Sketchfab
                  </a>
                </Button>
                <Button onClick={onClose} variant="outline" className="text-white">Close</Button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    );
  };

  return (
    // make the main hub slightly translucent so decorative backgrounds show through
    <div className="relative z-10 min-h-screen bg-gradient-to-br from-slate-950/30 via-blue-950/20 to-indigo-950/20">
      <div className="container mx-auto px-4 py-12 relative">
        {/* Back to Home button */}
        <div className="absolute top-4 right-4 z-50">
          <Link href="/">
            <Button variant="outline" className="text-white">
              ← Back to Home
            </Button>
          </Link>
        </div>
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div 
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-xl rounded-full mb-8 border border-blue-500/20"
          >
            <Sparkles className="w-5 h-5 text-cyan-400 mr-3" />
            <span className="text-cyan-400 text-sm font-medium">The Future of Learning is Here</span>
            <Rocket className="w-5 h-5 text-cyan-400 ml-3" />
          </motion.div>
          
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-8 leading-tight">
            Learn Smarter with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400">
              VR-Powered Education
            </span>
          </h1>
          
          <p className="text-xl text-slate-300 max-w-4xl mx-auto mb-12">
            Transform your learning journey with immersive VR experiences, interactive 3D models, 
            and adaptive learning paths tailored just for you.
          </p>

          {/* Search Section */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
              <div className="flex gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
                  <Input
                    placeholder="Ask EduPath AI anything..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-14 bg-slate-800/50 text-white placeholder-slate-400 rounded-xl"
                  />
                </div>
                <select 
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value)}
                  className="bg-slate-800/50 text-white rounded-xl px-6 py-3 capitalize min-w-40"
                >
                  {subjects.map(subject => (
                    <option key={subject} value={subject} className="bg-slate-800">
                      {subject === 'all' ? 'All Subjects' : subject}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-10 py-4 text-lg rounded-xl font-semibold">
              <Play className="w-6 h-6 mr-3" />
              Start Learning
            </Button>
            
            <Button className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-10 py-4 text-lg rounded-xl font-semibold">
              <span className="mr-3">👓</span>
              3D Learning Modes
            </Button>
            
            <Button variant="outline" className="border-2 border-slate-600/50 text-slate-300 px-10 py-4 text-lg rounded-xl font-semibold">
              Explore Features →
            </Button>
          </div>
        </motion.div>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-12 bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 h-16 rounded-xl p-2">
            <TabsTrigger value="courses" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-300 rounded-lg h-12">
              <BookOpen className="w-5 h-5 mr-2" />
              VR Courses
            </TabsTrigger>
            <TabsTrigger value="live" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-slate-300 rounded-lg h-12">
              <Users className="w-5 h-5 mr-2" />
              Live Sessions
            </TabsTrigger>
            <TabsTrigger value="interactive" className="data-[state=active]:bg-green-600 data-[state=active]:text-white text-slate-300 rounded-lg h-12">
              <Target className="w-5 h-5 mr-2" />
              3D Models
            </TabsTrigger>
          </TabsList>

          {/* VR Courses Tab */}
          <TabsContent value="courses" className="space-y-10">
            {/* Featured Course */}
            <Card className="bg-transparent backdrop-blur-xl border border-slate-700/30 overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 p-10">
                <div className="aspect-video bg-slate-800/50 rounded-2xl overflow-hidden relative group">
                  <img 
                    src={filteredVideos[0]?.thumbnail}
                    alt={filteredVideos[0]?.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <Button
                      onClick={() => handleCourseSelect(filteredVideos[0])}
                      className="bg-blue-600/90 hover:bg-blue-700 text-white rounded-full p-5"
                    >
                      <Play className="w-10 h-10" />
                    </Button>
                  </div>
                  <Badge className="absolute top-4 left-4 bg-yellow-600 text-white px-3 py-1">
                    Featured Course
                  </Badge>
                  <Badge className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1">
                    👓 3D Mode
                  </Badge>
                  {progressById[filteredVideos[0]?.youtubeId] !== undefined && (
                    <Badge className="absolute bottom-3 left-3 bg-green-600 text-white px-3 py-1">
                      {progressById[filteredVideos[0]?.youtubeId]}% watched
                    </Badge>
                  )}
                </div>
                
                <div className="flex flex-col justify-center space-y-6">
                  <div>
                    <h2 className="text-4xl font-bold text-white mb-4">
                      {filteredVideos[0]?.title || "Atomic Structure & Chemical Bonds"}
                    </h2>
                    <p className="text-slate-300 mb-6 text-lg">
                      {filteredVideos[0]?.description || "Dive deep into the microscopic world of atoms and molecules."}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-8 text-slate-400">
                    <span className="flex items-center bg-slate-800/50 px-4 py-2 rounded-lg">
                      <Users className="w-5 h-5 mr-2 text-blue-400" />
                      {filteredVideos[0]?.students?.toLocaleString() || "2,847"} students
                    </span>
                    <span className="flex items-center bg-slate-800/50 px-4 py-2 rounded-lg">
                      <Star className="w-5 h-5 mr-2 text-yellow-400" />
                      {filteredVideos[0]?.rating || "4.9"} rating
                    </span>
                  </div>
                  
                  <Button 
                    onClick={() => handleCourseSelect(filteredVideos[0])}
                    className="w-fit bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 text-lg font-semibold rounded-xl"
                  >
                    <Play className="w-6 h-6 mr-3" />
                    Start Learning
                  </Button>
                </div>
              </div>
            </Card>

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredVideos.slice(1).map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.6 }}
                >
                  <Card className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 hover:border-blue-500/50 transition-all duration-500 group overflow-hidden">
                    <div className="relative aspect-video overflow-hidden">
                      <img 
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      
                      <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                        <Button
                          onClick={() => handleCourseSelect(course)}
                          className="bg-blue-600/90 hover:bg-blue-700 text-white rounded-full p-4"
                        >
                          <Play className="w-8 h-8" />
                        </Button>
                      </div>
                      
                      <Badge className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 text-xs">
                        {course.subject}
                      </Badge>
                      
                      <Badge className="absolute top-3 right-3 bg-red-600 text-white px-2 py-1 text-xs">
                        👓 3D
                      </Badge>
                      {progressById[course.youtubeId] !== undefined && (
                        <Badge className="absolute bottom-3 left-3 bg-green-600 text-white px-2 py-1 text-xs">
                          {progressById[course.youtubeId]}%
                        </Badge>
                      )}
                    </div>
                    
                    <CardContent className="p-6 space-y-4">
                      <h3 className="text-white font-semibold text-xl mb-2 group-hover:text-blue-400 transition-colors duration-300">
                        {course.title}
                      </h3>
                      
                      <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                        {course.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-slate-400 py-2">
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1 text-blue-400" />
                          {course.duration}
                        </span>
                        <span className="flex items-center">
                          <Star className="w-4 h-4 mr-1 text-yellow-400" />
                          {course.rating}
                        </span>
                      </div>
                      
                      <Button 
                        onClick={() => handleCourseSelect(course)}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-xl"
                      >
                        <Play className="w-5 h-5 mr-2" />
                        Start VR Course
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Live Sessions Tab */}
          <TabsContent value="live" className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Live VR Sessions</h2>
              <p className="text-slate-400 text-xl">Join real-time immersive learning experiences</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: "Quantum Mechanics", instructor: "Dr. Singh", time: "2:00 PM", participants: 45, status: "live" },
                { title: "Biology Lab", instructor: "Prof. Green", time: "3:30 PM", participants: 32, status: "upcoming" }
              ].map((session, index) => (
                <Card key={index} className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50">
                  <CardContent className="p-8">
                    <h3 className="text-white font-bold text-xl mb-2">{session.title}</h3>
                    <p className="text-slate-400 mb-4">{session.instructor}</p>
                    <Badge className={session.status === 'live' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'}>
                      {session.status === 'live' ? '🔴 LIVE' : '⏰ Upcoming'}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Interactive Models Tab */}
          <TabsContent value="interactive" className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Interactive 3D Models</h2>
              <p className="text-slate-400 text-xl">Explore complex concepts through 3D interactions</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Atom, title: "Atomic Structure", color: "from-blue-500 to-cyan-500" },
                { icon: Dna, title: "DNA & Genetics", color: "from-green-500 to-emerald-500" },
                { icon: Globe, title: "Solar System", color: "from-orange-500 to-yellow-500" },
                { icon: Brain, title: "Neural Networks", color: "from-purple-500 to-pink-500" }
              ].map((model, index) => {
                // provide embed URL for specific interactive models (use Sketchfab embed endpoint + UI params)
                const exploreEmbedUrl = model.title === 'Atomic Structure'
                  ? 'https://sketchfab.com/models/329e3e423749420db86334947999061f/embed?autostart=1&ui_infos=0&ui_controls=0'
                  : undefined;
                const IconComponent = model.icon;
                return (
                  <Card key={index} className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 hover:border-blue-500/50 transition-all duration-500 group">
                    <CardContent className="p-8 text-center">
                      <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${model.color} mx-auto mb-6 flex items-center justify-center`}>
                        <IconComponent className="w-12 h-12 text-white" />
                      </div>
                      <h3 className="text-white font-bold text-xl mb-4">{model.title}</h3>
                      <Button
                        onClick={() => {
                          if (exploreEmbedUrl) {
                            setModelEmbedUrl(exploreEmbedUrl);
                            setShowModelModal(true);
                          }
                        }}
                        className="w-full bg-gradient-to-r from-slate-700 to-slate-600 hover:from-blue-600 hover:to-indigo-600 text-white"
                      >
                        Explore in VR
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

        </Tabs>
      </div>

      {/* Course & Model Modals */}
      <AnimatePresence>
        {showCourseModal && selectedCourse && (
          <CourseModal
            course={selectedCourse}
            onClose={() => {
              setShowCourseModal(false);
              setSelectedCourse(null);
            }}
          />
        )}

        {showModelModal && modelEmbedUrl && (
          <ModelModal
            embedUrl={modelEmbedUrl}
            onClose={() => {
              setShowModelModal(false);
              setModelEmbedUrl(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default VRLearningHub;