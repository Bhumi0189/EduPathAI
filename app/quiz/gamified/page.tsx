"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Trophy,
  Star,
  Zap,
  Clock,
  Target,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Award,
  Flame,
} from "lucide-react"

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: "Easy" | "Medium" | "Hard"
  points: number
  category: string
}

const sampleQuestions: Question[] = [
  {
    id: 1,
    question: "What is the time complexity of binary search?",
    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    correctAnswer: 1,
    explanation:
      "Binary search divides the search space in half with each comparison, resulting in O(log n) time complexity.",
    difficulty: "Medium",
    points: 15,
    category: "Algorithms",
  },
  {
    id: 2,
    question: "Which of the following is NOT a JavaScript primitive type?",
    options: ["string", "number", "array", "boolean"],
    correctAnswer: 2,
    explanation:
      "Array is an object type in JavaScript, not a primitive type. Primitive types include string, number, boolean, undefined, null, symbol, and bigint.",
    difficulty: "Easy",
    points: 10,
    category: "JavaScript",
  },
  {
    id: 3,
    question: "What does CSS Grid's 'fr' unit represent?",
    options: ["Fixed ratio", "Fractional unit", "Frame rate", "Font ratio"],
    correctAnswer: 1,
    explanation:
      "The 'fr' unit represents a fractional unit that distributes available space proportionally among grid tracks.",
    difficulty: "Medium",
    points: 15,
    category: "CSS",
  },
  {
    id: 4,
    question: "In React, what is the purpose of useEffect hook?",
    options: ["State management", "Side effects", "Event handling", "Component rendering"],
    correctAnswer: 1,
    explanation:
      "useEffect is used to perform side effects in functional components, such as data fetching, subscriptions, or DOM manipulation.",
    difficulty: "Medium",
    points: 15,
    category: "React",
  },
  {
    id: 5,
    question: "What is the difference between '==' and '===' in JavaScript?",
    options: ["No difference", "=== checks type and value", "== is faster", "=== is deprecated"],
    correctAnswer: 1,
    explanation:
      "=== (strict equality) checks both type and value, while == (loose equality) performs type coercion before comparison.",
    difficulty: "Easy",
    points: 10,
    category: "JavaScript",
  },
]

export default function GamifiedQuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(sampleQuestions.length).fill(null))
  const [showResult, setShowResult] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [showExplanation, setShowExplanation] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [earnedBadges, setEarnedBadges] = useState<string[]>([])

  const currentQ = sampleQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / sampleQuestions.length) * 100

  useEffect(() => {
    if (timeLeft > 0 && !showResult && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !showResult) {
      handleTimeUp()
    }
  }, [timeLeft, showResult, quizCompleted])

  const handleTimeUp = () => {
    setShowResult(true)
    setShowExplanation(true)
    if (streak > 0) {
      setStreak(0)
    }
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (!showResult) {
      setSelectedAnswer(answerIndex)
    }
  }

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return

    const newAnswers = [...answers]
    newAnswers[currentQuestion] = selectedAnswer
    setAnswers(newAnswers)

    const isCorrect = selectedAnswer === currentQ.correctAnswer
    setShowResult(true)
    setShowExplanation(true)

    if (isCorrect) {
      const points = currentQ.points + (timeLeft > 20 ? 5 : timeLeft > 10 ? 3 : 1) // Time bonus
      setScore(score + points)
      setStreak(streak + 1)
      setMaxStreak(Math.max(maxStreak, streak + 1))
    } else {
      setStreak(0)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowResult(false)
      setShowExplanation(false)
      setTimeLeft(30)
    } else {
      completeQuiz()
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setSelectedAnswer(answers[currentQuestion - 1])
      setShowResult(false)
      setShowExplanation(false)
      setTimeLeft(30)
    }
  }

  const completeQuiz = () => {
    setQuizCompleted(true)

    // Calculate final results and badges
    const correctAnswers = answers.filter((answer, index) => answer === sampleQuestions[index].correctAnswer).length
    const accuracy = (correctAnswers / sampleQuestions.length) * 100

    const newBadges = []
    if (accuracy === 100) newBadges.push("Perfect Score")
    if (accuracy >= 80) newBadges.push("High Achiever")
    if (maxStreak >= 3) newBadges.push("Streak Master")
    if (timeLeft > 15) newBadges.push("Speed Demon")

    setEarnedBadges(newBadges)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-700"
      case "Medium":
        return "bg-yellow-100 text-yellow-700"
      case "Hard":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getStreakIcon = () => {
    if (streak >= 5) return <Flame className="h-5 w-5 text-orange-500" />
    if (streak >= 3) return <Zap className="h-5 w-5 text-yellow-500" />
    return <Target className="h-5 w-5 text-blue-500" />
  }

  if (quizCompleted) {
    const correctAnswers = answers.filter((answer, index) => answer === sampleQuestions[index].correctAnswer).length
    const accuracy = (correctAnswers / sampleQuestions.length) * 100

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Trophy className="h-10 w-10 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl">Quiz Complete!</CardTitle>
            <CardDescription>Congratulations on completing the challenge</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Score Summary */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{score}</div>
                <div className="text-sm text-gray-600">Total Points</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {correctAnswers}/{sampleQuestions.length}
                </div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{Math.round(accuracy)}%</div>
                <div className="text-sm text-gray-600">Accuracy</div>
              </div>
            </div>

            {/* Earned Badges */}
            {earnedBadges.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3 text-center">Badges Earned!</h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {earnedBadges.map((badge, index) => (
                    <Badge key={index} className="bg-yellow-100 text-yellow-700 px-3 py-1">
                      <Award className="h-3 w-3 mr-1" />
                      {badge}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Performance Stats */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Performance Stats</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span>Max Streak:</span>
                  <span className="font-medium">{maxStreak}</span>
                </div>
                <div className="flex justify-between">
                  <span>Categories:</span>
                  <span className="font-medium">{new Set(sampleQuestions.map((q) => q.category)).size}</span>
                </div>
                <div className="flex justify-between">
                  <span>Difficulty:</span>
                  <span className="font-medium">Mixed</span>
                </div>
                <div className="flex justify-between">
                  <span>Time Bonus:</span>
                  <span className="font-medium">+{Math.floor(score * 0.1)} pts</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => (window.location.href = "/dashboard")}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
              >
                Back to Dashboard
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()} className="flex-1">
                Take Another Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900">EduPath AI</span>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              Gamified Quiz
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Quiz Stats Header */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{score}</div>
                  <div className="text-sm text-gray-600">Points</div>
                </div>
                <Star className="h-6 w-6 text-blue-600" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <div className="text-2xl font-bold text-orange-600">{streak}</div>
                  <div className="text-sm text-gray-600">Streak</div>
                </div>
                {getStreakIcon()}
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <div className="text-2xl font-bold text-green-600">{timeLeft}</div>
                  <div className="text-sm text-gray-600">Seconds</div>
                </div>
                <Clock className="h-6 w-6 text-green-600" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {currentQuestion + 1}/{sampleQuestions.length}
                  </div>
                  <div className="text-sm text-gray-600">Progress</div>
                </div>
                <Trophy className="h-6 w-6 text-purple-600" />
              </CardContent>
            </Card>
          </div>

          {/* Main Quiz Card */}
          <Card className="shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Badge className={getDifficultyColor(currentQ.difficulty)}>{currentQ.difficulty}</Badge>
                  <Badge variant="outline">{currentQ.category}</Badge>
                  <Badge variant="secondary">{currentQ.points} pts</Badge>
                </div>
                <div className="text-sm text-gray-500">
                  Question {currentQuestion + 1} of {sampleQuestions.length}
                </div>
              </div>
              <Progress value={progress} className="h-2" />
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">{currentQ.question}</h2>
                <RadioGroup
                  value={selectedAnswer?.toString() || ""}
                  onValueChange={(value) => handleAnswerSelect(Number.parseInt(value))}
                >
                  {currentQ.options.map((option, index) => {
                    let optionClass =
                      "flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"

                    if (showResult) {
                      if (index === currentQ.correctAnswer) {
                        optionClass += " border-green-500 bg-green-50"
                      } else if (index === selectedAnswer && index !== currentQ.correctAnswer) {
                        optionClass += " border-red-500 bg-red-50"
                      }
                    }

                    return (
                      <div key={index} className={optionClass}>
                        <RadioGroupItem value={index.toString()} id={`option-${index}`} disabled={showResult} />
                        <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                          {option}
                        </Label>
                        {showResult && index === currentQ.correctAnswer && (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        )}
                        {showResult && index === selectedAnswer && index !== currentQ.correctAnswer && (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                    )
                  })}
                </RadioGroup>
              </div>

              {showExplanation && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <h3 className="font-semibold text-blue-900 mb-2">Explanation</h3>
                  <p className="text-blue-800">{currentQ.explanation}</p>
                </div>
              )}

              <div className="flex justify-between">
                <Button variant="outline" onClick={handlePreviousQuestion} disabled={currentQuestion === 0}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>

                {!showResult ? (
                  <Button
                    onClick={handleSubmitAnswer}
                    disabled={selectedAnswer === null}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    Submit Answer
                  </Button>
                ) : (
                  <Button onClick={handleNextQuestion} className="bg-indigo-600 hover:bg-indigo-700">
                    {currentQuestion === sampleQuestions.length - 1 ? "Finish Quiz" : "Next Question"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
