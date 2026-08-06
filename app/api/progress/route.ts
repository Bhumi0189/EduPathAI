import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId")

  // If a userId was provided, try to read the persisted progress from MongoDB
  if (userId) {
    try {
      const db = await getDatabase()
      const col = db.collection("learningProgress")
      const doc = await col.findOne({ userId })
      if (doc) {
        try {
          // Build per-video aggregated progress summary from recorded events
          const map: Record<string, any> = {}

          const pushRecord = (rec: any, percent: number | null, dateField?: string) => {
            if (!rec || !rec.youtubeId) return
            const id = rec.youtubeId
            const existing = map[id] || { youtubeId: id, title: rec.title || null, subject: rec.subject || null, percent: 0, lastRecordedAt: null }

            // normalize percent
            const p = typeof percent === 'number' && !isNaN(percent) ? Math.max(0, Math.min(100, Math.round(percent))) : existing.percent

            // choose the max percent seen
            existing.percent = Math.max(existing.percent || 0, p || 0)

            // set title/subject if missing
            if (!existing.title && rec.title) existing.title = rec.title
            if (!existing.subject && rec.subject) existing.subject = rec.subject

            // lastRecordedAt: prefer recordedAt, completedAt, startedAt or provided dateField
            const candidates = [rec.recordedAt, rec.completedAt, rec.startedAt, rec[dateField || 'recordedAt']]
              .filter(Boolean)
              .map(d => (d instanceof Date ? d : new Date(d)))
            if (candidates.length) {
              const newest = candidates.reduce((a, b) => (a > b ? a : b))
              existing.lastRecordedAt = existing.lastRecordedAt ? (new Date(existing.lastRecordedAt) > newest ? existing.lastRecordedAt : newest) : newest
            }

            map[id] = existing
          }

          // videosSeen -> completed (100%)
          if (Array.isArray(doc.videosSeen)) {
            for (const v of doc.videosSeen) {
              pushRecord(v, 100)
            }
          }

          // videoPartials -> percent as reported (take max)
          if (Array.isArray(doc.videoPartials)) {
            for (const p of doc.videoPartials) {
              pushRecord(p, typeof p.percent === 'number' ? p.percent : null)
            }
          }

          // videoStarts -> ensure an entry exists (0% if nothing else)
          if (Array.isArray(doc.videoStarts)) {
            for (const s of doc.videoStarts) {
              pushRecord(s, null)
            }
          }

          const perVideo = Object.values(map).map((v: any) => ({
            youtubeId: v.youtubeId,
            title: v.title || null,
            subject: v.subject || null,
            percent: typeof v.percent === 'number' ? v.percent : 0,
            lastRecordedAt: v.lastRecordedAt ? new Date(v.lastRecordedAt).toISOString() : null,
          }))

          return NextResponse.json({ perVideo, raw: doc })
        } catch (err) {
          console.error('Failed to build per-video summary:', err)
          // fallback to returning raw doc
          return NextResponse.json(doc)
        }
      }
      // return empty object if no data yet for this user
      return NextResponse.json({})
    } catch (err) {
      console.error("Failed to read progress from DB:", err)
      return NextResponse.json({ error: "Failed to read progress" }, { status: 500 })
    }
  }

  // Fallback: if no userId provided, return a basic mock progress (same as before)
  const mockProgress = {
    totalStudyHours: 127,
    coursesCompleted: 8,
    quizzesTaken: 45,
    currentStreak: 7,
    level: 12,
    xp: 2450,
    weeklyGoals: [
      { id: 1, title: "Complete React Course", target: 5, current: 3, unit: "lessons" },
      { id: 2, title: "Practice Coding", target: 10, current: 7, unit: "hours" },
      { id: 3, title: "Take Quizzes", target: 3, current: 2, unit: "quizzes" },
    ],
    recentActivities: [
      { id: 1, type: "quiz", title: "JavaScript Fundamentals Quiz", score: 85, time: "2 hours ago" },
      { id: 2, type: "vr", title: "3D Molecular Structure", progress: 100, time: "1 day ago" },
      { id: 3, type: "chat", title: "AI Doubt Solver Session", duration: "15 min", time: "2 days ago" },
    ],
  }

  return NextResponse.json(mockProgress)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { userId, activityType, data } = body

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 })
    }

    const db = await getDatabase()
    const col = db.collection("learningProgress")

    // Fetch existing record
    const existing = await col.findOne({ userId })

    // Handle module completion event
    if (activityType === "moduleComplete") {
      const { moduleId, score } = data || {}
      if (!moduleId) {
        return NextResponse.json({ error: "Missing moduleId for moduleComplete" }, { status: 400 })
      }

      const now = new Date()

      // Build updated modules array
      const modules = (existing && Array.isArray(existing.modules)) ? existing.modules.filter((m: any) => m.moduleId !== moduleId) : []
      modules.push({ moduleId, completed: true, score: typeof score === 'number' ? score : null, completedAt: now })

      // Recalculate progress percent (naive: modules completed / 4 * 100) if totalModules known; otherwise keep or compute from existing.totalModules
      const totalModules = existing?.totalModules || 4
      const progressPercent = Math.round((modules.length / totalModules) * 100)

      // Update study hours and streak if provided
      const addedDuration = (data && typeof data.duration === 'number') ? data.duration : 0
      const totalStudyHours = (existing?.totalStudyHours || 0) + addedDuration
      const currentStreak = data && data.streakIncrement ? ((existing?.currentStreak || 0) + 1) : (existing?.currentStreak || 0)

      const update = {
        $set: {
          userId,
          modules,
          progress: progressPercent,
          totalModules,
          totalStudyHours,
          currentStreak,
          updatedAt: now,
        },
        $setOnInsert: {
          createdAt: now,
        },
      }

      await col.updateOne({ userId }, update, { upsert: true })

      return NextResponse.json({ success: true, message: "Module recorded", progress: progressPercent, totalStudyHours, currentStreak })
    }

    // Handle study time additions: client reports seconds spent, we convert to hours
    if (activityType === "studyTime") {
      const seconds = (data && typeof data.seconds === 'number') ? data.seconds : 0
      if (seconds <= 0) {
        return NextResponse.json({ error: "Invalid seconds for studyTime" }, { status: 400 })
      }

      const now = new Date()
      // existing totalStudyHours assumed to be in hours (float)
      const addedHours = seconds / 3600
      const totalStudyHours = (existing?.totalStudyHours || 0) + addedHours

      await col.updateOne(
        { userId },
        { $set: { totalStudyHours, updatedAt: now }, $setOnInsert: { createdAt: now, userId } },
        { upsert: true }
      )

      return NextResponse.json({ success: true, message: 'Study time added', totalStudyHours })
    }

    // Handle video start events specifically: record structured video start data
    if (activityType === "videoStart") {
      const { title, youtubeId, subject, startedAt } = data || {}
      if (!youtubeId) {
        return NextResponse.json({ error: "Missing youtubeId for videoStart" }, { status: 400 })
      }

      const now = new Date()
      const videoRecord = {
        youtubeId,
        title: title || null,
        subject: subject || null,
        startedAt: startedAt ? new Date(startedAt) : now,
        recordedAt: now,
      }

      // push into a videoStarts array for analytics
      await col.updateOne(
        { userId },
        ( { $push: { videoStarts: videoRecord }, $setOnInsert: { createdAt: now, userId }, $set: { lastVideoStartedAt: now } } as any ),
        { upsert: true }
      )

      return NextResponse.json({ success: true, message: 'videoStart recorded', video: videoRecord })
    }

    // Handle video completion events: record structured video completion data
    if (activityType === "videoComplete") {
      const { title, youtubeId, subject, completedAt } = data || {}
      if (!youtubeId) {
        return NextResponse.json({ error: "Missing youtubeId for videoComplete" }, { status: 400 })
      }

      const now = new Date()
      const completeRecord = {
        youtubeId,
        title: title || null,
        subject: subject || null,
        completedAt: completedAt ? new Date(completedAt) : now,
        recordedAt: now,
      }

      await col.updateOne(
        { userId },
        ( { $push: { videosSeen: completeRecord }, $setOnInsert: { createdAt: now, userId }, $set: { lastVideoCompletedAt: now } } as any ),
        { upsert: true }
      )

      return NextResponse.json({ success: true, message: 'videoComplete recorded', video: completeRecord })
    }

    // Handle video partial/progress events (e.g., user watched >= 50%)
    if (activityType === "videoPartial" || activityType === "videoProgress") {
      const { title, youtubeId, subject, percent } = data || {}
      if (!youtubeId) {
        return NextResponse.json({ error: "Missing youtubeId for videoPartial" }, { status: 400 })
      }

      const now = new Date()
      const partialRecord = {
        youtubeId,
        title: title || null,
        subject: subject || null,
        percent: typeof percent === 'number' ? percent : null,
        recordedAt: now,
      }

      await col.updateOne(
        { userId },
        ( { $push: { videoPartials: partialRecord }, $setOnInsert: { createdAt: now, userId }, $set: { lastVideoPartialAt: now } } as any ),
        { upsert: true }
      )

      return NextResponse.json({ success: true, message: 'videoPartial recorded', video: partialRecord })
    }

    // Generic progress update: merge provided fields into document
    if (activityType === "progressUpdate") {
      const now = new Date()
      const updateFields: any = { updatedAt: now }
      if (data) Object.assign(updateFields, data)

      await col.updateOne({ userId }, { $set: updateFields, $setOnInsert: { createdAt: now, userId } }, { upsert: true })

      return NextResponse.json({ success: true, message: "Progress updated" })
    }

    // Fallback: store raw activity as an activity log
    const now = new Date()
    await col.updateOne(
      { userId },
      // cast to any to avoid strict mongo update operator typing issues in this simple handler
      ({
        $push: { activities: { activityType, data, createdAt: now } },
        $setOnInsert: { createdAt: now, userId },
        $set: { updatedAt: now },
      } as any),
      { upsert: true }
    )

    return NextResponse.json({ success: true, message: "Activity logged" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update progress" }, { status: 500 })
  }
}
