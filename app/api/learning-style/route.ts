import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { answers } = await req.json()

    // Simple learning style detection algorithm
    const scores = { visual: 0, auditory: 0, kinesthetic: 0 }

    answers.forEach((answer: string) => {
      scores[answer as keyof typeof scores]++
    })

    const maxScore = Math.max(...Object.values(scores))
    const dominantStyle = Object.keys(scores).find((key) => scores[key as keyof typeof scores] === maxScore)

    const learningStyle = dominantStyle?.charAt(0).toUpperCase() + dominantStyle?.slice(1)

    // In a real app, you would save this to the database
    return NextResponse.json({
      learningStyle,
      scores,
      recommendations: getLearningStyleRecommendations(learningStyle || "Visual"),
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to process learning style" }, { status: 500 })
  }
}

function getLearningStyleRecommendations(style: string) {
  const recommendations = {
    Visual: [
      "Use mind maps and flowcharts",
      "Take detailed notes with diagrams",
      "Use color coding and highlighting",
      "Watch educational videos",
      "Create visual summaries",
    ],
    Auditory: [
      "Listen to recorded lectures",
      "Participate in group discussions",
      "Read aloud and use verbal repetition",
      "Use podcasts and audio books",
      "Explain concepts to others",
    ],
    Kinesthetic: [
      "Use hands-on experiments",
      "Take frequent breaks and move around",
      "Use physical models and manipulatives",
      "Practice with real-world applications",
      "Use interactive simulations",
    ],
  }

  return recommendations[style as keyof typeof recommendations] || recommendations.Visual
}
