"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { SmokeBackground } from "../components/smoke-background";
import { CursorGlow } from "../components/cursor-glow";

export default function ChatPage() {
  const [loading, setLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const conversationIdRef = useRef<string | null>(null);
  const router = useRouter();

  // Initialize chat history from localStorage
  useEffect(() => {
    const userId =
      localStorage.getItem("eduPathUserId") || `user-${Date.now()}`;
    const storedHistory = localStorage.getItem(`chatHistory-${userId}`);
    if (storedHistory) {
      setChatHistory(JSON.parse(storedHistory));
    }
  }, []);

  // Persist chat history to localStorage
  useEffect(() => {
    const userId = localStorage.getItem("eduPathUserId");
    if (userId && chatHistory.length > 0) {
      localStorage.setItem(
        `chatHistory-${userId}`,
        JSON.stringify(chatHistory)
      );
    }
  }, [chatHistory]);

  // Initialize Botpress
  const initBotpress = () => {
    if (typeof window !== "undefined" && window.botpress) {
      let userId = localStorage.getItem("eduPathUserId");
      if (!userId) {
        userId = `user-${Date.now()}`;
        localStorage.setItem("eduPathUserId", userId);
      }

      // @ts-ignore
      window.botpress.init({
        botId: "5c5d17ec-e7ef-44c0-b68d-594213d25fb6",
        clientId: "27a3c573-4405-457d-9542-31eab03d37e6",
        selector: "#webchat",
        userId,
        configuration: {
          version: "v1",
          botName: "EduPathAi",
          botDescription: "- Your Smart Learning Companion",
          color: "#002292",
          variant: "soft",
          headerVariant: "solid",
          themeMode: "dark",
          fontFamily: "ADLaM Display",
          radius: 4,
          feedbackEnabled: false,
          footer: "[⚡ by EduPathAI]",
          additionalStylesheetUrl:
            "https://files.bpcontent.cloud/2025/08/21/17/20250821171423-3VJYR6PN.css",
          useSessionStorage: false,
          enableConversationDeletion: false,
          persistence: "local",
        },
      });

      // On webchat ready
      // @ts-ignore
      window.botpress.on("webchat:ready", () => {
        // @ts-ignore
        window.botpress.open();
        setLoading(false);

        const footer = document.querySelector(
          "#webchat .bpWebchat-footer"
        );
        if (footer && !document.getElementById("back-home-btn")) {
          const btn = document.createElement("button");
          btn.id = "back-home-btn";
          btn.innerText = "⬅ Back to Home";
          btn.style.background =
            "linear-gradient(to right, #3b82f6, #8b5cf6)";
          btn.style.color = "white";
          btn.style.padding = "8px 14px";
          btn.style.border = "none";
          btn.style.borderRadius = "6px";
          btn.style.cursor = "pointer";
          btn.style.marginLeft = "10px";

          btn.onclick = () => {
            router.push("/");
          };

          footer.appendChild(btn);
        }
      });

      // On new conversation
      // @ts-ignore
      window.botpress.on("newConversation", (conversation) => {
        const conversationId = conversation.id;
        conversationIdRef.current = conversationId;
        setCurrentConversationId(conversationId);
        setChatHistory([]);
        const userId = localStorage.getItem("eduPathUserId");
        if (userId) {
          localStorage.removeItem(`chatHistory-${userId}`);
        }
      });

      // On new message
      // @ts-ignore
      window.botpress.on("message", (message) => {
        setChatHistory((prev) => {
          const newHistory = [
            ...prev,
            {
              role: message.sender === "bot" ? "assistant" : "user",
              content: message.text,
              timestamp: new Date().toISOString(),
              conversationId: conversationIdRef.current,
            },
          ];
          const userId = localStorage.getItem("eduPathUserId");
          if (userId) {
            localStorage.setItem(
              `chatHistory-${userId}`,
              JSON.stringify(newHistory)
            );
          }
          return newHistory;
        });
      });
    }
  };

  const startRecording = useCallback(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support speech recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      // @ts-ignore
      if (window.botpress) {
        // @ts-ignore
        window.botpress.sendMessage(transcript);
      }
      setIsRecording(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
    setIsRecording(true);
  }, []);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  }, []);

  const clearHistory = useCallback(() => {
    const userId = localStorage.getItem("eduPathUserId");
    if (userId) {
      localStorage.removeItem(`chatHistory-${userId}`);
      setChatHistory([]);
    }
  }, []);

  const toggleHistory = useCallback(() => {
    setShowHistory((prev) => !prev);
  }, []);

  // Cleanup recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  return (
    <>
      <Script
        src="https://cdn.botpress.cloud/webchat/v3.2/inject.js"
        strategy="lazyOnload"
        onLoad={() => {
          console.log("Botpress script loaded");
          initBotpress();
        }}
      />

      <div className="relative w-screen h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex flex-col overflow-hidden">
        <SmokeBackground />
        <CursorGlow />
        <div
          id="webchat"
          className="w-full h-full rounded-lg shadow-lg bg-opacity-90 backdrop-blur-md"
          style={{
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(to bottom, rgba(0, 0, 0, 0.8), rgba(30, 30, 30, 0.9))",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        />

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
            <div className="text-white text-lg font-medium animate-pulse">
              Loading Chatbot...
            </div>
          </div>
        )}

        <div className="absolute top-4 left-4 flex items-center space-x-4">
          <img
            src="/placeholder-logo.svg"
            alt="EduPathAI Logo"
            className="w-10 h-10"
          />
          {showHistory && (
            <div className="mt-4 p-4 bg-gray-800 text-white rounded-lg shadow-lg max-h-96 overflow-y-auto">
              <h3 className="text-lg font-semibold mb-2">Chat History</h3>
              {chatHistory.length > 0 ? (
                <ul className="space-y-2">
                  {chatHistory.map((message, index) => (
                    <li key={index} className="p-2 bg-gray-700 rounded">
                      <span className="font-bold capitalize">
                        {message.role}:
                      </span>{" "}
                      {message.content}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">No chat history available.</p>
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        #webchat .bpWebchat {
          position: unset !important;
          width: 100% !important;
          height: 100% !important;
          max-height: 100% !important;
          max-width: 100% !important;
          border-radius: 12px !important;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3) !important;
        }
        #webchat .bpFab {
          display: none !important;
        }
        #back-home-btn:hover {
          background: linear-gradient(to right, #2563eb, #7c3aed) !important;
        }
      `}</style>
    </>
  );
}
