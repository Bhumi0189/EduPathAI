import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

// Minimal default profile to use on first insert
const DEFAULT_PROFILE = {
  name: "Student",
  level: 1,
  points: 0,
  badges: [] as string[],
  completedQuizzes: [] as string[],
  completedGames: [] as string[],
  quizAttempts: 0,
  learningStyle: "mixed" as "visual" | "auditory" | "kinesthetic" | "reading" | "mixed",
  interactions: { visual: 0, auditory: 0, kinesthetic: 0, reading: 0 },
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { userId, quizId, pointsDelta } = body || {}
    if (!userId || !quizId) {
      return NextResponse.json({ error: "Missing userId or quizId" }, { status: 400 })
    }

    const db = await getDatabase()
    const col = db.collection("gamifiedProfiles")
    const now = new Date()

    const result = await col.findOneAndUpdate(
      { userId },
      {
        $inc: { "profile.quizAttempts": 1, ...(typeof pointsDelta === 'number' ? { "profile.points": pointsDelta } : {}) },
        $addToSet: { "profile.completedQuizzes": quizId },
        $set: { updatedAt: now },
        $setOnInsert: { createdAt: now, userId, profile: { ...DEFAULT_PROFILE, quizAttempts: 1, completedQuizzes: [quizId], points: typeof pointsDelta === 'number' ? pointsDelta : 0 } },
      },
      { upsert: true, returnDocument: "after" as any }
    )

    const doc: any = result?.value || (await col.findOne({ userId }))
    return NextResponse.json({ success: true, userId, profile: doc?.profile || DEFAULT_PROFILE, updatedAt: doc?.updatedAt || now })
  } catch (e) {
    console.error("[gamified/complete-quiz][POST]", e)
    return NextResponse.json({ error: "Failed to update quiz completion" }, { status: 500 })
  }
}
