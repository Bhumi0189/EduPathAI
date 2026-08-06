// 7. app/assessment/page.tsx - VR Assessment System
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Clock, 
  Target, 
  CheckCircle, 
  XCircle, 
  Star,
  Headset,
  Brain
} from 'lucide-react';

export default function AssessmentPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [isInVRTest, setIsInVRTest] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  const vrAssessments = [
    {
      id: 1,
      title: 'Atomic Structure Mastery',
      duration: '15 mins',
      questions: 10,
      difficulty: 'Intermediate',
      subject: 'Chemistry',
      description: 'Manipulate 3D atomic models to demonstrate understanding'
    },
    {
      id: 2,
      title: 'Solar System Navigation',
      duration: '20 mins',
      questions: 12,
      difficulty: 'Beginner',
      subject: 'Astronomy',
      description: 'Navigate through the solar system and identify celestial bodies'
    },
    {
      id: 3,
      title: 'Molecular Biology Challenge',
      duration: '25 mins',
      questions: 15,
      difficulty: 'Advanced',
      subject: 'Biology',
      description: 'Explore cellular structures and biological processes'
    }
  ];

  const sampleQuestions = [
    {
      question: 'Identify the number of electron shells in this atom',
      type: 'interaction',
      model: 'atom'
    },
    {
      question: 'Arrange the planets in order of distance from the sun',
      type: 'drag-drop',
      model: 'solar-system'
    },
    {
      question: 'What type of chemical bond is shown in this water molecule?',
      type: 'multiple-choice',
      model: 'water-molecule',
      options: ['Ionic', 'Covalent', 'Metallic', 'Hydrogen']
    }
  ];

  const achievements = [
    { id: 1, title: '3D Explorer', description: 'Completed first VR assessment', icon: Headset, unlocked: true },
    { id: 2, title: 'Quick Learner', description: 'Finished assessment under time limit', icon: Clock, unlocked: true },
    { id: 3, title: 'Perfect Score', description: 'Achieved 100% on any assessment', icon: Trophy, unlocked: false },
    { id: 4, title: 'Science Master', description: 'Passed all science assessments', icon: Star, unlocked: false }
  ];

  const recentScores = [
    { subject: 'Chemistry', score: 85, date: '2025-01-15', badge: 'Good' },
    { subject: 'Physics', score: 92, date: '2025-01-12', badge: 'Excellent' },
    { subject: 'Biology', score: 78, date: '2025-01-10', badge: 'Good' }
  ];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Trophy className="w-10 h-10 text-yellow-400 mr-3" />
            <h1 className="text-4xl font-bold text-white">VR Assessment Center</h1>
          </div>
          <p className="text-lg text-gray-300">
            Test your knowledge through immersive virtual reality experiences
          </p>
        </div>

        {!isInVRTest ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Available Assessments */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Available VR Assessments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {vrAssessments.map((assessment) => (
                      <div key={assessment.id} className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-white font-semibold text-lg">{assessment.title}</h4>
                          <Badge 
                            variant="secondary" 
                            className={`${
                              assessment.difficulty === 'Beginner' ? 'bg-green-600' :
                              assessment.difficulty === 'Intermediate' ? 'bg-yellow-600' :
                              'bg-red-600'
                            } text-white`}
                          >
                            {assessment.difficulty}
                          </Badge>
                        </div>
                        <p className="text-gray-300 text-sm mb-3">{assessment.description}</p>
                        <div className="flex justify-between items-center text-sm text-gray-400 mb-3">
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {assessment.duration}
                          </span>
                          <span className="flex items-center">
                            <Target className="w-4 h-4 mr-1" />
                            {assessment.questions} questions
                          </span>
                          <Badge variant="outline" className="border-blue-500 text-blue-400">
                            {assessment.subject}
                          </Badge>
                        </div>
                        <Button 
                          onClick={() => setIsInVRTest(true)}
                          className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                          <Headset className="w-4 h-4 mr-2" />
                          Start VR Assessment
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Scores */}
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Recent Assessment Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentScores.map((result, index) => (
                      <div key={index} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                        <div>
                          <p className="text-white font-medium">{result.subject}</p>
                          <p className="text-sm text-gray-400">{result.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-white">{result.score}%</p>
                          <Badge className={`${
                            result.badge === 'Excellent' ? 'bg-green-600' : 'bg-yellow-600'
                          } text-white`}>
                            {result.badge}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Achievements */}
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Trophy className="mr-2" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {achievements.map((achievement) => {
                      const IconComponent = achievement.icon;
                      return (
                        <div 
                          key={achievement.id} 
                          className={`flex items-center space-x-3 p-2 rounded-lg ${
                            achievement.unlocked ? 'bg-yellow-600/20' : 'bg-white/5'
                          }`}
                        >
                          <IconComponent 
                            className={`w-8 h-8 ${
                              achievement.unlocked ? 'text-yellow-400' : 'text-gray-500'
                            }`} 
                          />
                          <div>
                            <p className={`font-medium ${
                              achievement.unlocked ? 'text-white' : 'text-gray-400'
                            }`}>
                              {achievement.title}
                            </p>
                            <p className="text-xs text-gray-500">{achievement.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Statistics */}
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Brain className="mr-2" />
                    Your Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">Overall Progress</span>
                      <span className="text-white">75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">VR Assessments Completed</span>
                      <span className="text-white">12</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">Average Score</span>
                      <span className="text-white">85%</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">Time Spent in VR</span>
                      <span className="text-white">4.5 hrs</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          /* VR Assessment Interface */
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 mb-6">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <Badge className="bg-green-600 text-white animate-pulse">VR Active</Badge>
                    <span className="text-white">Question {currentQuestion + 1} of {sampleQuestions.length}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-white">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatTime(timeLeft)}
                    </div>
                    <div className="text-white">Score: {score}</div>
                  </div>
                </div>
                <Progress value={(currentQuestion / sampleQuestions.length) * 100} className="mt-3" />
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardContent className="p-6">
                {/* VR Assessment Environment */}
                <div className="bg-black rounded-lg h-96 flex items-center justify-center mb-6">
                  <div className="text-center">
                    <Headset className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                    <p className="text-white text-xl mb-2">VR Assessment in Progress</p>
                    <p className="text-gray-400">
                      {sampleQuestions[currentQuestion]?.question}
                    </p>
                  </div>
                </div>

                {/* Assessment Controls */}
                <div className="flex justify-center space-x-4">
                  <Button 
                    onClick={() => {
                      setScore(score + 10);
                      setCurrentQuestion(currentQuestion + 1);
                    }}
                    className="bg-green-600 hover:bg-green-700"
                    disabled={currentQuestion >= sampleQuestions.length}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Submit Answer
                  </Button>
                  <Button 
                    onClick={() => setCurrentQuestion(currentQuestion + 1)}
                    className="bg-yellow-600 hover:bg-yellow-700"
                    disabled={currentQuestion >= sampleQuestions.length}
                  >
                    Skip Question
                  </Button>
                  <Button 
                    onClick={() => setIsInVRTest(false)}
                    variant="destructive"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Exit Assessment
                  </Button>
                </div>

                {currentQuestion >= sampleQuestions.length && (
                  <div className="text-center mt-6 p-4 bg-green-600/20 rounded-lg">
                    <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                    <h3 className="text-white text-xl font-bold mb-2">Assessment Complete!</h3>
                    <p className="text-gray-300 mb-4">Final Score: {score}%</p>
                    <Button onClick={() => setIsInVRTest(false)} className="bg-blue-600 hover:bg-blue-700">
                      View Results
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
