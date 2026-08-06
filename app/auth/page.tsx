"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Brain, Eye, EyeOff, Mail, Lock, User, ArrowRight, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { AuthGuard } from "@/components/auth-guard"
import { useRouter } from "next/navigation"

function AuthPageContent() {
  const { login, register } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  })

  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await login(loginForm.email, loginForm.password)
      if (!result.success) {
        setError(result.message || "Login failed")
      } else {
        router.push("/")
      }
    } catch (error) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (registerForm.password !== registerForm.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (registerForm.password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setIsLoading(true)

    try {
      const result = await register(registerForm.name, registerForm.email, registerForm.password)
      if (!result.success) {
        setError(result.message || "Registration failed")
      }
    } catch (error) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    setError("Google authentication is not implemented yet")
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center p-6">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute w-[800px] h-[800px] opacity-10 transition-all duration-1000 ease-out bg-gradient-radial from-blue-400/20 via-purple-400/10 to-transparent blur-3xl top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute w-[600px] h-[600px] opacity-10 transition-all duration-1500 ease-out bg-gradient-radial from-purple-400/20 via-blue-400/10 to-transparent blur-3xl bottom-1/4 right-1/4 transform translate-x-1/2 translate-y-1/2" />

        {/* Animated Particles */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-10 animate-float-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Auth Card */}
      <Card className="w-full max-w-md bg-black/40 backdrop-blur-xl border-white/10 relative z-10">
        <CardHeader className="text-center pb-2">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Brain className="h-8 w-8 text-blue-400" />
            <span className="text-2xl font-light text-white">EduPath AI</span>
          </div>
          <CardTitle className="text-2xl font-light text-white">Welcome to the Future of Learning</CardTitle>
          <CardDescription className="text-gray-400">
            Sign in to your account or create a new one to get started
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert className="mb-4 border-red-500/20 bg-red-500/10">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-400">{error}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/5 border-white/10">
              <TabsTrigger
                value="signin"
                className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-gray-400"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-gray-400"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            {/* Sign In Tab */}
            <TabsContent value="signin" className="space-y-4 mt-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="Email address"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-blue-400/50 focus:ring-blue-400/20"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-blue-400/50 focus:ring-blue-400/20"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Link href="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-400/20 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    <>
                      <span className="relative z-10">Sign In</span>
                      <ArrowRight className="ml-2 h-4 w-4 relative z-10" />
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/20 to-blue-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* Sign Up Tab */}
            <TabsContent value="signup" className="space-y-4 mt-6">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Full name"
                      value={registerForm.name}
                      onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                      className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-blue-400/50 focus:ring-blue-400/20"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="Email address"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                      className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-blue-400/50 focus:ring-blue-400/20"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password (min. 6 characters)"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                      className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-blue-400/50 focus:ring-blue-400/20"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm password"
                      value={registerForm.confirmPassword}
                      onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                      className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-blue-400/50 focus:ring-blue-400/20"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-400/20 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    <>
                      <span className="relative z-10">Create Account</span>
                      <ArrowRight className="ml-2 h-4 w-4 relative z-10" />
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/20 to-blue-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-black px-2 text-gray-400">Or continue with</span>
            </div>
          </div>

          <Button
            onClick={handleGoogleAuth}
            disabled={isLoading}
            variant="outline"
            className="w-full mt-4 border-white/20 text-white hover:bg-white/10 bg-transparent transition-all duration-300 hover:scale-105 hover:border-blue-400/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </Button>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              By signing up, you agree to our{" "}
              <Link href="/terms" className="text-blue-400 hover:text-blue-300 transition-colors">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-blue-400 hover:text-blue-300 transition-colors">
                Privacy Policy
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Back to Home Link */}
      <Link
        href="/"
        className="absolute top-6 left-6 text-gray-400 hover:text-white transition-colors duration-300 flex items-center space-x-2 z-20"
      >
        <ArrowRight className="h-4 w-4 rotate-180" />
        <span>Back to Home</span>
      </Link>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float-particle {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); opacity: 0.1; }
          25% { transform: translateY(-20px) translateX(10px) rotate(90deg); opacity: 0.3; }
          50% { transform: translateY(-40px) translateX(-5px) rotate(180deg); opacity: 0.1; }
          75% { transform: translateY(-20px) translateX(-10px) rotate(270deg); opacity: 0.3; }
        }

        .animate-float-particle {
          animation: float-particle 4s ease-in-out infinite;
        }

        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  )
}

export default function AuthPage() {
  return (
    <AuthGuard requireAuth={false}>
      <AuthPageContent />
    </AuthGuard>
  )
}
