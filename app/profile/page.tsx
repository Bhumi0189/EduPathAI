"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
  Brain,
  User,
  Settings,
  Award,
  BookOpen,
  Clock,
  TrendingUp,
  Bell,
  Shield,
  Palette,
  Save,
  Camera,
  Eye,
  Headphones,
  Hand,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { AuthGuard } from "@/components/auth-guard"

function ProfilePageContent() {
  const { user, refreshUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const [userProfile, setUserProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    avatar: "/placeholder.svg?height=100&width=100",
    learningStyle: "Visual",
    joinDate: "",
    location: "",
    timezone: "",
  })

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    studyReminders: true,
    weeklyReports: true,
    darkMode: false,
    language: "English",
  })

  const [achievements] = useState([
    { id: 1, title: "First Steps", description: "Complete your first lesson", earned: true, rarity: "Common" },
    { id: 2, title: "Quiz Master", description: "Score 100% on 5 quizzes", earned: false, rarity: "Rare" },
    { id: 3, title: "VR Pioneer", description: "Complete 10 VR sessions", earned: false, rarity: "Epic" },
    { id: 4, title: "Streak Legend", description: "Maintain a 30-day streak", earned: false, rarity: "Legendary" },
    { id: 5, title: "Knowledge Seeker", description: "Ask 100 questions to AI", earned: false, rarity: "Uncommon" },
    { id: 6, title: "Career Focused", description: "Complete career assessment", earned: true, rarity: "Common" },
  ])

  const [skillProgress] = useState([
    { skill: "JavaScript", level: 85, category: "Programming" },
    { skill: "React", level: 78, category: "Frontend" },
    { skill: "Python", level: 65, category: "Programming" },
    { skill: "UI/UX Design", level: 72, category: "Design" },
    { skill: "Machine Learning", level: 45, category: "AI/ML" },
    { skill: "Node.js", level: 58, category: "Backend" },
  ])

  useEffect(() => {
    if (user) {
      const nameParts = user.name.split(" ")
      setUserProfile({
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        email: user.email,
        bio: "Passionate learner exploring the world of technology and design.",
        avatar: "/placeholder.svg?height=100&width=100",
        learningStyle: user.learningStyle || "Visual",
        joinDate: new Date(user.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        }),
        location: "San Francisco, CA",
        timezone: "PST",
      })

      if (user.preferences) {
        setPreferences(user.preferences)
      }
    }
  }, [user])

  const getLearningStyleIcon = (style: string) => {
    switch (style) {
      case "Visual":
        return <Eye className="h-4 w-4" />
      case "Auditory":
        return <Headphones className="h-4 w-4" />
      case "Kinesthetic":
        return <Hand className="h-4 w-4" />
      default:
        return <Brain className="h-4 w-4" />
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Common":
        return "bg-gray-100 text-gray-700"
      case "Uncommon":
        return "bg-green-100 text-green-700"
      case "Rare":
        return "bg-blue-100 text-blue-700"
      case "Epic":
        return "bg-purple-100 text-purple-700"
      case "Legendary":
        return "bg-yellow-100 text-yellow-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const handleSaveProfile = async () => {
    setIsLoading(true)
    // TODO: Implement profile save functionality
    console.log("Saving profile:", userProfile)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  const handleSavePreferences = async () => {
    setIsLoading(true)
    // TODO: Implement preferences save functionality
    console.log("Saving preferences:", preferences)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold text-white">EduPath AI</span>
            </div>
          </div>
          <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            Profile Settings
          </Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-white/5 border-white/10">
              <TabsTrigger
                value="profile"
                className="flex items-center data-[state=active]:bg-white/10 data-[state=active]:text-white text-gray-400"
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="stats"
                className="flex items-center data-[state=active]:bg-white/10 data-[state=active]:text-white text-gray-400"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Statistics
              </TabsTrigger>
              <TabsTrigger
                value="achievements"
                className="flex items-center data-[state=active]:bg-white/10 data-[state=active]:text-white text-gray-400"
              >
                <Award className="h-4 w-4 mr-2" />
                Achievements
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="flex items-center data-[state=active]:bg-white/10 data-[state=active]:text-white text-gray-400"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card className="border-0 bg-white/5 backdrop-blur-xl">
                    <CardHeader>
                      <CardTitle className="text-white">Personal Information</CardTitle>
                      <CardDescription className="text-gray-400">
                        Update your profile details and learning preferences
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center space-x-6">
                        <div className="relative">
                          <Avatar className="w-24 h-24">
                            <AvatarImage
                              src={userProfile.avatar || "/placeholder.svg"}
                              alt={`${userProfile.firstName} ${userProfile.lastName}`}
                            />
                            <AvatarFallback className="text-2xl bg-blue-500 text-white">
                              {userProfile.firstName[0]}
                              {userProfile.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <Button
                            size="sm"
                            className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-blue-600 hover:bg-blue-700"
                          >
                            <Camera className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-white">
                            {userProfile.firstName} {userProfile.lastName}
                          </h3>
                          <p className="text-gray-400">{userProfile.email}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span>Joined {userProfile.joinDate}</span>
                            <span>•</span>
                            <span>{userProfile.location}</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName" className="text-gray-300">
                            First Name
                          </Label>
                          <Input
                            id="firstName"
                            value={userProfile.firstName}
                            onChange={(e) => setUserProfile({ ...userProfile, firstName: e.target.value })}
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-blue-400/50 focus:ring-blue-400/20"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName" className="text-gray-300">
                            Last Name
                          </Label>
                          <Input
                            id="lastName"
                            value={userProfile.lastName}
                            onChange={(e) => setUserProfile({ ...userProfile, lastName: e.target.value })}
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-blue-400/50 focus:ring-blue-400/20"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-300">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={userProfile.email}
                          onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
                          className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-blue-400/50 focus:ring-blue-400/20"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio" className="text-gray-300">
                          Bio
                        </Label>
                        <Textarea
                          id="bio"
                          placeholder="Tell us about yourself..."
                          value={userProfile.bio}
                          onChange={(e) => setUserProfile({ ...userProfile, bio: e.target.value })}
                          rows={3}
                          className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-blue-400/50 focus:ring-blue-400/20"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="location" className="text-gray-300">
                            Location
                          </Label>
                          <Input
                            id="location"
                            value={userProfile.location}
                            onChange={(e) => setUserProfile({ ...userProfile, location: e.target.value })}
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-blue-400/50 focus:ring-blue-400/20"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="timezone" className="text-gray-300">
                            Timezone
                          </Label>
                          <Input
                            id="timezone"
                            value={userProfile.timezone}
                            onChange={(e) => setUserProfile({ ...userProfile, timezone: e.target.value })}
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-blue-400/50 focus:ring-blue-400/20"
                          />
                        </div>
                      </div>

                      <Button
                        onClick={handleSaveProfile}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Saving...</span>
                          </div>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Profile
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card className="border-0 bg-white/5 backdrop-blur-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center text-white">
                        <Brain className="h-5 w-5 mr-2 text-blue-400" />
                        Learning Style
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-3 p-3 bg-blue-500/10 rounded-lg">
                        {getLearningStyleIcon(userProfile.learningStyle)}
                        <div>
                          <p className="font-medium text-white">{userProfile.learningStyle} Learner</p>
                          <p className="text-sm text-gray-400">Detected via AI quiz</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full mt-4 bg-transparent border-white/20 text-white hover:bg-white/10"
                        size="sm"
                      >
                        Retake Quiz
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-0 bg-white/5 backdrop-blur-xl">
                    <CardHeader>
                      <CardTitle className="text-white">Skill Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {skillProgress.slice(0, 4).map((skill, index) => (
                          <div key={index}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium text-white">{skill.skill}</span>
                              <span className="text-gray-400">{skill.level}%</span>
                            </div>
                            <Progress value={skill.level} className="h-2" />
                            <p className="text-xs text-gray-500 mt-1">{skill.category}</p>
                          </div>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        className="w-full mt-4 bg-transparent border-white/20 text-white hover:bg-white/10"
                        size="sm"
                      >
                        View All Skills
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="stats" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-0 bg-white/5 backdrop-blur-xl">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white">Study Hours</CardTitle>
                    <Clock className="h-4 w-4 text-blue-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{user.stats?.totalStudyHours || 0}</div>
                    <p className="text-xs text-gray-400">Total time invested</p>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-white/5 backdrop-blur-xl">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white">Courses</CardTitle>
                    <BookOpen className="h-4 w-4 text-green-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{user.stats?.coursesCompleted || 0}</div>
                    <p className="text-xs text-gray-400">Completed successfully</p>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-white/5 backdrop-blur-xl">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white">Current Streak</CardTitle>
                    <TrendingUp className="h-4 w-4 text-orange-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{user.stats?.currentStreak || 0}</div>
                    <p className="text-xs text-gray-400">Days in a row</p>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-white/5 backdrop-blur-xl">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white">Level</CardTitle>
                    <Award className="h-4 w-4 text-purple-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{user.stats?.level || 1}</div>
                    <p className="text-xs text-gray-400">{user.stats?.totalXP || 0} XP total</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="border-0 bg-white/5 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-white">Learning Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-white">Quizzes Completed</span>
                          <span className="text-gray-400">{user.stats?.quizzesTaken || 0}</span>
                        </div>
                        <Progress value={75} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-white">VR Sessions</span>
                          <span className="text-gray-400">{user.stats?.vrSessionsCompleted || 0}</span>
                        </div>
                        <Progress value={60} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-white">AI Interactions</span>
                          <span className="text-gray-400">0</span>
                        </div>
                        <Progress value={0} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-white/5 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-white">Streak History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-white">Current Streak</span>
                        <Badge variant="default" className="bg-blue-600">
                          {user.stats?.currentStreak || 0} days
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-white">Longest Streak</span>
                        <Badge variant="outline" className="border-white/20 text-white">
                          {user.stats?.longestStreak || 0} days
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-white">This Week</span>
                        <Badge variant="secondary" className="bg-white/10 text-white">
                          0/7 days
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-white">This Month</span>
                        <Badge variant="secondary" className="bg-white/10 text-white">
                          0/30 days
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-6">
              <div className="grid gap-4">
                {achievements.map((achievement) => (
                  <Card
                    key={achievement.id}
                    className={`border-0 bg-white/5 backdrop-blur-xl ${achievement.earned ? "border-green-500/20" : "opacity-60"}`}
                  >
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            achievement.earned ? "bg-green-500/20" : "bg-white/10"
                          }`}
                        >
                          <Award className={`h-6 w-6 ${achievement.earned ? "text-green-400" : "text-gray-400"}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{achievement.title}</h3>
                          <p className="text-sm text-gray-400">{achievement.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getRarityColor(achievement.rarity)}>{achievement.rarity}</Badge>
                        {achievement.earned && (
                          <Badge variant="default" className="bg-green-500/20 text-green-400 border-green-500/30">
                            Earned
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="border-0 bg-white/5 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      <Bell className="h-5 w-5 mr-2 text-blue-400" />
                      Notifications
                    </CardTitle>
                    <CardDescription className="text-gray-400">Manage your notification preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-notifications" className="text-white">
                          Email Notifications
                        </Label>
                        <p className="text-sm text-gray-400">Receive updates via email</p>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={preferences.emailNotifications}
                        onCheckedChange={(checked) => setPreferences({ ...preferences, emailNotifications: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="push-notifications" className="text-white">
                          Push Notifications
                        </Label>
                        <p className="text-sm text-gray-400">Receive browser notifications</p>
                      </div>
                      <Switch
                        id="push-notifications"
                        checked={preferences.pushNotifications}
                        onCheckedChange={(checked) => setPreferences({ ...preferences, pushNotifications: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="study-reminders" className="text-white">
                          Study Reminders
                        </Label>
                        <p className="text-sm text-gray-400">Daily study session reminders</p>
                      </div>
                      <Switch
                        id="study-reminders"
                        checked={preferences.studyReminders}
                        onCheckedChange={(checked) => setPreferences({ ...preferences, studyReminders: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="weekly-reports" className="text-white">
                          Weekly Reports
                        </Label>
                        <p className="text-sm text-gray-400">Weekly progress summaries</p>
                      </div>
                      <Switch
                        id="weekly-reports"
                        checked={preferences.weeklyReports}
                        onCheckedChange={(checked) => setPreferences({ ...preferences, weeklyReports: checked })}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-white/5 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      <Palette className="h-5 w-5 mr-2 text-purple-400" />
                      Appearance
                    </CardTitle>
                    <CardDescription className="text-gray-400">Customize your learning experience</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="dark-mode" className="text-white">
                          Dark Mode
                        </Label>
                        <p className="text-sm text-gray-400">Switch to dark theme</p>
                      </div>
                      <Switch
                        id="dark-mode"
                        checked={preferences.darkMode}
                        onCheckedChange={(checked) => setPreferences({ ...preferences, darkMode: checked })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="language" className="text-white">
                        Language
                      </Label>
                      <Input
                        id="language"
                        value={preferences.language}
                        readOnly
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-0 bg-white/5 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Shield className="h-5 w-5 mr-2 text-red-400" />
                    Privacy & Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent border-white/20 text-white hover:bg-white/10"
                  >
                    Change Password
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent border-white/20 text-white hover:bg-white/10"
                  >
                    Download My Data
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-red-400 hover:text-red-300 bg-transparent border-red-500/20 hover:bg-red-500/10"
                  >
                    Delete Account
                  </Button>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button onClick={handleSavePreferences} className="bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Saving...</span>
                    </div>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Settings
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <AuthGuard requireAuth={true}>
      <ProfilePageContent />
    </AuthGuard>
  )
}
