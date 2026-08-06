'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Share2, 
  MessageSquare,
  Headset,
  UserPlus
} from 'lucide-react';

export default function CollaborativePage() {
  const [isInSession, setIsInSession] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [sessionCode, setSessionCode] = useState('');
  const [participants, setParticipants] = useState([
    { id: 1, name: 'Alex Chen', avatar: '/placeholder-user.jpg', status: 'in-vr' },
    { id: 2, name: 'Sarah Johnson', avatar: '/placeholder-user.jpg', status: 'online' },
    { id: 3, name: 'Mike Rodriguez', avatar: '/placeholder-user.jpg', status: 'in-vr' }
  ]);

  const activeSessions = [
    {
      id: 1,
      title: 'Advanced Chemistry: Molecular Bonds',
      participants: 5,
      duration: '45 mins',
      subject: 'Chemistry',
      instructor: 'Dr. Smith'
    },
    {
      id: 2,
      title: 'Physics: Quantum Mechanics Visualization',
      participants: 8,
      duration: '60 mins',
      subject: 'Physics',
      instructor: 'Prof. Johnson'
    },
    {
      id: 3,
      title: 'Biology: Cell Structure Exploration',
      participants: 12,
      duration: '30 mins',
      subject: 'Biology',
      instructor: 'Dr. Williams'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Users className="w-10 h-10 text-purple-400 mr-3" />
            <h1 className="text-4xl font-bold text-white">Collaborative VR Learning</h1>
          </div>
          <p className="text-lg text-gray-300">
            Learn together in shared virtual environments
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Join/Create Session */}
          <div className="lg:col-span-2 space-y-6">
            {!isInSession ? (
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <UserPlus className="mr-2" />
                    Join or Create Session
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter session code"
                      value={sessionCode}
                      onChange={(e) => setSessionCode(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                    />
                    <Button 
                      onClick={() => setIsInSession(true)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Join
                    </Button>
                  </div>
                  <div className="text-center">
                    <span className="text-gray-400">or</span>
                  </div>
                  <Button 
                    onClick={() => setIsInSession(true)}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Create New Session
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <span className="flex items-center">
                      <Headset className="mr-2" />
                      VR Session Active
                    </span>
                    <Badge className="bg-green-500 text-white">Live</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* VR Environment would be rendered here */}
                  <div className="bg-black rounded-lg h-96 flex items-center justify-center mb-4">
                    <div className="text-center">
                      <Headset className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                      <p className="text-white text-lg">VR Environment Active</p>
                      <p className="text-gray-400">Shared learning space loaded</p>
                    </div>
                  </div>
                  
                  {/* Session Controls */}
                  <div className="flex justify-center space-x-4">
                    <Button
                      onClick={() => setIsMicOn(!isMicOn)}
                      className={`${isMicOn ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'}`}
                    >
                      {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                    </Button>
                    <Button
                      onClick={() => setIsVideoOn(!isVideoOn)}
                      className={`${isVideoOn ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'}`}
                    >
                      {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                    </Button>
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button className="bg-orange-600 hover:bg-orange-700">
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                    <Button 
                      onClick={() => setIsInSession(false)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Leave Session
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Active Sessions */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Active VR Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeSessions.map((session) => (
                    <div key={session.id} className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-white font-semibold">{session.title}</h4>
                        <Badge variant="secondary" className="bg-blue-600 text-white">
                          {session.subject}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-300 space-y-1">
                        <p>Instructor: {session.instructor}</p>
                        <div className="flex justify-between">
                          <span>{session.participants} participants</span>
                          <span>{session.duration}</span>
                        </div>
                      </div>
                      <Button 
                        className="mt-3 w-full bg-blue-600 hover:bg-blue-700" 
                        size="sm"
                        onClick={() => setIsInSession(true)}
                      >
                        Join Session
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Participants Panel */}
          <div className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Users className="mr-2" />
                  Participants ({participants.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {participants.map((participant) => (
                    <div key={participant.id} className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={participant.avatar} />
                        <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-white font-medium">{participant.name}</p>
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            participant.status === 'in-vr' ? 'bg-green-500' : 'bg-blue-500'
                          }`} />
                          <span className="text-sm text-gray-400">
                            {participant.status === 'in-vr' ? 'In VR' : 'Online'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Chat Panel */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <MessageSquare className="mr-2" />
                  Session Chat
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4 h-48 overflow-y-auto">
                  <div className="text-sm">
                    <span className="text-blue-400 font-medium">Alex:</span>
                    <span className="text-gray-300 ml-2">This molecular structure is amazing!</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-green-400 font-medium">Sarah:</span>
                    <span className="text-gray-300 ml-2">Can we rotate this model?</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-purple-400 font-medium">Mike:</span>
                    <span className="text-gray-300 ml-2">Yes! Try using hand gestures</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Type your message..."
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  />
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Send
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
