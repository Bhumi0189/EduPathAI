"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Brain, Mail, Lock, User, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement Firebase registration
    console.log("Registration data:", formData)
  }

  const handleGoogleSignUp = () => {
    // TODO: Implement Google OAuth
    console.log("Google sign up")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>

      <Card className="w-full max-w-md shadow-2xl border-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl relative z-10">
        <CardHeader className="text-center pb-8">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="relative">
              <Brain className="h-10 w-10 text-cyan-400" />
              <div className="absolute inset-0 bg-cyan-400 blur-lg opacity-30"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              EduPath AI
            </span>
          </div>
          <CardTitle className="text-3xl font-bold text-white mb-2">Create Your Account</CardTitle>
          <CardDescription className="text-gray-300 text-lg">
            Join thousands of learners and start your AI-powered education journey
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-gray-300 font-medium">
                  First Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="firstName"
                    placeholder="John"
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-gray-300 font-medium">
                  Last Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300 font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300 font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-300 font-medium">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white py-3 font-semibold shadow-lg shadow-cyan-500/25 transform hover:scale-105 transition-all duration-300"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Create Account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <div className="mt-8">
            <Separator className="my-6 bg-white/20" />
            <Button
              variant="outline"
              className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
              onClick={handleGoogleSignUp}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
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
            </Button>
          </div>

          <p className="mt-8 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
