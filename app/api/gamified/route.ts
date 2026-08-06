import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

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
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    const db = await getDatabase();
    const col = db.collection("gamifiedProfiles");
    const doc = await col.findOne({ userId });
    if (!doc) {
      // Don't upsert automatically on GET; return default so client can display immediately.
      return NextResponse.json({ userId, ...DEFAULT_PROFILE, exists: false });
    }
    return NextResponse.json({ userId, ...doc.profile, exists: true, updatedAt: doc.updatedAt, createdAt: doc.createdAt });
  } catch (e) {
    console.error("[gamified][GET]", e);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, profile } = body || {};
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }
    if (!profile || typeof profile !== "object") {
      return NextResponse.json({ error: "Missing profile" }, { status: 400 });
    }

    const now = new Date();
    const db = await getDatabase();
    const col = db.collection("gamifiedProfiles");

    await col.updateOne(
      { userId },
      { $set: { profile, updatedAt: now }, $setOnInsert: { createdAt: now, userId } },
      { upsert: true }
    );

    return NextResponse.json({ success: true, updatedAt: now.toISOString() });
  } catch (e) {
    console.error("[gamified][POST]", e);
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
  }
}
