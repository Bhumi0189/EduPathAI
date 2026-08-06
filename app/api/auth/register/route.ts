import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { hashPassword, generateToken, type User, COOKIE_NAME } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ success: false, message: "Password must be at least 6 characters" }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, message: "Invalid email format" }, { status: 400 })
    }

    const db = await getDatabase()
    const users = db.collection<User>("users")

    // Check if user already exists
    const existingUser = await users.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json({ success: false, message: "User already exists with this email" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const newUser: User = {
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      createdAt: new Date(),
      lastLogin: new Date(),
      learningStyle: "Visual",
      preferences: {
        emailNotifications: true,
        pushNotifications: true,
        studyReminders: true,
        weeklyReports: true,
        darkMode: true,
        language: "en",
      },
      stats: {
        totalStudyHours: 0,
        coursesCompleted: 0,
        quizzesTaken: 0,
        vrSessionsCompleted: 0,
        currentStreak: 1,
        longestStreak: 1,
        totalXP: 100,
        level: 1,
      },
    }

    const result = await users.insertOne(newUser)

    // Generate JWT token
    const token = generateToken({
      userId: result.insertedId.toString(),
      email: newUser.email,
    })

    // Create response with user data
    const response = NextResponse.json({
      success: true,
      user: {
        id: result.insertedId.toString(),
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt,
        lastLogin: newUser.lastLogin,
        learningStyle: newUser.learningStyle,
        preferences: newUser.preferences,
        stats: newUser.stats,
      },
    })

    // Set HTTP-only cookie
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error("Registration error:", error instanceof Error ? error.stack ?? error.message : error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
