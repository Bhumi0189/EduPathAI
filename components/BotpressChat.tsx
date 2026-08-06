"use client";

import { useEffect } from "react";
import Script from "next/script";

export default function BotpressChat() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const check = setInterval(() => {
        // @ts-ignore
        if (window.botpressWebChat) {
          clearInterval(check);

          try {
            // @ts-ignore
            window.botpressWebChat.init({
              botId: "5c5d17ec-e7ef-44c0-b68d-594213d25fb6",
              clientId: "27a3c573-4405-457d-9542-31eab03d37e6",
              hostUrl: "https://cdn.botpress.cloud/webchat/v3",
              messagingUrl: "https://messaging.botpress.cloud",
              selector: "#webchat",
              showPoweredBy: false,
              containerWidth: "100%",
              containerHeight: "100%",
              botName: "EduPathAi",
              botDescription: "- Your Smart Learning Companion",
              theme: {
                color: "#b76599",
                variant: "solid",
                header: { style: "solid" },
                layout: { embedded: true },
                themeMode: "dark",
                radius: 8,
                fontFamily: "Inter, sans-serif",
              },
              stylesheet:
                "https://files.bpcontent.cloud/2025/08/21/17/20250821171423-3VJYR6PN.css",
            });
          } catch (err) {
            console.error("❌ Botpress init failed:", err);
          }
        }
      }, 500);

      return () => clearInterval(check);
    }
  }, []);

  return (
    <>
      {/* Botpress Inject Script */}
      <Script
        src="https://cdn.botpress.cloud/webchat/v3.2/inject.js"
        strategy="beforeInteractive"
      />

      {/* Fullscreen Layout */}
      <div className="flex flex-col w-screen h-screen bg-black text-white">
        {/* Navbar */}
        <header className="w-full p-4 border-b border-gray-800 flex items-center justify-between bg-[#111]">
          <h1 className="text-lg font-bold tracking-wide">⚡ EduPath AI</h1>
          <span className="text-sm opacity-70">
            Your Smart Learning Companion
          </span>
        </header>

        {/* Chat Area */}
        <main className="flex-1">
          <div id="webchat" className="w-full h-full" />
        </main>
      </div>
    </>
  );
}
