import { NextResponse } from "next/server"
import { COOKIE_NAME } from "@/lib/auth"

export async function POST() {
  try {
    const response = NextResponse.json({ success: true })

    // Clear the auth cookie
    response.cookies.set(COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    })

    return response
  } catch (error) {
    console.error("Logout error:", error instanceof Error ? error.stack ?? error.message : error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
