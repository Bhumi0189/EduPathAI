import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getDatabase } from "@/lib/mongodb"

const catalog = [
  { id: "chemistry", title: "Chemistry Foundations", subject: "Chemistry", level: "Beginner", lessons: 12, duration: "4h 20m", rating: "4.9", description: "Build a strong foundation in atoms, bonding, reactions, and the language of chemistry." },
  { id: "biology", title: "Biology: Life Systems", subject: "Biology", level: "Intermediate", lessons: 16, duration: "6h 10m", rating: "4.8", description: "Understand cells, genetics, ecosystems, and the systems that keep living things working." },
  { id: "physics", title: "Physics in Practice", subject: "Physics", level: "Intermediate", lessons: 14, duration: "5h 35m", rating: "4.7", description: "Learn motion, forces, energy, and electricity through clear explanations and worked examples." },
  { id: "python", title: "Python for Problem Solving", subject: "Computer Science", level: "Beginner", lessons: 18, duration: "7h 15m", rating: "4.9", description: "Write useful Python programs while learning logic, data structures, and debugging habits." },
  { id: "algebra", title: "Algebra Essentials", subject: "Mathematics", level: "Beginner", lessons: 15, duration: "5h 00m", rating: "4.8", description: "Master equations, functions, graphs, and the algebraic thinking behind problem solving." },
  { id: "statistics", title: "Statistics and Data", subject: "Mathematics", level: "Intermediate", lessons: 13, duration: "4h 45m", rating: "4.7", description: "Turn data into insight with averages, probability, distributions, and clear visual reasoning." },
  { id: "web-development", title: "Web Development Basics", subject: "Computer Science", level: "Beginner", lessons: 20, duration: "8h 30m", rating: "4.9", description: "Build your first responsive websites with HTML, CSS, JavaScript, and practical projects." },
  { id: "communication", title: "Communication Skills", subject: "Personal Growth", level: "Beginner", lessons: 10, duration: "3h 15m", rating: "4.6", description: "Improve writing, presentations, active listening, and the confidence to share your ideas." },
]

const clamp = (value: unknown) => Math.max(0, Math.min(100, Math.round(Number(value) || 0)))

const seedLessons = (course: any) => Array.from({ length: course.lessons }, (_, index) => ({
  courseId: course.id,
  order: index + 1,
  title: `${index === 0 ? "Getting started: " : "Lesson "}${index + 1} - ${course.subject} essentials`,
  type: index % 3 === 1 ? "assignment" : index % 3 === 2 ? "quiz" : "lecture",
  duration: `${12 + (index % 5) * 4} min`,
  content: `Explore ${course.subject.toLowerCase()} through a focused explanation, a practical example, and one clear next step. This lesson builds toward the skills in ${course.title}.`,
  assignment: "Write three key ideas from this lesson and explain how you would use one in a real situation.",
  quiz: [{ question: `Which idea is central to this ${course.subject.toLowerCase()} lesson?`, options: ["The core concept", "A random detail", "An unrelated topic"], answer: 0 }],
}))

async function ensureCatalog(db: any) {
  const courses = db.collection("courses")
  if (await courses.countDocuments() === 0) await courses.insertMany(catalog.map((course) => ({ ...course, createdAt: new Date(), updatedAt: new Date() })))
  const storedCourses = await courses.find({}).sort({ createdAt: 1 }).toArray()
  const lessons = db.collection("courseLessons")
  for (const course of storedCourses) {
    if (await lessons.countDocuments({ courseId: course.id }) === 0) await lessons.insertMany(seedLessons(course))
  }
  return storedCourses
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const db = await getDatabase()
    const storedCourses = await ensureCatalog(db)
    const courseId = searchParams.get("courseId")
    if (courseId) {
      const course = storedCourses.find((item: any) => item.id === courseId)
      if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 })
      const lessons = await db.collection("courseLessons").find({ courseId }).sort({ order: 1 }).toArray()
      const progress = userId ? await db.collection("courseProgress").findOne({ userId, courseId }) : null
      return NextResponse.json({ course, lessons, progress: progress || { progress: 0, completedLessonIds: [] } })
    }
    const progressMap = new Map<string, { progress: number; completedLessons: number }>()

    if (userId) {
      const records = await db.collection("courseProgress").find({ userId }).toArray()
      records.forEach((record: any) => progressMap.set(record.courseId, { progress: clamp(record.progress), completedLessons: Math.max(0, Number(record.completedLessons) || 0) }))

      // Preserve progress recorded by the older learningProgress API while the user moves to course records.
      const legacy = await db.collection("learningProgress").findOne({ userId }) as any
      for (const item of legacy?.videoPartials || []) {
        const course = storedCourses.find((candidate: any) => candidate.subject === item.subject)
        if (!course || progressMap.has(course.id)) continue
        progressMap.set(course.id, { progress: clamp(item.percent), completedLessons: clamp(item.percent) >= 100 ? 1 : 0 })
      }
      for (const item of legacy?.videosSeen || []) {
        const course = storedCourses.find((candidate: any) => candidate.subject === item.subject)
        if (!course || progressMap.has(course.id)) continue
        progressMap.set(course.id, { progress: 100, completedLessons: course.lessons })
      }
    }

    const result = storedCourses.map((course: any) => ({
      id: course.id,
      title: course.title,
      subject: course.subject,
      level: course.level,
      lessons: course.lessons,
      duration: course.duration,
      rating: course.rating,
      description: course.description,
      progress: progressMap.get(course.id)?.progress || 0,
      completedLessons: progressMap.get(course.id)?.completedLessons || 0,
    }))
    const activeCourses = result.filter((course) => course.progress > 0 && course.progress < 100).length
    const completedLessons = result.reduce((total, course) => total + course.completedLessons, 0)
    const started = result.filter((course) => course.progress > 0)
    const learningProgress = started.length ? Math.round(started.reduce((total, course) => total + course.progress, 0) / started.length) : 0

    return NextResponse.json({ courses: result, summary: { activeCourses, completedLessons, learningProgress } })
  } catch (error) {
    console.error("Failed to load courses:", error)
    return NextResponse.json({ error: "Failed to load courses" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userId, courseId, lessonId, progress = 0, completedLessons = 0 } = await request.json()
    if (!userId || !courseId) return NextResponse.json({ error: "userId and courseId are required" }, { status: 400 })
    const db = await getDatabase()
    if (lessonId) {
      const course = await db.collection("courses").findOne({ id: courseId }) as any
      const lesson = ObjectId.isValid(lessonId) ? await db.collection("courseLessons").findOne({ _id: new ObjectId(lessonId), courseId }) : null
      if (!course || !lesson) return NextResponse.json({ error: "Lesson not found" }, { status: 404 })
      const current = await db.collection("courseProgress").findOne({ userId, courseId }) as any
      const completedLessonIds = Array.from(new Set([...(current?.completedLessonIds || []), lessonId]))
      const nextProgress = Math.round((completedLessonIds.length / course.lessons) * 100)
      await db.collection("courseProgress").updateOne(
        { userId, courseId },
        { $set: { progress: nextProgress, completedLessons: completedLessonIds.length, completedLessonIds, updatedAt: new Date() }, $setOnInsert: { userId, courseId, enrolledAt: new Date() } },
        { upsert: true },
      )
      return NextResponse.json({ success: true, progress: nextProgress, completedLessons: completedLessonIds.length, completedLessonIds })
    }
    await db.collection("courseProgress").updateOne(
      { userId, courseId },
      { $set: { progress: clamp(progress), completedLessons: Math.max(0, Number(completedLessons) || 0), updatedAt: new Date() }, $setOnInsert: { userId, courseId, enrolledAt: new Date() } },
      { upsert: true },
    )
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to save course progress:", error)
    return NextResponse.json({ error: "Failed to save course progress" }, { status: 500 })
  }
}
