"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Brain, Eye, Headphones, Hand, ArrowRight, ArrowLeft, CheckCircle, Sparkles, Star } from "lucide-react"

const learningStyleQuestions = [
  {
    id: 1,
    question: "When learning something new, I prefer to:",
    options: [
      { value: "visual", text: "See diagrams, charts, or visual representations", style: "Visual" },
      { value: "auditory", text: "Listen to explanations or discuss with others", style: "Auditory" },
      { value: "kinesthetic", text: "Try it hands-on or practice immediately", style: "Kinesthetic" },
    ],
  },
  {
    id: 2,
    question: "When following directions, I:",
    options: [
      { value: "visual", text: "Need to see a map or written instructions", style: "Visual" },
      { value: "auditory", text: "Prefer verbal directions", style: "Auditory" },
      { value: "kinesthetic", text: "Need to walk through it or try it myself", style: "Kinesthetic" },
    ],
  },
  {
    id: 3,
    question: "I remember information best when:",
    options: [
      { value: "visual", text: "I can see it written down or in pictures", style: "Visual" },
      { value: "auditory", text: "I hear it explained or discuss it", style: "Auditory" },
      { value: "kinesthetic", text: "I can practice or experience it", style: "Kinesthetic" },
    ],
  },
  {
    id: 4,
    question: "When solving problems, I tend to:",
    options: [
      { value: "visual", text: "Draw diagrams or make lists", style: "Visual" },
      { value: "auditory", text: "Talk through the problem", style: "Auditory" },
      { value: "kinesthetic", text: "Try different approaches until something works", style: "Kinesthetic" },
    ],
  },
  {
    id: 5,
    question: "In a classroom, I learn best when:",
    options: [
      { value: "visual", text: "There are visual aids and written materials", style: "Visual" },
      { value: "auditory", text: "The teacher explains concepts verbally", style: "Auditory" },
      { value: "kinesthetic", text: "There are hands-on activities and experiments", style: "Kinesthetic" },
    ],
  },
]

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [learningStyle, setLearningStyle] = useState<string>("")

  const handleAnswerChange = (value: string) => {
    setAnswers({ ...answers, [currentQuestion]: value })
  }

  const handleNext = () => {
    if (currentQuestion < learningStyleQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      calculateResults()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const calculateResults = () => {
    const scores = { visual: 0, auditory: 0, kinesthetic: 0 }

    Object.values(answers).forEach((answer) => {
      scores[answer as keyof typeof scores]++
    })

    const maxScore = Math.max(...Object.values(scores))
    const dominantStyle = Object.keys(scores).find((key) => scores[key as keyof typeof scores] === maxScore)

    setLearningStyle(dominantStyle?.charAt(0).toUpperCase() + dominantStyle?.slice(1) || "Visual")
    setShowResults(true)
  }

  const progress = ((currentQuestion + 1) / learningStyleQuestions.length) * 100

  const getLearningStyleIcon = (style: string) => {
    switch (style) {
      case "Visual":
        return <Eye className="h-12 w-12 text-blue-400" />
      case "Auditory":
        return <Headphones className="h-12 w-12 text-green-400" />
      case "Kinesthetic":
        return <Hand className="h-12 w-12 text-purple-400" />
      default:
        return <Brain className="h-12 w-12 text-cyan-400" />
    }
  }

  const getLearningStyleDescription = (style: string) => {
    switch (style) {
      case "Visual":
        return "You learn best through visual aids like diagrams, charts, and written information. You prefer to see concepts illustrated and organized visually."
      case "Auditory":
        return "You learn best through listening and verbal communication. You prefer explanations, discussions, and audio materials."
      case "Kinesthetic":
        return "You learn best through hands-on experience and physical activity. You prefer to learn by doing and practicing."
      default:
        return "Your learning style helps determine the best methods for your education."
    }
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden flex items-center justify-center p-4">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        </div>

        <Card className="w-full max-w-3xl shadow-2xl border-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl relative z-10">
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <CheckCircle className="h-20 w-20 text-green-400" />
                <div className="absolute inset-0 bg-green-400 blur-xl opacity-30"></div>
              </div>
            </div>
            <CardTitle className="text-4xl font-bold text-white mb-2">Quiz Complete!</CardTitle>
            <CardDescription className="text-xl text-gray-300">Your learning style has been detected</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-8">
            <div className="mb-8">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  {getLearningStyleIcon(learningStyle)}
                  <div className="absolute inset-0 blur-xl opacity-30 bg-current"></div>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  {learningStyle} Learner
                </span>
              </h2>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
                {getLearningStyleDescription(learningStyle)}
              </p>
            </div>

            <div className="bg-gradient-to-r from-white/5 to-white/10 rounded-2xl p-8 border border-white/10">
              <h3 className="font-bold text-xl text-white mb-6">Recommended Learning Strategies:</h3>
              <div className="grid gap-4 text-left">
                {learningStyle === "Visual" && (
                  <>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"></div>
                      <span className="text-gray-300">Use mind maps and flowcharts</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"></div>
                      <span className="text-gray-300">Take detailed notes with diagrams</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"></div>
                      <span className="text-gray-300">Use color coding and highlighting</span>
                    </div>
                  </>
                )}
                {learningStyle === "Auditory" && (
                  <>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"></div>
                      <span className="text-gray-300">Listen to recorded lectures</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"></div>
                      <span className="text-gray-300">Participate in group discussions</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"></div>
                      <span className="text-gray-300">Read aloud and use verbal repetition</span>
                    </div>
                  </>
                )}
                {learningStyle === "Kinesthetic" && (
                  <>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                      <span className="text-gray-300">Use hands-on experiments</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                      <span className="text-gray-300">Take frequent breaks and move around</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                      <span className="text-gray-300">Use physical models and manipulatives</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                onClick={() => (window.location.href = "/dashboard")}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-8 py-3 font-semibold shadow-lg shadow-cyan-500/25 transform hover:scale-105 transition-all duration-300"
              >
                <Star className="mr-2 h-5 w-5" />
                Go to Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                className="border-white/20 text-gray-300 hover:bg-white/10 px-8 py-3 bg-transparent"
                onClick={() => {
                  setCurrentQuestion(0)
                  setAnswers({})
                  setShowResults(false)
                  setLearningStyle("")
                }}
              >
                Retake Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <Card className="w-full max-w-3xl shadow-2xl border-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl relative z-10">
        <CardHeader>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Brain className="h-8 w-8 text-cyan-400" />
                <div className="absolute inset-0 bg-cyan-400 blur-lg opacity-30"></div>
              </div>
              <span className="font-bold text-xl text-white">Learning Style Quiz</span>
            </div>
            <Badge className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border-cyan-500/30">
              <Sparkles className="w-4 h-4 mr-2" />
              Question {currentQuestion + 1} of {learningStyleQuestions.length}
            </Badge>
          </div>
          <div className="relative">
            <Progress value={progress} className="h-3 bg-white/10" />
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full opacity-20"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-8">{learningStyleQuestions[currentQuestion].question}</h2>
            <RadioGroup value={answers[currentQuestion] || ""} onValueChange={handleAnswerChange} className="space-y-4">
              {learningStyleQuestions[currentQuestion].options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-4 border border-white/10 rounded-xl hover:bg-white/5 transition-all duration-300 cursor-pointer"
                >
                  <RadioGroupItem
                    value={option.value}
                    id={`option-${index}`}
                    className="border-white/30 text-cyan-400"
                  />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-gray-300 text-lg">
                    {option.text}
                  </Label>
                  <Badge variant="secondary" className="bg-white/10 text-gray-300 border-white/20">
                    {option.style}
                  </Badge>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="border-white/20 text-gray-300 hover:bg-white/10 disabled:opacity-50 bg-transparent"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={!answers[currentQuestion]}
              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white disabled:opacity-50 shadow-lg shadow-cyan-500/25"
            >
              {currentQuestion === learningStyleQuestions.length - 1 ? "Finish Quiz" : "Next"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
