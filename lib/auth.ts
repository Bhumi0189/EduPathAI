import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import type { NextRequest } from "next/server"

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not set")
}

const JWT_SECRET = process.env.JWT_SECRET
export const COOKIE_NAME = "auth-token"

export interface User {
  _id?: string
  name: string
  email: string
  password: string
  createdAt: Date
  lastLogin?: Date
  learningStyle?: string
  preferences?: {
    emailNotifications: boolean
    pushNotifications: boolean
    studyReminders: boolean
    weeklyReports: boolean
    darkMode: boolean
    language: string
  }
  stats?: {
    totalStudyHours: number
    coursesCompleted: number
    quizzesTaken: number
    vrSessionsCompleted: number
    currentStreak: number
    longestStreak: number
    totalXP: number
    level: number
  }
}

export interface AuthUser {
  userId: string
  email: string
}

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(payload: AuthUser): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as unknown as { userId?: string; email?: string }
    if (!payload || !payload.userId) return null
    return { userId: String(payload.userId), email: String(payload.email ?? "") }
  } catch {
    return null
  }
}

export async function getAuthUser(request: NextRequest): Promise<AuthUser | null> {
  // Prefer Authorization header (Bearer) if present (useful for API clients)
  const authHeader = request.headers.get("authorization") || request.headers.get("Authorization")
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7)
    const authUser = verifyToken(token)
    if (authUser) return authUser
  }

  // Fallback to cookie
  const token = request.cookies.get(COOKIE_NAME)?.value
  if (!token) return null
  return verifyToken(token)
}
