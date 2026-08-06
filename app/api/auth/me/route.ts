import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { getAuthUser, type User } from "@/lib/auth"

// Opt out of static generation since this route uses dynamic request headers
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request)

    if (!authUser) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const db = await getDatabase()
    const users = db.collection<User>("users")
    
    // Dynamically import ObjectId to prevent webpack bundling of mongodb
    const { ObjectId } = await import("mongodb")

    const user = await users.findOne(
      ({ _id: new ObjectId(authUser.userId) } as any),
      { projection: { password: 0 } }, // Exclude password from response
    )

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id?.toString(),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
        learningStyle: user.learningStyle,
        preferences: user.preferences,
        stats: user.stats,
      },
    })
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
