import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message, userId = "anonymous-user" } = await req.json();

    if (!message || typeof message !== "string") {
      return new Response(
        JSON.stringify({ error: "Message is required and must be a string" }),
        { status: 400 }
      );
    }

    const BOTPRESS_URL = process.env.BOTPRESS_URL;
    const BOT_ID = process.env.BOTPRESS_BOT_ID;
    const API_KEY = process.env.BOTPRESS_API_KEY;

    if (!BOTPRESS_URL || !BOT_ID || !API_KEY) {
      return new Response(
        JSON.stringify({ error: "Botpress not configured" }),
        { status: 500 }
      );
    }

    const response = await fetch(`${BOTPRESS_URL}/api/v1/bots/${BOT_ID}/converse`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        type: "text",
        text: message,
        userId: userId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Botpress API error: ${response.status}`);
    }

    const data = await response.json();
    
    const botResponses = data.responses
      .filter((r: any) => r.type === "text")
      .map((r: any) => r.text);
    
    const botResponse = botResponses.join("\n") || "I'm not sure how to answer that. Can you try asking differently?";

    return new Response(
      JSON.stringify({ answer: botResponse, source: "botpress" }),
      { status: 200 }
    );

  } catch (error) {
    console.error("Botpress integration error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to communicate with EduPath Assistant" }),
      { status: 500 }
    );
  }
}