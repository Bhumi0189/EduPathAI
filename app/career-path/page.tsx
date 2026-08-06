"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  Code,
  Palette,
  TrendingUp,
  Users,
  Briefcase,
  GraduationCap,
  ArrowRight,
  Target,
  BookOpen,
  Award,
} from "lucide-react"

export default function CareerPathPage() {
  const [userProfile] = useState({
    name: "Alex Johnson",
    learningStyle: "Visual",
    interests: ["Technology", "Problem Solving", "Creative Design"],
    skills: ["JavaScript", "React", "Python", "UI/UX Design"],
    goals: ["Full Stack Development", "Machine Learning", "Product Design"],
  })

  const [careerRecommendations] = useState([
    {
      id: 1,
      title: "Full Stack Developer",
      match: 92,
      description: "Build end-to-end web applications using modern technologies",
      skills: ["JavaScript", "React", "Node.js", "Databases"],
      salary: "$75,000 - $120,000",
      growth: "High",
      icon: Code,
      color: "blue",
    },
    {
      id: 2,
      title: "UX/UI Designer",
      match: 88,
      description: "Design user-friendly interfaces and experiences",
      skills: ["Figma", "User Research", "Prototyping", "Visual Design"],
      salary: "$65,000 - $110,000",
      growth: "High",
      icon: Palette,
      color: "purple",
    },
    {
      id: 3,
      title: "Data Scientist",
      match: 85,
      description: "Analyze data to extract insights and build predictive models",
      skills: ["Python", "Machine Learning", "Statistics", "SQL"],
      salary: "$80,000 - $130,000",
      growth: "Very High",
      icon: TrendingUp,
      color: "green",
    },
    {
      id: 4,
      title: "Product Manager",
      match: 78,
      description: "Guide product development from conception to launch",
      skills: ["Strategy", "Analytics", "Communication", "Leadership"],
      salary: "$90,000 - $150,000",
      growth: "High",
      icon: Briefcase,
      color: "orange",
    },
  ])

  const [learningPaths] = useState([
    {
      id: 1,
      career: "Full Stack Developer",
      duration: "6-12 months",
      courses: [
        { name: "JavaScript Fundamentals", completed: true, duration: "4 weeks" },
        { name: "React Development", completed: true, duration: "6 weeks" },
        { name: "Node.js & Express", completed: false, duration: "5 weeks" },
        { name: "Database Design", completed: false, duration: "4 weeks" },
        { name: "DevOps Basics", completed: false, duration: "3 weeks" },
      ],
    },
    {
      id: 2,
      career: "UX/UI Designer",
      duration: "4-8 months",
      courses: [
        { name: "Design Principles", completed: false, duration: "3 weeks" },
        { name: "User Research Methods", completed: false, duration: "4 weeks" },
        { name: "Figma Mastery", completed: false, duration: "3 weeks" },
        { name: "Prototyping & Testing", completed: false, duration: "5 weeks" },
        { name: "Portfolio Development", completed: false, duration: "4 weeks" },
      ],
    },
  ])

  const [skillGaps] = useState([
    { skill: "Node.js", current: 30, target: 80, priority: "High" },
    { skill: "Database Design", current: 20, target: 75, priority: "High" },
    { skill: "System Design", current: 15, target: 70, priority: "Medium" },
    { skill: "DevOps", current: 10, target: 60, priority: "Medium" },
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900">EduPath AI</span>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            Career Guidance
          </Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your AI-Powered Career Path</h1>
          <p className="text-gray-600">
            Discover personalized career recommendations based on your learning style, skills, and interests.
          </p>
        </div>

        <Tabs defaultValue="recommendations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="learning-paths">Learning Paths</TabsTrigger>
            <TabsTrigger value="skill-gaps">Skill Analysis</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="recommendations" className="space-y-6">
            <div className="grid gap-6">
              {careerRecommendations.map((career) => {
                const IconComponent = career.icon
                return (
                  <Card key={career.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-12 h-12 bg-${career.color}-100 rounded-lg flex items-center justify-center`}
                          >
                            <IconComponent className={`h-6 w-6 text-${career.color}-600`} />
                          </div>
                          <div>
                            <CardTitle className="text-xl">{career.title}</CardTitle>
                            <CardDescription>{career.description}</CardDescription>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="default" className="mb-2">
                            {career.match}% Match
                          </Badge>
                          <div className="text-sm text-gray-600">
                            <p>{career.salary}</p>
                            <p className="text-green-600 font-medium">{career.growth} Growth</p>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Required Skills:</h4>
                          <div className="flex flex-wrap gap-2">
                            {career.skills.map((skill, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              High Demand
                            </div>
                            <div className="flex items-center">
                              <GraduationCap className="h-4 w-4 mr-1" />
                              Bachelor's Preferred
                            </div>
                          </div>
                          <Button>
                            Explore Path
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="learning-paths" className="space-y-6">
            <div className="grid gap-6">
              {learningPaths.map((path) => (
                <Card key={path.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{path.career} Learning Path</CardTitle>
                        <CardDescription>Estimated completion: {path.duration}</CardDescription>
                      </div>
                      <Badge variant="outline">
                        {path.courses.filter((c) => c.completed).length}/{path.courses.length} Complete
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {path.courses.map((course, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                course.completed ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                              }`}
                            >
                              {course.completed ? <Award className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
                            </div>
                            <div>
                              <p className="font-medium">{course.name}</p>
                              <p className="text-sm text-gray-600">{course.duration}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {course.completed ? (
                              <Badge variant="default" className="bg-green-100 text-green-700">
                                Completed
                              </Badge>
                            ) : (
                              <Button size="sm" variant="outline">
                                Start Course
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="skill-gaps" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Skill Gap Analysis</CardTitle>
                <CardDescription>Areas to focus on for your target career path</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {skillGaps.map((skill, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{skill.skill}</h4>
                          <Badge variant={skill.priority === "High" ? "destructive" : "secondary"} className="text-xs">
                            {skill.priority} Priority
                          </Badge>
                        </div>
                        <span className="text-sm text-gray-600">
                          {skill.current}% → {skill.target}%
                        </span>
                      </div>
                      <div className="space-y-1">
                        <Progress value={skill.current} className="h-2 bg-gray-200" />
                        <Progress value={skill.target} className="h-1 bg-green-200" />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Current Level</span>
                        <span>Target Level</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Learning Style</h4>
                      <Badge variant="default">{userProfile.learningStyle}</Badge>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Interests</h4>
                      <div className="flex flex-wrap gap-2">
                        {userProfile.interests.map((interest, index) => (
                          <Badge key={index} variant="outline">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Current Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {userProfile.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Career Goals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {userProfile.goals.map((goal, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <Target className="h-5 w-5 text-indigo-600" />
                        <span className="font-medium">{goal}</span>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4 bg-transparent" variant="outline">
                    Update Goals
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
