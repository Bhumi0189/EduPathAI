"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Brain,
  BookOpen,
  Gamepad2,
  MessageCircle,
  Target,
  Zap,
  Clock,
  Award,
  Users,
  BarChart3,
  Flame,
  Trophy,
  ChevronRight,
  Play,
  Eye,
  LogOut,
  Home,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { AuthGuard } from "@/components/auth-guard"
import { useRouter } from "next/navigation"

function DashboardContent() {
  const { user, logout } = useAuth()
  const [isLoaded, setIsLoaded] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [studyHours, setStudyHours] = useState<number | null>(null)
  const [dayStreak, setDayStreak] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)
  const [profile, setProfile] = useState<{
    learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading' | 'mixed'
    interactions: { visual: number; auditory: number; kinesthetic: number; reading: number }
  }>({ learningStyle: 'mixed', interactions: { visual: 0, auditory: 0, kinesthetic: 0, reading: 0 } })
  const router = useRouter()

  useEffect(() => {
    setIsLoaded(true)

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Reset profile state when user switches to ensure no leakage of previous user's data
  useEffect(() => {
    setProfile({ learningStyle: 'mixed', interactions: { visual: 0, auditory: 0, kinesthetic: 0, reading: 0 } })
  }, [user?.id])

  // mark mounted to help avoid hydration quirks for dynamic values
  useEffect(() => { setMounted(true) }, [])

  // Real-time Learning Style: fetch from /api/gamified and poll every 2s
  useEffect(() => {
    if (!user?.id) return
    let active = true
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/gamified?userId=${encodeURIComponent(user.id)}`, { cache: 'no-store' })
        if (!active || !res.ok) return
        const data = await res.json()
        if (data && data.userId) {
          setProfile({
            learningStyle: (data.learningStyle || 'mixed'),
            interactions: data.interactions || { visual: 0, auditory: 0, kinesthetic: 0, reading: 0 },
          })
        }
      } catch { /* ignore */ }
    }
    fetchProfile()
    const id = setInterval(fetchProfile, 2000)
    return () => { active = false; clearInterval(id) }
  }, [user?.id])

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  const handleBackToHome = () => {
    router.push("/")
  }

  if (!user) return null

  // Define stats with proper typing
  const stats = [
    { 
      icon: BookOpen, 
      label: "Courses", 
      value: user.stats?.coursesCompleted || 0, 
      colorClass: "text-blue-400" 
    },
    { 
      icon: Trophy, 
      label: "Level", 
      value: user.stats?.level || 1, 
      colorClass: "text-yellow-400" 
    },
    { 
      icon: Clock, 
      label: "Study Time", 
      value: `${studyHours !== null ? studyHours : (user.stats?.totalStudyHours || 0)}h`, 
      colorClass: "text-green-400" 
    },
    { 
      icon: Target, 
      label: "XP", 
      value: user.stats?.totalXP || 0, 
      colorClass: "text-purple-400" 
    },
  ]

  const courses = [
    {
      title: "Advanced React Patterns",
      progress: 75,
      time: "2h 30m left",
      icon: Play,
      colorClass: "text-blue-400",
    },
    {
      title: "Machine Learning Fundamentals",
      progress: 45,
      time: "4h 15m left",
      icon: Brain,
      colorClass: "text-purple-400",
    },
    {
      title: "Data Structures & Algorithms",
      progress: 90,
      time: "30m left",
      icon: Target,
      colorClass: "text-green-400",
    },
  ]

  // Student-specific modules loaded from the progress API
  const [studentModules, setStudentModules] = useState<{
    moduleId: string
    title: string
    progress: number
    time?: string
    icon?: any
    colorClass?: string
  }[]>([])

  // map module ids (from Model3D / learningProgress) to display titles and optional icon/colors
  const moduleMeta: Record<string, { title: string; icon?: any; colorClass?: string }> = {
    plant: { title: "Plant Anatomy", icon: Play, colorClass: "text-green-400" },
    solar: { title: "Solar System", icon: Play, colorClass: "text-indigo-400" },
    body: { title: "Human Body", icon: Play, colorClass: "text-red-400" },
    coding: { title: "3D Programming", icon: Play, colorClass: "text-blue-400" },
  }

  useEffect(() => {
    let mounted = true
    const normalizePercent = (val: any): number => {
      let n = typeof val === 'number' ? val : parseFloat(val)
      if (!isFinite(n) || isNaN(n)) n = 0
      // Convert fractional (0..1) to percent
      if (n > 0 && n <= 1) n = n * 100
      // Clamp and round to int for clean UI
      n = Math.max(0, Math.min(100, Math.round(n)))
      return n
    }

    const loadStudentModules = async () => {
      if (!user?.id) return
      try {
        const res = await fetch(`/api/progress?userId=${encodeURIComponent(user.id)}`)
        if (!mounted) return
        if (!res.ok) return
        const data = await res.json()

        // update top-level stats if provided by the progress doc
        if (data && typeof data.totalStudyHours === 'number') setStudyHours(data.totalStudyHours)
        if (data && typeof data.currentStreak === 'number') setDayStreak(data.currentStreak)

        // Shape A (legacy): { modules: [...], progress }
        if (data && Array.isArray(data.modules)) {
          const overallProgress = typeof data.progress === 'number' ? data.progress : undefined
          const mapped = data.modules.map((m: any) => {
            const meta = moduleMeta[m.moduleId] || { title: m.moduleId }

            // If only one module present and overall progress provided, prefer it
            let progress: number | undefined = undefined
            if (typeof overallProgress === 'number' && data.modules.length === 1) progress = overallProgress
            // Otherwise choose best available field
            if (progress === undefined) {
              if (typeof m.progress === 'number') progress = m.progress
              else if (typeof m.score === 'number') progress = m.score
              else if (m.completed) progress = 100
            }
            progress = normalizePercent(progress)

            return {
              moduleId: m.moduleId,
              title: meta.title || m.moduleId,
              progress,
              time: m.completedAt ? new Date(m.completedAt).toLocaleString() : undefined,
              icon: meta.icon,
              colorClass: meta.colorClass,
            }
          })
          setStudentModules(mapped)
          return
        }

        // Shape B (current): { perVideo: [{ youtubeId, title, subject, percent, lastRecordedAt }], raw: {...}}
        if (data && Array.isArray(data.perVideo)) {
          const mapped = data.perVideo
            // prefer most recent
            .sort((a: any, b: any) => new Date(b.lastRecordedAt || 0).getTime() - new Date(a.lastRecordedAt || 0).getTime())
            .slice(0, 3)
            .map((v: any) => {
              const moduleId = v.youtubeId
              const percent = normalizePercent(v.percent)
              const title = v.title || v.subject || moduleId
              return {
                moduleId,
                title,
                progress: percent,
                time: v.lastRecordedAt ? new Date(v.lastRecordedAt).toLocaleString() : undefined,
                icon: Play,
                colorClass: 'text-blue-400',
              }
            })
          setStudentModules(mapped)
          return
        }
      } catch (err) {
        console.error('Failed to load student modules', err)
      }
    }
    loadStudentModules()
    return () => { mounted = false }
  }, [user])

  // Listen for real-time updates via BroadcastChannel (other tabs/pages will post updates)
  useEffect(() => {
    if (typeof window === 'undefined' || !('BroadcastChannel' in window)) return
    const bc = new BroadcastChannel('edupath-progress')
    const handler = (ev: MessageEvent) => {
      const msg = ev.data
      if (!msg || !user?.id) return
      if (msg.userId !== user.id) return
      const { moduleId, progress } = msg
      if (typeof msg.totalStudyHours === 'number') setStudyHours(msg.totalStudyHours)
      if (typeof msg.currentStreak === 'number') setDayStreak(msg.currentStreak)
      setStudentModules((prev) => {
        const idx = prev.findIndex((p) => p.moduleId === moduleId)
        if (idx > -1) {
          const copy = [...prev]
          copy[idx] = { ...copy[idx], progress }
          return copy
        }
        const meta = moduleMeta[moduleId] || { title: moduleId }
        return [...prev, { moduleId, title: meta.title, progress, icon: meta.icon, colorClass: meta.colorClass }]
      })
    }
    bc.addEventListener('message', handler)
    return () => {
      bc.removeEventListener('message', handler)
      bc.close()
    }
  }, [user])

  const recommendations = [
    {
      title: "VR Chemistry Lab",
      description: "Immersive molecular visualization",
      icon: Gamepad2,
      badge: "New",
      iconColor: "text-green-400",
      badgeColor: "bg-green-500/20 text-green-400 border-green-500/30",
    },
    {
      title: "AI Coding Assistant",
      description: "Get help with programming challenges",
      icon: MessageCircle,
      badge: "Popular",
      iconColor: "text-blue-400",
      badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    },
  ]

  const quickActions = [
    { icon: MessageCircle, label: "Ask AI Tutor", href: "/ai-chat" },
    { icon: Gamepad2, label: "VR Learning", href: "/vr-learning" },
    { icon: BarChart3, label: "View Progress", href: "/progress" },
    { icon: Users, label: "Study Groups", href: "/groups" },
  ]

  const achievements = [
    { 
      title: "Welcome!", 
      description: "Successfully created your account", 
      icon: "🎉" 
    },
    { 
      title: "First Login", 
      description: "Logged in for the first time", 
      icon: "🚀" 
    },
    { 
      title: "Profile Setup", 
      description: "Completed your profile", 
      icon: "✨" 
    },
  ]

  const totalInteractions = Object.values(profile.interactions).reduce((a, b) => a + b, 0)
  const pct = (n: number) => (totalInteractions > 0 ? Math.round((n / totalInteractions) * 100) : 0)
  const learningStyles = [
    { label: "Visual", value: pct(profile.interactions.visual) },
    { label: "Auditory", value: pct(profile.interactions.auditory) },
    { label: "Kinesthetic", value: pct(profile.interactions.kinesthetic) },
    { label: "Reading", value: pct(profile.interactions.reading) },
  ]

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute w-[800px] h-[800px] opacity-20 transition-all duration-1000 ease-out"
          style={{
            background: `radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(147, 51, 234, 0.2) 50%, transparent 100%)`,
            left: `${mousePosition.x * 0.3}%`,
            top: `${mousePosition.y * 0.2}%`,
            transform: "translate(-50%, -50%)",
            filter: "blur(60px)",
          }}
        />

        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-30 animate-float-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${4 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="relative z-20 p-4 sm:p-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-white font-semibold text-xl sm:text-2xl">EduPathAI</div>
          <div className="flex gap-2 sm:gap-3">
            <Button
              onClick={handleBackToHome}
              className="bg-transparent border border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white transition-all duration-300"
            >
              <Home className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Back to Home</span>
            </Button>
            <Button
              onClick={handleLogout}
              className="bg-transparent border border-red-600 text-red-400 hover:bg-red-600 hover:text-white transition-all duration-300"
            >
              <LogOut className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 sm:px-6 py-8 max-w-7xl">
        {/* Welcome Section */}
        <div
          className={`mb-12 transition-all duration-1000 ${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-light text-white mb-2 animate-glow-text">
                Welcome back, {user.name.split(" ")[0]}
              </h1>
              <p className="text-gray-400">Ready to continue your learning journey?</p>
            </div>
            <div className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-lg backdrop-blur-sm">
              <Flame className="h-5 w-5 text-orange-400 animate-pulse" />
              <span className="text-white font-medium">{dayStreak !== null ? dayStreak : (user.stats?.currentStreak || 0)} day streak</span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <Card
                  key={index}
                  className={`border-0 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-500 hover:scale-105 group ${
                    isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                  }`}
                  style={{ transitionDelay: `${200 + index * 100}ms` }}
                >
                  <CardContent className="p-4 text-center">
                    <IconComponent
                      className={`h-6 w-6 mx-auto mb-2 ${stat.colorClass} group-hover:scale-110 transition-transform duration-300`}
                    />
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-xs text-gray-400">{stat.label}</div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Continue Learning */}
            <Card
              className={`border-0 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-500 ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
              style={{ transitionDelay: "600ms" }}
            >
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Play className="h-5 w-5 mr-2 text-blue-400" />
                  Continue Learning
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {
                  // if we have student-specific modules, show them; otherwise fall back to static courses
                  (studentModules.length ? studentModules : courses).map((course, index) => {
                    const IconComponent = course.icon || Play
                    return (
                      <div
                        key={index}
                        className="flex items-center space-x-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 group cursor-pointer"
                      >
                        <div className="flex-shrink-0">
                          <IconComponent className={`h-5 w-5 ${course.colorClass || 'text-blue-400'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-medium group-hover:text-blue-400 transition-colors duration-300">
                            {course.title}
                          </h3>
                          <div className="flex items-center space-x-3 mt-2">
                            <Progress value={course.progress} className="flex-1 h-2" />
                            <span className="text-xs text-gray-400">{course.progress}%</span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">{course.time}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                    )
                  })
                }
              </CardContent>
            </Card>

            {/* AI Recommendations */}
            <Card
              className={`border-0 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-500 ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
              style={{ transitionDelay: "800ms" }}
            >
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-yellow-400" />
                  AI Recommendations
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Personalized suggestions based on your learning style
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {recommendations.map((item, index) => {
                    const IconComponent = item.icon
                    return (
                      <div
                        key={index}
                        className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 group cursor-pointer hover:scale-105"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <IconComponent
                            className={`h-6 w-6 ${item.iconColor} group-hover:scale-110 transition-transform duration-300`}
                          />
                          <Badge className={`${item.badgeColor}`}>{item.badge}</Badge>
                        </div>
                        <h3 className="text-white font-medium mb-2 group-hover:text-blue-400 transition-colors duration-300">
                          {item.title}
                        </h3>
                        <p className="text-gray-400 text-sm">{item.description}</p>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Learning Style */}
            <Card
              className={`border-0 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-500 ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
              style={{ transitionDelay: "400ms" }}
            >
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Eye className="h-5 w-5 mr-2 text-purple-400" />
                  Your Learning Style
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-white mb-2 capitalize">{mounted ? profile.learningStyle : 'mixed'}</div>
                  <p className="text-gray-400 text-sm">Live insights based on your interactions</p>
                </div>
                <div className="space-y-3">
                  {learningStyles.map((style, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-400 text-sm">{style.label}</span>
                        <span className="text-white text-sm">{style.value}%</span>
                      </div>
                      <Progress value={style.value} className="h-2" />
                    </div>
                  ))}
                  <div className="text-xs text-gray-400 mt-2">Total interactions: {mounted ? totalInteractions : 0}</div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card
              className={`border-0 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-500 ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
              style={{ transitionDelay: "1000ms" }}
            >
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickActions.map((action, index) => {
                  const IconComponent = action.icon
                  return (
                    <Link key={index} href={action.href}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300 group"
                      >
                        <IconComponent className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform duration-300" />
                        {action.label}
                        <ChevronRight className="h-4 w-4 ml-auto group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </Link>
                  )
                })}
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card
              className={`border-0 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-500 ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
              style={{ transitionDelay: "1200ms" }}
            >
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Award className="h-5 w-5 mr-2 text-yellow-400" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 group"
                  >
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium group-hover:text-yellow-400 transition-colors duration-300">
                        {achievement.title}
                      </h4>
                      <p className="text-gray-400 text-sm">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float-particle {
          0%,
          100% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
            opacity: 0.3;
          }
          25% {
            transform: translateY(-20px) translateX(10px) rotate(90deg);
            opacity: 0.5;
          }
          50% {
            transform: translateY(-40px) translateX(-5px) rotate(180deg);
            opacity: 0.3;
          }
          75% {
            transform: translateY(-20px) translateX(-10px) rotate(270deg);
            opacity: 0.5;
          }
        }

        @keyframes glow-text {
          0%,
          100% {
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
          }
          50% {
            text-shadow: 0 0 20px rgba(255, 255, 255, 0.15), 0 0 30px rgba(59, 130, 246, 0.1);
          }
        }

        .animate-float-particle {
          animation: float-particle 4s ease-in-out infinite;
        }

        .animate-glow-text {
          animation: glow-text 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default function Dashboard() {
  return (
    <AuthGuard requireAuth={true}>
      <DashboardContent />
    </AuthGuard>
  )
}