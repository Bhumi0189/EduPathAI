"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { ArrowLeft, History, Mic, MicOff, Sparkles, Trash2 } from "lucide-react";
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
          footer: "[by EduPathAI]",
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

      <div className="chat-page relative min-h-screen h-dvh bg-black flex flex-col overflow-hidden text-white">
        <SmokeBackground />
        <CursorGlow />
        <header className="chat-topbar">
          <button className="chat-brand" onClick={() => router.push("/")} aria-label="Back to home">
            <span className="chat-brand-mark"><Sparkles size={17} /></span>
            <span>EduPath <b>AI</b></span>
          </button>
          <div className="chat-title"><span className="chat-status-dot" /> EduPath AI Tutor <small>{loading ? "Connecting" : "Online"}</small></div>
          <div className="chat-actions">
            <button className="chat-icon-button" onClick={toggleHistory} aria-label="Toggle chat history" title="Chat history"><History size={16} /></button>
            <button className={`chat-icon-button ${isRecording ? "active" : ""}`} onClick={isRecording ? stopRecording : startRecording} aria-label={isRecording ? "Stop recording" : "Start voice input"} title={isRecording ? "Stop recording" : "Voice input"}>{isRecording ? <MicOff size={16} /> : <Mic size={16} />}</button>
            <button className="chat-icon-button danger" onClick={clearHistory} aria-label="Clear chat history" title="Clear history"><Trash2 size={16} /></button>
          </div>
        </header>
        <div
          id="webchat"
          className="chat-shell"
          style={{
            width: "100%",
            height: "calc(100% - 4.25rem)",
          }}
        />

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
            <div className="text-white text-lg font-medium animate-pulse">
              <Sparkles className="mx-auto mb-3 text-cyan-300" size={24} />
              Connecting to your AI tutor...
            </div>
          </div>
        )}

        <div className="absolute left-4 top-[4.7rem] z-40 flex items-start">
          {showHistory && (
            <div className="chat-history-panel">
              <h3><History size={15} /> Chat History</h3>
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
        .chat-page {
          background: radial-gradient(circle at 50% 15%, rgba(14, 116, 144, 0.16), transparent 34%), #03070d;
        }
        .chat-topbar {
          position: relative;
          z-index: 60;
          display: flex;
          height: 4.25rem;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(148, 163, 184, 0.14);
          padding: 0 1.25rem;
          background: rgba(3, 7, 13, 0.75);
          backdrop-filter: blur(18px);
        }
        .chat-brand, .chat-title, .chat-actions { display: inline-flex; align-items: center; }
        .chat-brand { gap: 0.55rem; color: white; font-size: 0.9rem; font-weight: 700; }
        .chat-brand b { color: #67e8f9; }
        .chat-brand-mark { display: inline-flex; height: 1.8rem; width: 1.8rem; align-items: center; justify-content: center; border: 1px solid rgba(103, 232, 249, 0.65); border-radius: 0.55rem; color: #67e8f9; background: rgba(34, 211, 238, 0.1); }
        .chat-title { gap: 0.5rem; color: #cbd5e1; font-size: 0.75rem; }
        .chat-title small { color: #64748b; font-size: 0.65rem; }
        .chat-status-dot { height: 0.42rem; width: 0.42rem; border-radius: 999px; background: #6ee7b7; box-shadow: 0 0 10px #6ee7b7; }
        .chat-actions { gap: 0.4rem; }
        .chat-icon-button { display: inline-flex; height: 2rem; width: 2rem; align-items: center; justify-content: center; border: 1px solid rgba(148, 163, 184, 0.18); border-radius: 0.55rem; color: #94a3b8; background: rgba(15, 23, 42, 0.45); transition: color 180ms ease, border 180ms ease, background 180ms ease; }
        .chat-icon-button:hover, .chat-icon-button.active { border-color: rgba(103, 232, 249, 0.5); color: #67e8f9; background: rgba(8, 47, 73, 0.55); }
        .chat-icon-button.danger:hover { border-color: rgba(251, 113, 133, 0.45); color: #fda4af; background: rgba(127, 29, 29, 0.25); }
        .chat-shell { position: relative; z-index: 10; margin: 0 auto; max-width: 1100px; border-right: 1px solid rgba(148, 163, 184, 0.12); border-left: 1px solid rgba(148, 163, 184, 0.12); background: transparent; }
        .chat-history-panel { width: min(21rem, calc(100vw - 2rem)); max-height: min(28rem, calc(100vh - 6rem)); overflow-y: auto; border: 1px solid rgba(103, 232, 249, 0.2); border-radius: 0.85rem; padding: 1rem; background: rgba(7, 16, 24, 0.94); box-shadow: 0 20px 60px rgba(0,0,0,0.35); backdrop-filter: blur(16px); }
        .chat-history-panel h3 { display: flex; align-items: center; gap: 0.45rem; margin-bottom: 0.75rem; color: white; font-size: 0.85rem; }
        .chat-history-panel ul { display: grid; gap: 0.5rem; }
        .chat-history-panel li { border: 1px solid rgba(148, 163, 184, 0.12); border-radius: 0.55rem; padding: 0.55rem; color: #cbd5e1; background: rgba(15, 23, 42, 0.65); font-size: 0.72rem; line-height: 1.45; }
        .chat-history-panel p { color: #64748b; font-size: 0.75rem; }
        #webchat,
        #webchat .bpWebchat,
        #webchat .bpWebchat-container,
        #webchat .bpWebchat-content {
          position: unset !important;
          width: 100% !important;
          height: 100% !important;
          max-height: 100% !important;
          max-width: 100% !important;
          border-radius: 0 !important;
          box-shadow: none !important;
          background: transparent !important;
        }
        #webchat .bpWebchat-viewport,
        #webchat .bpWebchat-body,
        #webchat .bpWebchat-messages,
        #webchat .bpWebchat-message-list,
        #webchat .bpWebchat-inner,
        #webchat .bpWebchat-scroll-container,
        #webchat .bpWebchat-conversation,
        #webchat main,
        #webchat section,
        #webchat [data-testid*="conversation" i],
        #webchat [data-testid*="message" i],
        #webchat [class*="viewport"],
        #webchat [class*="Viewport"],
        #webchat [class*="message-list"],
        #webchat [class*="MessageList"],
        #webchat [class*="scroll"],
        #webchat [class*="Scroll"] {
          background: transparent !important;
          background-color: transparent !important;
          box-shadow: none !important;
        }
        #webchat [class*="conversation"],
        #webchat [class*="Conversation"],
        #webchat [class*="container"],
        #webchat [class*="Container"] {
          background-color: transparent !important;
          box-shadow: none !important;
        }
        #webchat [style*="background"],
        #webchat [style*="background-color"] {
          background-color: transparent !important;
        }
        #webchat .bpFab {
          display: none !important;
        }
        @media (max-width: 640px) {
          .chat-topbar { padding: 0 0.75rem; }
          .chat-title { display: none; }
          .chat-brand { font-size: 0.8rem; }
        }
      `}</style>
    </>
  );
}
