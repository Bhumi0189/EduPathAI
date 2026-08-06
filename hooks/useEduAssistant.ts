import { useState } from "react";

export function useEduAssistant() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const askQuestion = async (prompt: string, userId?: string) => {
    if (!prompt.trim()) {
      setError("Please enter a question.");
      return null;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/edu-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim(), userId }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || `API error: ${res.status}`);
      }

      return data.answer;
    } catch (e: any) {
      console.error("Error fetching AI response:", e);
      setError(e.message || "Sorry, something went wrong. Please try again.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { askQuestion, loading, error, setError };
}