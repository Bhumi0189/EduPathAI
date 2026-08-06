import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { verifyPassword, generateToken, type User, COOKIE_NAME } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validation
    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email and password are required" }, { status: 400 })
    }

    const db = await getDatabase()
    const users = db.collection<User>("users")

    // Find user
    const user = await users.findOne({ email: email.toLowerCase() })
    if (!user) {
      return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 })
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 })
    }

    // Update last login
    // compute streak: increment if lastLogin was yesterday, reset to 1 if older, no-op if already today
    const now = new Date()
    const lastLogin = user.lastLogin ? new Date(user.lastLogin) : null

    const isSameDay = (d1: Date, d2: Date) => {
      return d1.getUTCFullYear() === d2.getUTCFullYear() && d1.getUTCMonth() === d2.getUTCMonth() && d1.getUTCDate() === d2.getUTCDate()
    }

    const isYesterday = (d1: Date, d2: Date) => {
      const dayMs = 24 * 60 * 60 * 1000
      const diff = Math.floor((Date.UTC(d2.getUTCFullYear(), d2.getUTCMonth(), d2.getUTCDate()) - Date.UTC(d1.getUTCFullYear(), d1.getUTCMonth(), d1.getUTCDate())) / dayMs)
      return diff === 1
    }

    let currentStreak = user.stats?.currentStreak || 0
    let longestStreak = user.stats?.longestStreak || 0

    if (lastLogin && isSameDay(lastLogin, now)) {
      // already logged-in today; do not change streak
    } else if (lastLogin && isYesterday(lastLogin, now)) {
      currentStreak = (currentStreak || 0) + 1
      longestStreak = Math.max(longestStreak || 0, currentStreak)
    } else {
      // no prior login or gap > 1 day => reset streak to 1
      currentStreak = 1
      longestStreak = Math.max(longestStreak || 0, currentStreak)
    }

    await users.updateOne(
      { _id: user._id },
      { $set: { lastLogin: now, "stats.currentStreak": currentStreak, "stats.longestStreak": longestStreak } }
    )

    // Generate JWT token
    const token = generateToken({
      userId: user._id!.toString(),
      email: user.email,
    })

    // Create response with user data
    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id!.toString(),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        lastLogin: now,
        learningStyle: user.learningStyle,
        preferences: user.preferences,
        stats: { ...(user.stats || {}), currentStreak, longestStreak },
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
    console.error("Login error:", error instanceof Error ? error.stack ?? error.message : error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
