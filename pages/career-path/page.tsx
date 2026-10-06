import { NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"
import { getAuthUser } from "@/lib/auth"
import { getDatabase } from "@/lib/mongodb"

// ---------- Response schema ----------
// Using generateObject + zod forces the model to return well-formed,
// typed JSON instead of us having to hand-parse free text.

const careerRecommendationSchema = z.object({
  title: z.string().describe("Career / job title"),
  match: z
    .number()
    .min(0)
    .max(100)
    .describe("How well this career fits the student's profile, 0-100"),
  description: z.string().describe("One or two sentence summary of the role"),
  reasoning: z
    .string()
    .describe("Why this career fits THIS student's specific interests/skills — not generic text"),
  requiredSkills: z.array(z.string()).min(3).max(6),
  salaryRange: z.string().describe("Approximate salary range, e.g. '$70,000 - $110,000'"),
  growth: z.enum(["Low", "Medium", "High", "Very High"]),
  category: z
    .enum(["tech", "design", "data", "business", "science", "healthcare", "creative", "other"])
    .describe("Broad category, used to pick an icon on the frontend"),
})

const learningPathSchema = z.object({
  career: z.string().describe("Must match one of the recommendation titles"),
  duration: z.string().describe("Estimated total time, e.g. '6-12 months'"),
  courses: z
    .array(
      z.object({
        name: z.string(),
        duration: z.string().describe("e.g. '4 weeks'"),
      })
    )
    .min(3)
    .max(6),
})

const skillGapSchema = z.object({
  skill: z.string(),
  current: z.number().min(0).max(100).describe("Estimated current proficiency, based on the student's stated skills"),
  target: z.number().min(0).max(100).describe("Proficiency needed for the top recommended career"),
  priority: z.enum(["High", "Medium", "Low"]),
})

const careerGuidanceSchema = z.object({
  recommendations: z.array(careerRecommendationSchema).min(3).max(5),
  learningPaths: z.array(learningPathSchema).min(1).max(3),
  skillGaps: z.array(skillGapSchema).min(3).max(6),
})

export type CareerGuidanceResult = z.infer<typeof careerGuidanceSchema>

// ---------- Route ----------

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { interests, skills, goals, learningStyle, gradeLevel, notes } = body as {
      interests?: string[]
      skills?: string[]
      goals?: string[]
      learningStyle?: string
      gradeLevel?: string
      notes?: string
    }

    if (!interests?.length && !skills?.length) {
      return NextResponse.json(
        { error: "Provide at least some interests or skills to generate career guidance." },
        { status: 400 }
      )
    }

    // Try to enrich with the student's saved gamified profile (learning style,
    // quiz performance) so they don't have to re-enter data we already have.
    let resolvedLearningStyle = learningStyle
    let quizContext = ""
    try {
      const authUser = await getAuthUser(req)
      if (authUser?.userId) {
        const db = await getDatabase()
        const profileDoc = await db.collection("gamifiedProfiles").findOne({ userId: authUser.userId })
        if (profileDoc?.profile) {
          if (!resolvedLearningStyle) resolvedLearningStyle = profileDoc.profile.learningStyle
          quizContext = `The student has completed ${profileDoc.profile.completedQuizzes?.length ?? 0} quizzes and ${
            profileDoc.profile.completedGames?.length ?? 0
          } gamified challenges, and is currently level ${profileDoc.profile.level ?? 1}.`
        }
      }
    } catch (e) {
      // Auth/profile lookup is best-effort — don't fail the whole request over it.
      console.warn("[career] could not enrich from gamified profile:", e)
    }

    const prompt = `You are an expert career counselor for students on EduPath AI, a personalized learning platform.

Generate personalized career guidance for a student with this profile:
- Interests: ${interests?.length ? interests.join(", ") : "Not specified"}
- Current skills: ${skills?.length ? skills.join(", ") : "Not specified"}
- Stated goals: ${goals?.length ? goals.join(", ") : "Not specified"}
- Learning style: ${resolvedLearningStyle || "Not specified"}
- Grade / education level: ${gradeLevel || "Not specified"}
- Additional notes from student: ${notes || "None"}
${quizContext ? `- Platform activity: ${quizContext}` : ""}

Instructions:
1. Recommend 3-5 realistic career paths, ranked by fit (the "match" score should genuinely reflect
   how well each career fits THIS student's specific interests and skills — vary the scores realistically,
   don't just use round numbers like 90/85/80).
2. For each recommendation, write reasoning that references the student's actual stated interests/skills —
   avoid generic boilerplate.
3. Build 1-3 learning paths (course roadmaps) for the top recommended careers.
4. Identify 3-6 skill gaps: compare the student's current skills against what their top career choice needs.
   Estimate "current" proficiency based on skills they already listed (0 if they didn't mention it at all),
   and "target" based on what's needed to be job-ready.
5. Keep salary ranges realistic for entry-to-mid level roles (USD, unless the student's notes suggest another region).`

    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: careerGuidanceSchema,
      prompt,
      temperature: 0.6,
    })

    return NextResponse.json({ ...object, learningStyleUsed: resolvedLearningStyle || null }, { status: 200 })
  } catch (error) {
    console.error("[career] generation error:", error)
    return NextResponse.json(
      { error: "Failed to generate career guidance. Please try again." },
      { status: 500 }
    )
  }
}