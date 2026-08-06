"use client";

import React from "react";
import Script from "next/script";

export default function VapiDemoPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-slate-950 text-slate-100">
      {/* Load the Vapi widget UMD script from unpkg (async, after hydration) */}
      <Script
        src="https://unpkg.com/@vapi-ai/client-sdk-react/dist/embed/widget.umd.js"
        strategy="afterInteractive"
      />

      <div className="w-full max-w-3xl">
        <h1 className="text-2xl font-bold">Vapi Voice Assistant</h1>
        <p className="mt-2 text-sm text-slate-300">
          This is a minimal embed. Click the start/mic button in the widget to begin.
        </p>

        <div className="mt-6 rounded-lg border border-slate-800 bg-slate-900/50 p-4">
          <vapi-widget
            public-key="0fa00c22-0391-456a-a959-7f2f44a0fc35"
            assistant-id="042e3cf1-21d5-4fde-934c-d67ed083527f"
            mode="voice"
            theme="dark"
            base-bg-color="hsl(222,84%,8%)"
            accent-color="hsl(214,32%,25%)"
            cta-button-color="hsl(214,32%,25%)"
            cta-button-text-color="hsl(var(--primary-foreground))"
            border-radius="var(--radius)"
            size="full"
            position="center"
            title="Vapi Voice Assistant"
            start-button-text="Start"
            end-button-text="End"
            chat-first-message="Welcome! How can I assist you today?"
            chat-placeholder="Type your question here..."
            voice-show-transcript="true"
            consent-required="true"
            consent-title="Terms and Conditions"
            consent-content="By clicking &quot;Agree,&quot; I consent to recording and processing as described in the Terms."
            consent-storage-key="vapi_widget_consent"
            style={{ width: '100%', display: 'block' }}
          />
        </div>
      </div>
    </main>
  );
}
