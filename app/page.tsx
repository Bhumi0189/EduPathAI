"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  BookOpen,
  Gamepad2,
  MessageCircle,
  Target,
  Zap,
  Users,
  Award,
  ChevronRight,
  Play,
  Star,
  CheckCircle,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import RootLayout from "@/components/RootLayout";
import { SmokeBackground } from "./components/smoke-background";
import { CursorGlow } from "./components/cursor-glow";
import ProfilePopover from "../components/ProfilePopover";

import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";


// Helper function for user ID generation
const getUserId = () => {
  if (typeof window !== 'undefined') {
    let userId = localStorage.getItem('edupath-user-id');
    if (!userId) {
      userId = 'user-' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('edupath-user-id', userId);
    }
    return userId;
  }
  return 'anonymous-user';
};

function LandingPageContent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (user) {
      // Commenting out the redirect to dashboard to ensure ProfilePopover is visible
      // router.push("/dashboard");
    }
  }, [user]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  const handleAsk = () => {
    if (!query.trim()) {
      setError("Please enter a question to ask EduPath AI.");
      return;
    }

    // Redirect to full chat page
    router.push("/chat");
  };

  // const handleAsk = () => {
  //   if (!query.trim()) {
  //     setError("Please enter a question to ask EduPath AI.");
  //     return;
  //   }

  //   setError("");

  //   try {
  //     // ✅ Make sure chat is open (optional)
  //     // @ts-ignore
  //     window.botpressWebChat?.sendEvent({ type: "show" });

  //     // ✅ Send message to Botpress conversation
  //     // @ts-ignore
  //     window.botpressWebChat?.sendPayload({
  //       type: "text",
  //       text: query.trim(),
  //     });

  //     setQuery(""); // clear input field
  //   } catch (e) {
  //     console.error("Botpress error:", e);
  //     setError("Sorry, chatbot is not available right now.");
  //   }
  // };

  return (
    <div className="min-h-screen bg-black text-white relative">
      <SmokeBackground />
      <CursorGlow />
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold">EduPath AI</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection("features")}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("ai-coach")}
                className="text-gray-300 hover:text-white transition-colors"
              >
                AI Coach
              </button>
              <button
                onClick={() => scrollToSection("vr-learning")}
                className="text-gray-300 hover:text-white transition-colors"
              >
                VR Learning
              </button>
              <button
                onClick={() => scrollToSection("pricing")}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Pricing
              </button>
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <ProfilePopover />
              ) : (
                <Link href="/auth">
                  <Button className="bg-blue-600 hover:bg-blue-700">Try EduPath</Button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-white/10">
              <div className="flex flex-col space-y-4 mt-4">
                <button
                  onClick={() => scrollToSection("features")}
                  className="text-gray-300 hover:text-white transition-colors text-left"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection("ai-coach")}
                  className="text-gray-300 hover:text-white transition-colors text-left"
                >
                  AI Coach
                </button>
                <button
                  onClick={() => scrollToSection("vr-learning")}
                  className="text-gray-300 hover:text-white transition-colors text-left"
                >
                  VR Learning
                </button>
                <button
                  onClick={() => scrollToSection("pricing")}
                  className="text-gray-300 hover:text-white transition-colors text-left"
                >
                  Pricing
                </button>
                <div className="flex flex-col space-y-2 pt-4 border-t border-white/10">
                  <Link href="/auth">
                    <Button variant="ghost" className="w-full text-white hover:bg-white/10">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">Try EduPath</Button>
                  </Link>
                </div>
                <ProfilePopover />
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto text-center">
          <div
            className={`transition-all duration-1000 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
          >
            <Badge className="mb-6 bg-blue-500/20 text-blue-400 border-blue-500/30">
              🚀 The Future of Learning is Here
            </Badge>
            <h1
              className="relative text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent animate-fade-in-up overflow-hidden"
              style={{ WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
            >
              Learn Smarter with AI-Powered Education
            </h1>
            <div className="flex justify-center mb-8 animate-fade-in-up">
              <div className="relative w-full max-w-xl">
                {/* Input Box */}
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault(); // prevent form submit
                      handleAsk();
                    }
                  }}
                  placeholder="Ask EduPath AI anything…"
                  aria-label="Ask EduPath AI anything"
                  className="w-full rounded-full px-6 py-4 pr-14 bg-black/70 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* Search/Send Button */}
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 transition-all shadow"
                  onClick={handleAsk}
                >
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                    <path
                      d="M21 21l-4.35-4.35m2.1-5.4A7.35 7.35 0 1 1 3 10.25a7.35 7.35 0 0 1 14.7 0Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-400 mb-4 animate-fade-in-up max-w-2xl mx-auto text-center">
                {error}
              </div>
            )}


            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Transform your learning journey with personalized AI coaching, immersive VR experiences, and adaptive
              learning paths tailored just for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth?redirectTo=/Model3D">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6">
                  <Play className="mr-2 h-5 w-5" />
                  Start Learning
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-6 bg-transparent"
                onClick={() => scrollToSection("features")}
              >
                Explore Features
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Revolutionize Your Learning Experience</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Discover cutting-edge features designed to accelerate your learning and unlock your full potential.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "AI-Powered Personalization",
                description: "Adaptive learning algorithms that understand your unique learning style and pace.",
                color: "blue",
              },
              {
                icon: Gamepad2,
                title: "Immersive VR Learning",
                description: "Step into virtual worlds and experience hands-on learning like never before.",
                color: "purple",
              },
              {
                icon: MessageCircle,
                title: "24/7 AI Tutor",
                description: "Get instant help and explanations from your personal AI learning assistant.",
                color: "green",
              },
              {
                icon: Target,
                title: "Goal-Oriented Paths",
                description: "Structured learning journeys designed to help you achieve your specific goals.",
                color: "orange",
              },
              {
                icon: Users,
                title: "Collaborative Learning",
                description: "Connect with peers and learn together in virtual study groups and projects.",
                color: "pink",
              },
              {
                icon: Award,
                title: "Achievement System",
                description: "Earn badges, certificates, and track your progress with gamified learning.",
                color: "yellow",
              },
            ].map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card
                  key={index}
                  className={`bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                    }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <CardHeader>
                    <div
                      className={`w-12 h-12 rounded-lg bg-${feature.color}-500/20 flex items-center justify-center mb-4`}
                    >
                      <IconComponent className={`h-6 w-6 text-${feature.color}-400`} />
                    </div>
                    <CardTitle className="text-white">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-400">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI Coach Section */}
      <section id="ai-coach" className="py-20 px-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-blue-500/20 text-blue-400 border-blue-500/30">AI-Powered Learning</Badge>
              <h2 className="text-4xl font-bold mb-6">Your Personal AI Learning Coach</h2>
              <p className="text-gray-300 text-lg mb-8">
                Meet your AI-powered learning companion that adapts to your learning style, identifies knowledge gaps,
                and provides personalized recommendations to accelerate your progress.
              </p>
              <div className="space-y-4">
                {[
                  "Personalized learning paths based on your goals",
                  "Real-time feedback and progress tracking",
                  "Intelligent content recommendations",
                  "24/7 availability for instant help",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
              <Link href="/auth?redirectTo=/ai-coach">
                <Button className="mt-8 bg-blue-600 hover:bg-blue-700">
                  Try AI Coach
                  < ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-8 backdrop-blur-sm border border-white/10">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                      <Brain className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">AI Coach</p>
                      <p className="text-gray-300 text-sm">
                        I've analyzed your learning pattern and recommend focusing on React hooks next. You're 85%
                        ready!
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                      <span className="text-white text-sm">You</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">You</p>
                      <p className="text-gray-300 text-sm">Can you create a personalized study plan for React hooks?</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                      <Brain className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">AI Coach</p>
                      <p className="text-gray-300 text-sm">
                        I've created a 5-day plan with interactive exercises and VR labs. Let's start!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VR Learning Section */}
      <section id="vr-learning" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-8 backdrop-blur-sm border border-white/10">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <Gamepad2 className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                    <p className="text-white font-medium">Chemistry Lab</p>
                    <p className="text-gray-400 text-sm">Molecular Visualization</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <BookOpen className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <p className="text-white font-medium">History Walk</p>
                    <p className="text-gray-400 text-sm">Ancient Rome Tour</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <Target className="h-8 w-8 text-green-400 mx-auto mb-2" />
                    <p className="text-white font-medium">Physics Sim</p>
                    <p className="text-gray-400 text-sm">Gravity Experiments</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <Zap className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                    <p className="text-white font-medium">Code Space</p>
                    <p className="text-gray-400 text-sm">3D Programming</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <Badge className="mb-4 bg-purple-500/20 text-purple-400 border-purple-500/30">Immersive Technology</Badge>
              <h2 className="text-4xl font-bold mb-6">Learn Through Virtual Reality</h2>
              <p className="text-gray-300 text-lg mb-8">
                Step into immersive virtual environments where abstract concepts become tangible experiences. From
                exploring molecular structures to walking through historical events.
              </p>
              <div className="space-y-4">
                {[
                  "Interactive 3D learning environments",
                  "Hands-on experiments in safe virtual labs",
                  "Collaborative VR study sessions",
                  "Compatible with all major VR headsets",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
              <Link href="/auth?redirectTo=/vr-learning">
                <Button className="mt-8 bg-purple-600 hover:bg-purple-700">
                  Explore VR Learning
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Gamified Learning Section */}
      <section id="gamified-learning" className="py-20 px-6 bg-gradient-to-r from-yellow-900/20 to-orange-900/20">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Engaging Learning</Badge>
              <h2 className="text-4xl font-bold mb-6">Learn Through Gamified Quizzes & Fun Challenges</h2>
              <p className="text-gray-300 text-lg mb-8">
                Boost retention and motivation by participating in interactive quizzes, educational games, and challenges designed to make learning fun and engaging.
              </p>
              <div className="space-y-4">
                {[
                  "Interactive quizzes to test your knowledge",
                  "Game-based challenges for real-time learning",
                  "Earn points, badges, and rewards as you progress",
                  "Compete with peers on learning leaderboards",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
              <Link href="/auth?redirectTo=/gamified-learning">
                <Button className="mt-8 bg-yellow-600 hover:bg-yellow-700">
                  Explore Gamified Learning
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl p-8 backdrop-blur-sm border border-white/10">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <Gamepad2 className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                    <p className="text-white font-medium">Quiz Arena</p>
                    <p className="text-gray-400 text-sm">Challenge your knowledge with timed quizzes</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <Award className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                    <p className="text-white font-medium">Achievements</p>
                    <p className="text-gray-400 text-sm">Earn badges for completing milestones</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <Zap className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                    <p className="text-white font-medium">Interactive Mini-Games</p>
                    <p className="text-gray-400 text-sm">Fun educational games that reinforce concepts</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <Users className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                    <p className="text-white font-medium">Leaderboards</p>
                    <p className="text-gray-400 text-sm">Compete with friends and climb the rankings</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Career Guidance Section */}
      <section id="career-guidance" className="py-20 px-6 bg-gradient-to-r from-green-900/20 to-blue-900/20">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-2xl p-8 backdrop-blur-sm border border-white/10">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <Target className="h-8 w-8 text-green-400 mx-auto mb-2" />
                    <p className="text-white font-medium">Career Path Mapping</p>
                    <p className="text-gray-400 text-sm">Personalized career recommendations based on your skills & interests</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <BookOpen className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <p className="text-white font-medium">Resume Building</p>
                    <p className="text-gray-400 text-sm">Step-by-step guidance to create a professional resume</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <Users className="h-8 w-8 text-green-400 mx-auto mb-2" />
                    <p className="text-white font-medium">Mock Interviews</p>
                    <p className="text-gray-400 text-sm">Practice interviews with AI feedback to improve confidence</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <Zap className="h-8 w-8 text-green-400 mx-auto mb-2" />
                    <p className="text-white font-medium">Job Recommendations</p>
                    <p className="text-gray-400 text-sm">AI-curated job listings tailored to your learning progress</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <Badge className="mb-4 bg-green-500/20 text-green-400 border-green-500/30">Career Success</Badge>
              <h2 className="text-4xl font-bold mb-6">Guiding Your Career Path to Success</h2>
              <p className="text-gray-300 text-lg mb-8">
                Our integrated career guidance system helps you discover the best career options, prepare impactful resumes, practice interviews, and get recommended for job opportunities—all powered by AI.
              </p>
              <div className="space-y-4">
                {[
                  "Personalized career mapping based on your learning",
                  "Interactive resume builder with templates",
                  "Mock interview sessions with instant feedback",
                  "Job opportunities curated just for you",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
              <Link href="/auth?redirectTo=/career-guidance">
                <Button className="mt-8 bg-green-600 hover:bg-green-700">
                  Explore Career Guidance
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>



      {/* Testimonials */}
      <section className="py-20 px-6 bg-gradient-to-r from-gray-900/50 to-black">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What Our Learners Say</h2>
            <p className="text-gray-400 text-lg">Join thousands of students transforming their learning experience</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                role: "Computer Science Student",
                content:
                  "EduPath AI completely changed how I learn programming. The AI coach understands exactly where I struggle and provides perfect explanations.",
                rating: 5,
              },
              {
                name: "Marcus Johnson",
                role: "Medical Student",
                content:
                  "The VR anatomy lessons are incredible! I can explore the human body in 3D and understand complex structures like never before.",
                rating: 5,
              },
              {
                name: "Elena Rodriguez",
                role: "Language Learner",
                content:
                  "The personalized learning paths helped me become fluent in French 3x faster than traditional methods. Absolutely amazing!",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <Card
                key={index}
                className={`bg-white/5 border-white/10 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                  }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-4">"{testimonial.content}"</p>
                  <div>
                    <p className="text-white font-medium">{testimonial.name}</p>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Choose Your Learning Journey</h2>
            <p className="text-gray-400 text-lg">Start free and upgrade as you grow</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Free",
                price: "0",
                period: "forever",
                description: "Perfect for getting started",
                features: ["Basic AI coaching", "5 VR experiences per month", "Community access", "Progress tracking"],
                cta: "Get Started",
                popular: false,
              },
              {
                name: "Pro",
                price: "199",
                period: "per month",
                description: "For serious learners",
                features: [
                  "Advanced AI coaching",
                  "Unlimited VR experiences",
                  "Personalized learning paths",
                  "Priority support",
                  "Offline content",
                ],
                cta: "Start Pro Trial",
                popular: true,
              },
              {
                name: "Team",
                price: "499",
                period: "per month",
                description: "For organizations",
                features: [
                  "Everything in Pro",
                  "Team management",
                  "Custom content creation",
                  "Analytics dashboard",
                  "Dedicated support",
                ],
                cta: "Contact Sales",
                popular: false,
              },
            ].map((plan, index) => (
              <Card
                key={index}
                className={`relative bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 ${plan.popular ? "ring-2 ring-blue-500 scale-105" : ""
                  } ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-white text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400">/{plan.period}</span>
                  </div>
                  <CardDescription className="text-gray-400">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/auth">
                    <Button
                      className={`w-full ${plan.popular
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                        }`}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-900/30 to-purple-900/30">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Learning?</h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of learners who are already experiencing the future of education with EduPath AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6">
                <Play className="mr-2 h-5 w-5" />
                Start Learning Now
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-6 bg-transparent"
            >
              Schedule Demo
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Brain className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold">EduPath AI</span>
              </div>
              <p className="text-gray-400">
                Transforming education through AI-powered personalized learning experiences.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button onClick={() => scrollToSection("features")}>Features</button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("ai-coach")}>AI Coach</button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("vr-learning")}>VR Learning</button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("pricing")}>Pricing</button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Careers</li>
                <li>Blog</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Documentation</li>
                <li>Community</li>
                <li>Status</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 EduPath AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
      <style jsx global>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(24px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.9s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        .animate-shimmer {
          animation: shimmer 4s linear infinite;
          background-size: 200% auto;
        }
      `}</style>
    </div>
  );
}

export default function LandingPage() {
  return (
    <RootLayout>
      <LandingPageContent />
    </RootLayout>
  );
}