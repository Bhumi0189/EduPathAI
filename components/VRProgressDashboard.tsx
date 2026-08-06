'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Clock, 
  Target, 
  Award,
  BarChart3,
  Calendar,
  Brain
} from 'lucide-react';
import { VRAnalytics, VRLearningMetrics } from '@/lib/vr-analytics';

const VRProgressDashboard = () => {
  const [metrics, setMetrics] = useState<VRLearningMetrics | null>(null);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    const analytics = VRAnalytics.getInstance();
    const userMetrics = analytics.getSessionMetrics('current-user'); // Replace with actual user ID
    setMetrics(userMetrics);
  }, []);

  const progressData = [
    { date: '2025-01-01', accuracy: 65, time: 45 },
    { date: '2025-01-05', accuracy: 72, time: 60 },
    { date: '2025-01-10', accuracy: 78, time: 75 },
    { date: '2025-01-15', accuracy: 85, time: 90 },
    { date: '2025-01-20', accuracy: 88, time: 105 }
  ];

  const subjectProgress = [
    { subject: 'Chemistry', progress: 85, sessions: 12, avgAccuracy: 88 },
    { subject: 'Physics', progress: 72, sessions: 8, avgAccuracy: 82 },
    { subject: 'Biology', progress: 94, sessions: 15, avgAccuracy: 91 },
    { subject: 'Mathematics', progress: 66, sessions: 6, avgAccuracy: 78 }
  ];

  if (!metrics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Loading VR Progress Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <BarChart3 className="w-10 h-10 text-blue-400 mr-3" />
            <h1 className="text-4xl font-bold text-white">VR Learning Progress</h1>
          </div>
          <p className="text-lg text-gray-300">
            Track your immersive learning journey and achievements
          </p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total VR Time</p>
                  <p className="text-2xl font-bold text-white">
                    {Math.round(metrics.totalVRTime / 60)}h {metrics.totalVRTime % 60}m
                  </p>
                </div>
                <Clock className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Sessions Completed</p>
                  <p className="text-2xl font-bold text-white">{metrics.sessionsCompleted}</p>
                </div>
                <Target className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Average Accuracy</p>
                  <p className="text-2xl font-bold text-white">{Math.round(metrics.averageAccuracy)}%</p>
                </div>
                <Brain className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Improvement Rate</p>
                  <p className={`text-2xl font-bold ${metrics.improvementRate >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {metrics.improvementRate >= 0 ? '+' : ''}{Math.round(metrics.improvementRate)}%
                  </p>
                </div>
                <TrendingUp className={`w-8 h-8 ${metrics.improvementRate >= 0 ? 'text-green-400' : 'text-red-400'}`} />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Learning Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {progressData.slice(-5).map((data, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">{data.date}</span>
                          <span className="text-white">{data.accuracy}%</span>
                        </div>
                        <Progress value={data.accuracy} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Preferred Subjects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {metrics.preferredSubjects.map((subject, index) => (
                      <div key={subject} className="flex items-center justify-between">
                        <span className="text-white font-medium">{subject}</span>
                        <Badge className={`${
                          index === 0 ? 'bg-gold-500' :
                          index === 1 ? 'bg-silver-400' :
                          'bg-bronze-400'
                        } text-white`}>
                          #{index + 1}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="subjects" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {subjectProgress.map((subject) => (
                <Card key={subject.subject} className="bg-white/10 backdrop-blur-lg border-white/20">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-white font-semibold text-lg">{subject.subject}</h3>
                      <Badge variant="secondary" className="bg-blue-600 text-white">
                        {subject.sessions} sessions
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-300">Overall Progress</span>
                          <span className="text-white">{subject.progress}%</span>
                        </div>
                        <Progress value={subject.progress} className="h-2" />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Average Accuracy</span>
                        <span className="text-white font-medium">{subject.avgAccuracy}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Achievement cards would go here */}
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardContent className="p-6 text-center">
                  <Award className="w-12 h-12 text-gold-400 mx-auto mb-4" />
                  <h3 className="text-white font-semibold mb-2">VR Pioneer</h3>
                  <p className="text-gray-400 text-sm">Complete your first VR lesson</p>
                  <Badge className="mt-3 bg-green-600 text-white">Unlocked</Badge>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Calendar className="mr-2" />
                  Time-based Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-center space-x-2 mb-4">
                    {(['week', 'month', 'year'] as const).map((period) => (
                      <button
                        key={period}
                        onClick={() => setTimeframe(period)}
                        className={`px-4 py-2 rounded-lg capitalize ${
                          timeframe === period
                            ? 'bg-blue-600 text-white'
                            : 'bg-white/10 text-gray-300 hover:bg-white/20'
                        }`}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                  {/* Chart would go here - you can integrate Chart.js or similar */}
                  <div className="bg-black/20 rounded-lg h-64 flex items-center justify-center">
                    <p className="text-gray-400">Analytics Chart Placeholder</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default VRProgressDashboard;
