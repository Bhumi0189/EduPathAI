"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '@/hooks/useUser';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { Camera, RotateCcw, RotateCw, ArrowUp, ArrowDown, X, Play, CheckCircle, Brain, Trophy, Target, Home } from 'lucide-react';
import { SmokeBackground } from '../components/smoke-background';
import { CursorGlow } from '../components/cursor-glow';

// SmokeBackground is imported from `app/components/smoke-background`

type ModuleKey = 'plant' | 'solar' | 'body' | 'coding';
type ModuleInfo = { id: ModuleKey; icon: string; title: string; description: string };

// CursorGlow is imported from `app/components/cursor-glow`

// 3D Coding Model Component
const CodingModel = () => (
  <div className="relative w-full h-full flex items-center justify-center">
    {/* Label: IDE/CODE EDITOR */}
    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-slate-900/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-blue-500/50 shadow-xl z-10">
      <div className="text-blue-400 font-bold text-sm">CODE EDITOR</div>
      <div className="text-xs text-slate-300">Where code is written</div>
    </div>
    
    {/* Main laptop/computer */}
    <div className="absolute bottom-0 w-40 h-28 bg-gradient-to-b from-gray-700 to-black rounded-lg shadow-2xl transform perspective-1000" 
         style={{ transform: 'rotateX(5deg)' }}>
      {/* Screen */}
      <div className="absolute top-2 left-2 right-2 bottom-6 bg-gradient-to-br from-gray-900 via-slate-900 to-black rounded shadow-inner overflow-hidden">
        {/* Window title bar */}
        <div className="absolute top-1 left-1 right-1 h-3 bg-gray-800 rounded-t flex items-center gap-1 px-1 border-b border-gray-700">
          <div className="w-1.5 h-1.5 bg-red-500 rounded-full shadow-sm shadow-red-500/50" />
          <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full shadow-sm shadow-yellow-500/50" />
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-sm shadow-green-500/50" />
          <div className="ml-2 text-xs text-gray-400 font-mono">main.js</div>
        </div>
        
        {/* Code lines with syntax highlighting */}
        <div className="absolute top-5 left-1 right-1 bottom-1 space-y-1 overflow-hidden font-mono text-xs">
          {/* Import statement */}
          <div className="flex items-center gap-1">
            <span className="text-purple-400">import</span>
            <span className="text-blue-300">React</span>
            <span className="text-purple-400">from</span>
            <span className="text-green-400">'react'</span>
          </div>
          
          {/* Function declaration */}
          <div className="flex items-center gap-1 ml-0">
            <span className="text-blue-400">function</span>
            <span className="text-yellow-300">App</span>
            <span className="text-gray-400">()</span>
            <span className="text-gray-400">{'{'}</span>
          </div>
          
          {/* Variable declaration */}
          <div className="flex items-center gap-1 ml-2">
            <span className="text-purple-400">const</span>
            <span className="text-blue-300">data</span>
            <span className="text-gray-400">=</span>
            <span className="text-orange-400">42</span>
          </div>
          
          {/* Return statement */}
          <div className="flex items-center gap-1 ml-2">
            <span className="text-purple-400">return</span>
            <span className="text-cyan-300">{'<div>'}</span>
          </div>
          
          {/* JSX content */}
          <div className="flex items-center gap-1 ml-4">
            <span className="text-green-400">Hello World</span>
          </div>
          
          {/* Closing tags */}
          <div className="flex items-center gap-1 ml-2">
            <span className="text-cyan-300">{'</div>'}</span>
          </div>
          
          <div className="flex items-center gap-1 ml-0">
            <span className="text-gray-400">{'}'}</span>
          </div>
        </div>
        
        {/* Cursor blink */}
        <div className="absolute bottom-3 left-2 w-1 h-3 bg-white animate-pulse" 
             style={{ animationDuration: '1s' }} />
      </div>
      
      {/* Keyboard base */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-3 bg-gray-700 rounded-b" />
    </div>
    
    {/* Label: SYNTAX */}
    <div className="absolute -top-12 -left-32 bg-slate-900/90 backdrop-blur-sm px-2 py-1 rounded-lg border border-blue-400/50 shadow-xl text-xs">
      <div className="text-blue-300 font-bold">SYNTAX</div>
      <div className="text-gray-400 text-xs">Code structure</div>
      <div className="absolute top-1/2 -right-2 w-16 h-0.5 bg-blue-400/50" />
    </div>
    
    {/* Floating code blocks with labels */}
    <div className="absolute -top-8 -left-20 w-14 h-10 bg-gradient-to-r from-blue-600 to-blue-800 rounded shadow-lg transform rotate-12 animate-bounce"
         style={{ animationDelay: '0s', animationDuration: '3s' }}>
      <div className="absolute inset-1 bg-blue-900/50 rounded text-xs text-white flex items-center justify-center font-mono">
        <div className="text-center">
          <div className="text-yellow-300">{'{ }'}</div>
          <div className="text-xs text-gray-300 mt-0.5">Objects</div>
        </div>
      </div>
    </div>
    
    <div className="absolute -top-6 -right-16 w-12 h-8 bg-gradient-to-r from-green-600 to-green-800 rounded shadow-lg transform -rotate-12 animate-bounce"
         style={{ animationDelay: '1s', animationDuration: '3s' }}>
      <div className="absolute inset-1 bg-green-900/50 rounded text-xs text-white flex items-center justify-center font-mono">
        <div className="text-center">
          <div className="text-yellow-300">{'( )'}</div>
          <div className="text-xs text-gray-300 mt-0.5">Functions</div>
        </div>
      </div>
    </div>
    
    <div className="absolute -bottom-6 -left-12 w-10 h-8 bg-gradient-to-r from-purple-600 to-purple-800 rounded shadow-lg transform rotate-45 animate-bounce"
         style={{ animationDelay: '2s', animationDuration: '3s' }}>
      <div className="absolute inset-1 bg-purple-900/50 rounded text-xs text-white flex items-center justify-center font-mono">
        <div className="text-center">
          <div className="text-yellow-300">{'<>'}</div>
          <div className="text-xs text-gray-300 mt-0.5">Tags</div>
        </div>
      </div>
    </div>
  </div>
);

// Quiz Component
// Adding type annotations for QuizComponent props
interface QuizComponentProps {
  module: string;
  onComplete: (score?: number) => void;
}
const QuizComponent = ({ module, onComplete }: QuizComponentProps) => {
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const quizzes = {
    plant: [
      {
        question: "What process do plants use to make their own food?",
        options: ["Respiration", "Photosynthesis", "Digestion", "Absorption"],
        correct: 1,
        explanation: "Photosynthesis is the process where plants use sunlight, water, and carbon dioxide to create glucose and oxygen."
      },
      {
        question: "Which part of the plant absorbs water and nutrients from the soil?",
        options: ["Leaves", "Stem", "Roots", "Flowers"],
        correct: 2,
        explanation: "Roots anchor the plant and absorb water and essential nutrients from the soil."
      },
      {
        question: "What do flowers primarily help plants accomplish?",
        options: ["Make food", "Store water", "Reproduce", "Support the plant"],
        correct: 2,
        explanation: "Flowers are reproductive organs that attract pollinators and help plants create seeds for reproduction."
      }
    ],
    solar: [
      {
        question: "What is the closest star to Earth?",
        options: ["Alpha Centauri", "Sirius", "The Sun", "Proxima Centauri"],
        correct: 2,
        explanation: "The Sun is our closest star and provides all the energy for our solar system."
      },
      {
        question: "Why is Mars called the 'Red Planet'?",
        options: ["It's very hot", "Iron oxide on its surface", "Red atmosphere", "Red rocks"],
        correct: 1,
        explanation: "Mars appears red due to iron oxide (rust) on its surface, giving it the distinctive reddish color."
      },
      {
        question: "What effect does the Moon have on Earth?",
        options: ["Controls weather", "Creates tides", "Makes seasons", "Provides heat"],
        correct: 1,
        explanation: "The Moon's gravitational pull creates ocean tides and helps stabilize Earth's rotation."
      }
    ],
    body: [
      {
        question: "How many times does your heart beat per day approximately?",
        options: ["50,000 times", "75,000 times", "100,000 times", "125,000 times"],
        correct: 2,
        explanation: "Your heart beats about 100,000 times per day, pumping roughly 2,000 gallons of blood!"
      },
      {
        question: "What percentage of your body's energy does your brain use?",
        options: ["10%", "15%", "20%", "25%"],
        correct: 2,
        explanation: "Despite being only 2% of your body weight, your brain uses about 20% of your body's total energy."
      },
      {
        question: "How many breaths do you take per day approximately?",
        options: ["15,000", "20,000", "25,000", "30,000"],
        correct: 1,
        explanation: "You take approximately 20,000 breaths per day to supply oxygen to all your body's cells."
      }
    ],
    coding: [
      {
        question: "What does HTML stand for?",
        options: ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyper Transfer Markup Language"],
        correct: 0,
        explanation: "HTML stands for Hyper Text Markup Language, the standard markup language for creating web pages."
      },
      {
        question: "Which programming language is known as the 'language of the web'?",
        options: ["Python", "Java", "JavaScript", "C++"],
        correct: 2,
        explanation: "JavaScript is called the 'language of the web' as it runs in web browsers and makes websites interactive."
      },
      {
        question: "What is the first step in solving a coding problem?",
        options: ["Writing code", "Testing", "Understanding the problem", "Debugging"],
        correct: 2,
        explanation: "Understanding the problem thoroughly is the crucial first step before writing any code."
      }
    ]
  };

  // Correcting type for currentQuizData
  const currentQuizData = quizzes[module as keyof typeof quizzes] || [];

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);

    if (answerIndex === currentQuizData[currentQuiz].correct) {
      setScore((s) => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuiz < currentQuizData.length - 1) {
      setCurrentQuiz(currentQuiz + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuiz(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setQuizCompleted(false);
  };

  if (quizCompleted) {
    const percentage = Math.round((score / currentQuizData.length) * 100);
    return (
      <div className="bg-slate-800/95 backdrop-blur-md rounded-2xl p-6 text-white">
        <div className="text-center">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-4">Quiz Completed! 🎉</h3>
          <div className="text-4xl font-bold text-blue-400 mb-2">{percentage}%</div>
          <p className="text-lg mb-4">You scored {score} out of {currentQuizData.length}</p>
          
          <div className="mb-6">
            {percentage >= 80 ? (
              <p className="text-green-400 font-semibold">Excellent work! You're a master! 🌟</p>
            ) : percentage >= 60 ? (
              <p className="text-yellow-400 font-semibold">Good job! Keep learning! 👍</p>
            ) : (
              <p className="text-orange-400 font-semibold">Nice try! Review and try again! 💪</p>
            )}
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={restartQuiz}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => onComplete(percentage)}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
            >
              Complete Module
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuizData.length) return null;

  return (
    <div className="bg-slate-800/95 backdrop-blur-md rounded-2xl p-6 text-white">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Brain className="w-6 h-6 text-blue-400" />
            Knowledge Check
          </h3>
          <div className="text-sm text-gray-300">
            {currentQuiz + 1} / {currentQuizData.length}
          </div>
        </div>
        
        <div className="w-full bg-slate-700 rounded-full h-2 mb-6">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentQuiz + 1) / currentQuizData.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-4">{currentQuizData[currentQuiz].question}</h4>
        
        <div className="space-y-3">
          {/* Adding type annotations for map callback parameters */}
          {currentQuizData[currentQuiz].options.map((option: string, index: number) => (
            <button
              key={index}
              onClick={() => !showResult && handleAnswer(index)}
              disabled={showResult}
              className={`w-full p-3 text-left rounded-lg transition-all duration-200 ${
                showResult
                  ? index === currentQuizData[currentQuiz].correct
                    ? 'bg-green-600 text-white'
                    : index === selectedAnswer && selectedAnswer !== currentQuizData[currentQuiz].correct
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-700 text-gray-300'
                  : 'bg-slate-700 hover:bg-slate-600 text-white'
              }`}
            >
              <span className="font-semibold mr-2">{String.fromCharCode(65 + index)}.</span>
              {option}
            </button>
          ))}
        </div>
      </div>

      {showResult && (
        <div className="mb-6 p-4 bg-slate-700/50 rounded-lg">
          <div className={`flex items-center gap-2 mb-2 ${
            selectedAnswer === currentQuizData[currentQuiz].correct ? 'text-green-400' : 'text-red-400'
          }`}>
            <Target className="w-5 h-5" />
            <span className="font-semibold">
              {selectedAnswer === currentQuizData[currentQuiz].correct ? 'Correct!' : 'Incorrect!'}
            </span>
          </div>
          <p className="text-gray-300 text-sm">{currentQuizData[currentQuiz].explanation}</p>
        </div>
      )}

      {showResult && (
        <button
          onClick={nextQuestion}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-semibold transition-all duration-200"
        >
          {currentQuiz < currentQuizData.length - 1 ? 'Next Question' : 'View Results'}
        </button>
      )}
    </div>
  );
};

// Enhanced 3D Models
function PlantModel() {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Styled container for Sketchfab iframe */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-green-900 via-teal-800 to-blue-900 rounded-lg shadow-2xl overflow-hidden">
        {/* Skeleton / loader while iframe loads */}
        <div className={`absolute inset-0 bg-slate-800/80 flex flex-col items-center justify-center gap-3 transition-opacity duration-500 ${loaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="w-14 h-14 border-4 border-t-transparent border-blue-400 rounded-full animate-spin" />
          <div className="text-xs text-slate-300">Loading model...</div>
        </div>

        <iframe 
          title="Photosynthesis and plant anatomy" 
          frameBorder="0" 
          loading="lazy"
          onLoad={() => setLoaded(true)}
          allowFullScreen 
          allow="autoplay; fullscreen; xr-spatial-tracking" 
          src="https://sketchfab.com/models/5c426b7880e440ce834012d06763d502/embed" 
          className={`w-full h-full rounded-lg shadow-lg transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        ></iframe>
      </div>

      {/* Floating label for model description */}
  <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-slate-900/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-blue-500/50 shadow-xl">
          <div className="text-blue-400 font-semibold text-sm">Plant Anatomy</div>
          <div className="text-xs text-slate-300">Explore the fascinating world of plants</div>
        </div>
    </div>
  );
}

function SolarSystemModel() {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Sketchfab iframe for Solar System animation */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-black via-gray-800 to-blue-900 rounded-lg shadow-2xl overflow-hidden">
        <div className={`absolute inset-0 bg-slate-900/80 flex flex-col items-center justify-center gap-3 transition-opacity duration-500 ${loaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="w-14 h-14 border-4 border-t-transparent border-indigo-400 rounded-full animate-spin" />
          <div className="text-xs text-slate-300">Loading model...</div>
        </div>

        <iframe 
          title="Solar System Animation" 
          frameBorder="0" 
          loading="lazy"
          onLoad={() => setLoaded(true)}
          allowFullScreen 
          allow="autoplay; fullscreen; xr-spatial-tracking" 
          src="https://sketchfab.com/models/b7c69a6b655b47c99f871d5ec5aee854/embed" 
          className={`w-full h-full rounded-lg shadow-lg transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        ></iframe>
      </div>

      {/* Floating label for model description */}
  <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-slate-900/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-blue-500/50 shadow-xl">
        <div className="text-blue-400 font-semibold text-sm">Solar System</div>
        <div className="text-xs text-slate-300">Explore the wonders of our cosmic neighborhood</div>
      </div>
    </div>
  );
}

function BodyModel() {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Sketchfab iframe for Human Body animation */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-pink-900 via-red-800 to-purple-900 rounded-lg shadow-2xl overflow-hidden">
        <div className={`absolute inset-0 bg-slate-900/85 flex flex-col items-center justify-center gap-3 transition-opacity duration-500 ${loaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="w-14 h-14 border-4 border-t-transparent border-pink-400 rounded-full animate-spin" />
          <div className="text-xs text-slate-300">Loading model...</div>
        </div>

        <iframe 
          title="Animated Human Body with circulatory system" 
          frameBorder="0" 
          loading="lazy"
          onLoad={() => setLoaded(true)}
          allowFullScreen 
          allow="autoplay; fullscreen; xr-spatial-tracking" 
          src="https://sketchfab.com/models/6a7a537a71444f6e8201e18a685a013d/embed" 
          className={`w-full h-full rounded-lg shadow-lg transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        ></iframe>
      </div>

      {/* Floating label for model description */}
  <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-slate-900/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-red-500/50 shadow-xl">
        <div className="text-red-400 font-semibold text-sm">Human Body</div>
        <div className="text-xs text-slate-300">Explore the circulatory system and human anatomy</div>
      </div>
    </div>
  );
}

function ProgrammingModel() {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Sketchfab iframe for Programming Animation */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 rounded-lg shadow-2xl overflow-hidden">
        <div className={`absolute inset-0 bg-slate-900/80 flex flex-col items-center justify-center gap-3 transition-opacity duration-500 ${loaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="w-14 h-14 border-4 border-t-transparent border-blue-300 rounded-full animate-spin" />
          <div className="text-xs text-slate-300">Loading model...</div>
        </div>

        <iframe 
          title="Programming Animation" 
          frameBorder="0" 
          loading="lazy"
          onLoad={() => setLoaded(true)}
          allowFullScreen 
          allow="autoplay; fullscreen; xr-spatial-tracking" 
          src="https://sketchfab.com/models/3d3a7b9c59454e8fa62fd7d62051f59d/embed" 
          className={`w-full h-full rounded-lg shadow-lg transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        ></iframe>
      </div>

      {/* Floating label for model description */}
  <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-slate-900/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-blue-500/50 shadow-xl">
        <div className="text-blue-400 font-semibold text-sm">Programming Concepts</div>
        <div className="text-xs text-slate-300">Explore the fundamentals of programming in 3D</div>
      </div>
    </div>
  );
}

// AR Scene Component with rotation controls
// Adding type annotations for ARScene props
interface ARSceneProps {
  module: string;
  onClose: () => void;
  onComplete: (score?: number) => void;
}
const ARScene = ({ module, onClose, onComplete }: ARSceneProps) => {
  const [showQuiz, setShowQuiz] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [showHeader, setShowHeader] = useState(true);

  const moduleContent = {
    plant: {
      title: "🌱 Plant Anatomy Explorer",
        description: "Explore plants and photosynthesis.",
        instructions: "Rotate the plant to view its parts.",
      facts: [
        "Roots absorb water and nutrients from the soil and anchor the plant securely",
        "Stems transport water and nutrients throughout the plant's structure",
        "Leaves perform photosynthesis to create food using sunlight, water, and CO2",
        "Flowers attract pollinators and produce seeds for plant reproduction"
      ]
    },
    solar: {
      title: "🌌 Solar System Journey",
      description: "Journey through space and discover our amazing solar system!",
      instructions: "Watch the planets orbit and learn about our cosmic neighborhood.",
      facts: [
        "The Sun is a massive star providing energy for our entire solar system",
        "Earth is the perfect distance from the Sun to support liquid water and life",
        "Mars is known as the Red Planet due to iron oxide (rust) on its surface",
        "The Moon affects Earth's tides and stabilizes our planet's axial rotation"
      ]
    },
    body: {
      title: "🫀 Human Body Discovery",
      description: "Discover the amazing human body and how all systems work together!",
      instructions: "Explore the human body systems and learn about their vital functions.",
      facts: [
        "Your heart pumps approximately 2,000 gallons of blood daily through your circulatory system",
        "You take about 20,000 breaths per day to supply oxygen to trillions of cells",
        "The brain uses 20% of your body's energy despite being only 2% of total body weight",
        "Your body contains trillions of cells working together in perfect harmony"
      ]
    },
    coding: {
      title: "💻 3D Programming World",
      description: "Dive into the exciting world of programming and computational thinking!",
      instructions: "Explore programming concepts and see how code comes to life in 3D.",
      facts: [
        "Programming is like giving step-by-step instructions to a computer",
        "HTML structures web pages, CSS styles them, and JavaScript makes them interactive",
        "Problem-solving is the most important skill in programming",
        "Code is everywhere - from smartphones to space rockets!"
      ]
    }
  };

  const currentContent = moduleContent[module as keyof typeof moduleContent];

  const rotateModel = (direction: 'left' | 'right' | 'up' | 'down') => {
    const step = 30;
    setRotation(prev => {
      switch (direction) {
        case 'left':
          return { ...prev, y: prev.y - step };
        case 'right':
          return { ...prev, y: prev.y + step };
        case 'up':
          return { ...prev, x: prev.x - step };
        case 'down':
          return { ...prev, x: prev.x + step };
        default:
          return prev;
      }
    });
  };

  const Model3D = () => {
    const models = {
      plant: PlantModel,
      solar: SolarSystemModel,
      body: BodyModel,
      coding: CodingModel,
      programming: ProgrammingModel
    } as const;
    const ModelComponent = models[module as keyof typeof models];
    return <ModelComponent />;
  };

  // Portal the header to document.body to avoid clipping and stacking context issues
  const [mounted, setMounted] = useState(false);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // measure header height and update on resize or when header content toggles
  useEffect(() => {
    function updateHeight() {
      const h = headerRef.current ? headerRef.current.getBoundingClientRect().height : 0;
      // Tailwind `top-6` ~= 1.5rem -> 24px offset from top; add small buffer
      const topOffset = 24;
      const buffer = 12;
      const total = h ? Math.ceil(h + topOffset + buffer) : topOffset + buffer;
      setHeaderHeight(total);
    }
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [showHeader, mounted]);

  const headerJSX = (
    <div className="fixed inset-x-0 top-6 z-50 flex justify-center pointer-events-none">
      <div ref={headerRef} className={`w-full max-w-6xl px-6 pointer-events-auto rounded-3xl p-4 md:p-6 shadow-2xl border border-transparent backdrop-blur-md ring-1 ring-white/5 bg-gradient-to-r from-slate-800/80 to-slate-900/70 relative z-50 overflow-visible transition-all duration-300 ${showHeader ? 'bg-slate-800/95' : 'bg-slate-900/66'}`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 pr-4">
            <h3 className="text-xl md:text-2xl font-extrabold text-blue-200 mb-2 flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-blue-700/20 text-blue-300 shadow-sm">{currentContent.title.split(' ')[0]}</span>
              <span className="truncate">{currentContent.title}</span>
            </h3>
            {showHeader && (
              <>
                <p className="text-slate-300 text-sm mb-2">{currentContent.description}</p>
                <p className="text-xs text-slate-400">{currentContent.instructions}</p>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHeader((s) => !s)}
              aria-pressed={!showHeader}
              className="p-2 mr-2 bg-slate-700 hover:bg-slate-600 text-white rounded-full transition-colors shadow-sm"
              title={showHeader ? 'Hide header' : 'Show header'}
            >
              {showHeader ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
            </button>
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Close AR scene"
          className="absolute right-6 top-1/2 transform -translate-y-1/2 z-60 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-2xl ring-1 ring-white/15"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-sm z-40 flex flex-col" style={{ paddingTop: headerHeight, transition: 'padding-top 200ms ease' }}>
      {/* Header Section (rendered via portal to document.body) */}
      {mounted && createPortal(headerJSX, document.body)}

      {/* Main area: viewer + sidebar */}
      <div className="flex-1 flex overflow-hidden px-6 md:px-12 pb-8">
        {/* Viewer */}
        <div className="flex-1 relative overflow-hidden flex items-center justify-center">
          <div 
            className="relative w-full max-w-[780px] h-[520px] md:h-[640px] transition-transform duration-500 rounded-lg overflow-hidden"
            style={{ 
              transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
              transformStyle: 'preserve-3d'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/40 to-slate-900/10 backdrop-blur-sm rounded-lg shadow-inner" />
            <Model3D />
          </div>

          {/* Rotation Controls */}
          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-slate-800/90 backdrop-blur-md rounded-3xl p-4 shadow-2xl border border-blue-500/20">
            <div className="flex gap-3 items-center">
              <button onClick={() => rotateModel('left')} className="w-12 h-12 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition transform hover:-translate-y-0.5 shadow-lg" aria-label="Rotate left"><RotateCcw size={18} /></button>
              <button onClick={() => rotateModel('right')} className="w-12 h-12 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition transform hover:-translate-y-0.5 shadow-lg" aria-label="Rotate right"><RotateCw size={18} /></button>
              <button onClick={() => rotateModel('up')} className="w-12 h-12 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition transform hover:-translate-y-0.5 shadow-lg" aria-label="Rotate up"><ArrowUp size={18} /></button>
              <button onClick={() => rotateModel('down')} className="w-12 h-12 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition transform hover:-translate-y-0.5 shadow-lg ml-1" aria-label="Rotate down"><ArrowDown size={18} /></button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-96 bg-slate-800/95 backdrop-blur-md p-6 overflow-y-auto border-l border-blue-500/20 ml-6">
          {!showQuiz ? (
            <>
              <h3 className="text-2xl font-bold text-blue-300 mb-4">Learn More</h3>

              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-900/50 to-indigo-900/50 rounded-xl p-4 border border-blue-500/30">
                  <h4 className="font-semibold text-blue-200 mb-2">Key Facts</h4>
                  <ul className="space-y-2">
                    {currentContent.facts.map((fact: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-slate-300">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="leading-relaxed">{fact}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-green-900/50 to-blue-900/50 rounded-xl p-4 border border-green-500/30">
                  <h4 className="font-semibold text-green-200 mb-2">Interactive Tips</h4>
                  <p className="text-sm text-slate-300 mb-3">Use the rotation controls to examine the model from all angles. Each part serves a specific function in the system!</p>
                  <div className="flex gap-2 text-xs text-slate-400">
                    <span className="bg-slate-700 px-2 py-1 rounded border border-blue-500/30">🔄 Rotate</span>
                    <span className="bg-slate-700 px-2 py-1 rounded border border-blue-500/30">🔍 Explore</span>
                    <span className="bg-slate-700 px-2 py-1 rounded border border-blue-500/30">📚 Learn</span>
                  </div>
                </div>
              </div>

              <button onClick={() => setShowQuiz(true)} className="w-full mt-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg flex items-center justify-center gap-2"><Brain size={20} />Take Knowledge Quiz</button>
            </>
          ) : (
            <QuizComponent module={module} onComplete={onComplete} />
          )}
        </div>
      </div>
      {/* close button is rendered inside the header for proper alignment */}
    </div>
  );
};

// Module Card Component
// Adding type annotations for ModuleCard props
interface ModuleCardProps {
  icon: string;
  title: string;
  description: string;
  module: string;
  onStart: (moduleId: string) => void; // accept module id so caller can know which module started
  isCompleted: boolean;
}
const ModuleCard = ({ icon, title, description, module, onStart, isCompleted }: ModuleCardProps) => (
  <div
    role="button"
    aria-label={`Start ${title} module`}
    tabIndex={0}
    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onStart(module); }}
    onClick={() => onStart(module)}
    className={`relative overflow-hidden rounded-3xl p-6 md:p-8 shadow-2xl transition-transform duration-200 transform hover:scale-105 group cursor-pointer border focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
      isCompleted 
        ? 'bg-gradient-to-br from-emerald-700 to-green-800 text-white border-green-500/50 shadow-2xl' 
        : 'bg-slate-800/90 backdrop-blur-sm text-slate-200 border-blue-500/30 hover:border-blue-400/50 hover:shadow-2xl'
    }`}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-500/4 to-blue-600/8 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

    <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4">
      <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-lg flex items-center justify-center text-4xl md:text-6xl bg-gradient-to-br from-indigo-700 to-blue-700 shadow-inner">
        <span aria-hidden className="drop-shadow-lg">{icon}</span>
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-xl md:text-2xl font-bold mb-2">{title}</h3>
          {isCompleted && (
            <div className="ml-3 inline-flex items-center gap-2 text-xs bg-green-600/90 text-white px-3 py-1 rounded-full shadow">
              <CheckCircle className="w-4 h-4" />
              <span className="font-semibold">Completed</span>
            </div>
          )}
        </div>

        <p className={`text-sm mb-4 leading-relaxed ${isCompleted ? 'text-white/90' : 'text-slate-400'}`}>
          {description}
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onStart(module); }}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
              isCompleted
                ? 'bg-white/10 text-white border border-white/20'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg border border-blue-500/50'
            } focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-400`}
          >
            {isCompleted ? (
              <>
                <CheckCircle size={18} />
                <span>Completed</span>
              </>
            ) : (
              <>
                <Play size={18} />
                <span>Start</span>
              </>
            )}
          </button>
          <div className="hidden md:flex items-center text-xs text-slate-300 px-3 py-2 rounded-md bg-slate-800/40 border border-slate-700">
            <span className="font-mono">{module.toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ...existing code...

// Main Component
export default function ARLearningPage() {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  
  const modules = [
    {
      id: 'plant',
      icon: '🌱',
      title: 'Plant Anatomy',
      description: 'Explore the fascinating world of plants! Learn about roots, stems, leaves, and flowers through interactive 3D models and discover the magic of photosynthesis.'
    },
    {
      id: 'solar',
      icon: '🌌',
      title: 'Solar System',
      description: 'Journey through space and discover our amazing solar system! Learn about planets, their sizes, orbital patterns, and the incredible scale of our cosmic neighborhood.'
    },
    {
      id: 'body',
      icon: '🫀',
      title: 'Human Body',
      description: 'Discover the amazing human body! Explore organs, systems, and learn how they work together in perfect harmony to keep us alive and healthy.'
    },
    {
      id: 'coding',
      icon: '💻',
      title: '3D Programming',
      description: 'Dive into the exciting world of programming and computational thinking! Learn coding fundamentals through interactive 3D visualizations and engaging challenges.'
    }
  ];
  
  const startModule = (moduleId: string) => {
    setActiveModule(moduleId);
  };
  
  const closeAR = () => {
    setActiveModule(null);
  };
  const { user } = useUser();

  const completeModule = async (moduleId: string, score?: number, duration?: number, streakIncrement?: boolean) => {
    let updatedCompleted = completedModules
    if (!completedModules.includes(moduleId)) {
      updatedCompleted = [...completedModules, moduleId]
      setCompletedModules(updatedCompleted)
      setProgress((updatedCompleted.length / modules.length) * 100)
    }
    setActiveModule(null)

    // Persist to backend
    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id || 'guest',
          activityType: 'moduleComplete',
          data: { moduleId, score, duration, streakIncrement }
        }),
      })
      const json = await res.json()

      // Broadcast the update to other open pages/tabs so dashboard updates in real time
      try {
        if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
          const bc = new BroadcastChannel('edupath-progress')
          const progressPercent = typeof json.progress === 'number' ? json.progress : Math.round((updatedCompleted.length / modules.length) * 100)
          bc.postMessage({ userId: user?.id || 'guest', moduleId, progress: progressPercent, score, totalStudyHours: json.totalStudyHours, currentStreak: json.currentStreak })
          bc.close()
        }
      } catch (e) {
        console.warn('Broadcast failed', e)
      }

    } catch (err) {
      console.error('Failed to save progress', err)
    }

    // If user is not authenticated, persist to localStorage so progress survives refresh
    try {
      if (!user?.id && typeof window !== 'undefined') {
        const savedRaw = localStorage.getItem('edupath-progress')
        const saved = savedRaw ? JSON.parse(savedRaw) : { completedModules: [], progress: 0 }
        const merged = Array.from(new Set([...(saved.completedModules || []), ...updatedCompleted]))
        const newSaved = {
          completedModules: merged,
          progress: Math.round((merged.length / modules.length) * 100),
        }
        localStorage.setItem('edupath-progress', JSON.stringify(newSaved))
      }
    } catch (e) {
      console.error('Failed to persist guest progress locally', e)
    }

    if (updatedCompleted.length === modules.length) {
      setTimeout(() => {
        alert('🎉 Outstanding Achievement! You\'ve mastered all AR Learning modules! 🚀')
      }, 500)
    }
  };

  // Load persisted progress for signed-in users (from server) or guests (from localStorage)
  useEffect(() => {
    let mounted = true
    const normalizePercent = (val: any): number => {
      let n = typeof val === 'number' ? val : parseFloat(val)
      if (!isFinite(n) || isNaN(n)) n = 0
      if (n > 0 && n <= 1) n = n * 100
      n = Math.max(0, Math.min(100, Math.round(n)))
      return n
    }
    const load = async () => {
      try {
        if (user?.id) {
          const res = await fetch(`/api/progress?userId=${encodeURIComponent(user.id)}`)
          if (!mounted) return
          if (res.ok) {
            const data = await res.json()
            // Shape A (legacy): { modules, progress }
            if (data && Array.isArray(data.modules)) {
              setCompletedModules(data.modules.map((m: any) => m.moduleId))
              setProgress(normalizePercent(data.progress))
            } else if (data && data.raw && Array.isArray(data.raw.modules)) {
              // Shape B (current response wraps original doc under raw)
              setCompletedModules(data.raw.modules.map((m: any) => m.moduleId))
              setProgress(normalizePercent(data.raw.progress))
            } else if (data && Array.isArray(data.perVideo)) {
              // Shape C (video-centric progress) – approximate module completion by recent perVideo entries
              const ids = (data.perVideo as any[]).map(v => String(v.youtubeId || v.subject || v.title)).filter(Boolean)
              if (ids.length) {
                setCompletedModules((prev) => prev.length ? prev : [])
                setProgress((p) => p || normalizePercent(data.raw?.progress ?? 0))
              }
            }
          }
        } else if (typeof window !== 'undefined') {
          const raw = localStorage.getItem('edupath-progress')
          if (raw) {
            const obj = JSON.parse(raw)
            if (mounted) {
              setCompletedModules(obj.completedModules || [])
              setProgress(normalizePercent(obj.progress))
            }
          }
        }
      } catch (err) {
        console.error('Failed to load persisted progress', err)
      }
    }
    load()
    return () => { mounted = false }
  }, [user])
  
  return (
    <div className="min-h-screen bg-black text-white relative">
      <SmokeBackground />
      <CursorGlow />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Back to Home button (top-left of content) */}
        <div className="absolute left-4 top-4 z-30">
          <Link href="/" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-full shadow-lg transition-colors">
            <Home className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
        </div>
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 bg-clip-text text-transparent mb-4 drop-shadow-2xl">
            🚀 AR Learning Platform
          </h1>
          <p className="text-xl text-blue-200/90 mb-8 max-w-3xl mx-auto drop-shadow-lg">
            Interactive Education through Augmented Reality - Explore, Learn, Quiz, and Master New Concepts!
          </p>
          
          <div className="max-w-md mx-auto mb-8">
            <div className="flex justify-between text-blue-200/70 text-sm mb-2">
              <span>Learning Progress</span>
              <span>{completedModules.length}/4 modules completed</span>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-4 overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 transition-all duration-700 ease-out shadow-lg"
                style={{ width: `${progress}%` }}
              />
            </div>
            {progress > 0 && (
              <p className="text-blue-300/80 text-sm mt-2">
                {progress === 100 ? "🎉 All modules completed! You're a learning champion!" : `${Math.round(progress)}% complete - Keep going!`}
              </p>
            )}

            {/* Explore CTA */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => {
                  const el = document.getElementById('modules-grid');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white px-5 py-3 rounded-full shadow-xl transition-transform transform hover:-translate-y-1"
              >
                Explore Modules
              </button>
            </div>
          </div>
        </div>
        
        <div id="modules-grid" className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {modules.map((module) => (
            <ModuleCard
              key={module.id}
              icon={module.icon}
              title={module.title}
              description={module.description}
              module={module.id}
              onStart={startModule}
              isCompleted={completedModules.includes(module.id as string)}
            />
          ))}
        </div>
        
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-blue-200 mb-12">Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/30 shadow-xl">
              <Camera className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-blue-200 font-semibold mb-2">AR Experience</h3>
              <p className="text-slate-300 text-sm">Immersive 3D models with real-time interaction and exploration</p>
            </div>
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-indigo-500/30 shadow-xl">
              <RotateCw className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
              <h3 className="text-indigo-200 font-semibold mb-2">360° Rotation</h3>
              <p className="text-slate-300 text-sm">Explore models from every angle with intuitive controls</p>
            </div>
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 shadow-xl">
              <Brain className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-purple-200 font-semibold mb-2">Interactive Quizzes</h3>
              <p className="text-slate-300 text-sm">Test your knowledge with engaging quizzes and instant feedback</p>
            </div>
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30 shadow-xl">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-green-200 font-semibold mb-2">Track Progress</h3>
              <p className="text-slate-300 text-sm">Monitor your learning journey and celebrate achievements</p>
            </div>
          </div>
        </div>
      </div>
      
      {activeModule && (
        <ARScene
          module={activeModule}
          onClose={closeAR}
          onComplete={(score?: number) => completeModule(activeModule, score)}
        />
      )}
    </div>
  );
}