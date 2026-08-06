/// <reference path="../../types/globals.d.ts" />
"use client";

import React from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { motion, Variants } from 'framer-motion';
import { SmokeBackground } from '../components/smoke-background';
import { CursorGlow } from '../components/cursor-glow';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'vapi-widget': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        'public-key': string;
        'assistant-id': string;
        [key: string]: any;
      };
    }
  }
}

const enhancedBackgroundVariants: Variants = {
  initial: { backgroundPosition: '0% 50%' },
  animate: { backgroundPosition: ['0% 50%', '100% 50%'], transition: { duration: 15, repeat: Infinity, ease: 'linear' } },
};

export default function VoiceAssistantPage() {
  const [liveTranscript, setLiveTranscript] = React.useState<string>("");

  const normalizeTranscript = (text: string, finalize = false) => {
    try {
      let t = text || "";
      // basic cleanup
      t = t.replace(/\s+/g, " ").trim();
      // remove common fillers
      t = t.replace(/\b(um+|uh+|erm|hmm)\b/gi, "");
      t = t.replace(/\s{2,}/g, " ").trim();
      // quick contractions
      t = t.replace(/\bim\b/gi, "I'm");
      t = t.replace(/\bdont\b/gi, "don't");
      t = t.replace(/\bcant\b/gi, "can't");
      t = t.replace(/\bwont\b/gi, "won't");
      t = t.replace(/\bive\b/gi, "I've");
      t = t.replace(/\bill\b/gi, "I'll");
      t = t.replace(/\bid\b/gi, "I'd");
      // Capitalize standalone i
      t = t.replace(/(^|\s)i(\s|$)/g, (_, p1, p2) => `${p1}I${p2}`);
      // sentence case for first letter
      if (t.length > 0) t = t[0].toUpperCase() + t.slice(1);
      // finalize punctuation
      if (finalize) {
        if (!/[.!?]$/.test(t)) t += ".";
      }
      return t;
    } catch {
      return text;
    }
  };

  React.useEffect(() => {
    const host = document.getElementById('vapi');
    const widget = host?.querySelector('vapi-widget') as HTMLElement | null;
    if (!widget) return;

    const handlePartial = (e: any) => {
      const raw = e?.detail?.text ?? e?.detail ?? "";
      setLiveTranscript(normalizeTranscript(String(raw), false));
    };
    const handleFinal = (e: any) => {
      const raw = e?.detail?.text ?? e?.detail ?? "";
      setLiveTranscript(normalizeTranscript(String(raw), true));
    };

    widget.addEventListener('vapi-transcript', handlePartial as any);
    widget.addEventListener('vapi-transcript-final', handleFinal as any);
    widget.addEventListener('transcript', handlePartial as any);
    widget.addEventListener('transcript-final', handleFinal as any);

    return () => {
      widget.removeEventListener('vapi-transcript', handlePartial as any);
      widget.removeEventListener('vapi-transcript-final', handleFinal as any);
      widget.removeEventListener('transcript', handlePartial as any);
      widget.removeEventListener('transcript-final', handleFinal as any);
    };
  }, []);
  const clickStart = () => {
    try {
      const host = document.getElementById('vapi');
      if (!host) return;
      const widget = host.querySelector('vapi-widget') as HTMLElement | null;
      const root = (widget ?? host) as HTMLElement;

      // Attempt programmatic start on the web component if it exposes methods or listens to events
      try {
        const api = widget as unknown as Record<string, any> | null;
        if (api) {
          const methodCandidates = ['start', 'startCall', 'startVoice', 'open', 'activate', 'startSession', 'toggle', 'show'];
          for (const m of methodCandidates) {
            if (typeof api[m] === 'function') { api[m](); return; }
          }
          const eventCandidates = ['vapi-start', 'start', 'open', 'activate', 'start-call', 'start-voice'];
          for (const ev of eventCandidates) { widget?.dispatchEvent(new CustomEvent(ev, { bubbles: true, composed: true })); }
        }
      } catch {}
      const selectors = [
        'button[data-testid*="start"]',
        'button[aria-label*="start"]',
        'button[aria-label*="microphone"]',
        'button[aria-label*="mic"]',
        'button.start',
        '.vapi-start',
        '.start-button',
        '.mic-button',
        'button',
        '[role="button"]',
      ];
      // Try inside shadow DOM first (if available)
      try {
        const sr = (widget as any)?.shadowRoot as ShadowRoot | undefined;
        if (sr) {
          for (const sel of selectors) {
            const el = sr.querySelector(sel) as HTMLElement | null;
            if (el) {
              el.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, cancelable: true, composed: true }));
              el.dispatchEvent(new MouseEvent('pointerup', { bubbles: true, cancelable: true, composed: true }));
              el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, composed: true }));
              return;
            }
          }
        }
      } catch {}

      // Then try light DOM
      for (const sel of selectors) {
        const el = root.querySelector(sel) as HTMLElement | null;
        if (el) {
          el.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, cancelable: true, composed: true }));
          el.dispatchEvent(new MouseEvent('pointerup', { bubbles: true, cancelable: true, composed: true }));
          el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, composed: true }));
          return;
        }
      }
      const rect = root.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2 + 40;
      const target = document.elementFromPoint(cx, cy) as HTMLElement | null;
      target?.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, cancelable: true, composed: true }));
      target?.dispatchEvent(new MouseEvent('pointerup', { bubbles: true, cancelable: true, composed: true }));
      target?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, composed: true }));
    } catch {}
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-[hsl(222,84%,3%)] to-[hsl(214,32%,15%)] text-[hsl(var(--primary-foreground))] flex items-center justify-center p-6 relative overflow-hidden"
      variants={enhancedBackgroundVariants}
      initial="initial"
      animate="animate"
    >
      <SmokeBackground />
      <CursorGlow />

      <div className="z-10 w-full max-w-6xl">
        <div className="mb-4 flex">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[rgba(255,255,255,0.12)] text-slate-200 hover:bg-[rgba(255,255,255,0.06)] transition"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Home
          </Link>
        </div>
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="text-center mb-8 md:mb-12"
        >
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 drop-shadow-lg">
            AI Coach Assistant
          </h1>
          <p className="mt-3 text-sm md:text-base text-slate-300 max-w-2xl mx-auto">
            Talk to your AI coach .
          </p>
        </motion.div>

        <motion.div
          className="relative overflow-hidden bg-[rgba(14,21,36,0.55)] backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-2xl border border-[rgba(255,255,255,0.04)]"
          style={{ perspective: 1200 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-5 lg:col-span-4 space-y-4">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold">Speak. Learn. Improve.</h2>
              <p className="text-sm md:text-base text-slate-300">This is your smart learning companion.</p>
              <div className="mt-5">
                <button
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-[#6EE7B7] to-[#3B82F6] text-slate-900 font-semibold shadow-lg transform hover:-translate-y-0.5 transition"
                  onClick={() => {
                    const el = document.getElementById('vapi');
                    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    setTimeout(() => clickStart(), 400);
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 1v22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Start a session
                </button>
              </div>
            </div>

            <div className="md:col-span-7 lg:col-span-8">
              <div className="bg-gradient-to-br from-[rgba(255,255,255,0.02)] to-[rgba(255,255,255,0.01)] rounded-xl p-3 md:p-4 shadow-inner border border-[rgba(255,255,255,0.03)] min-h-[560px] md:min-h-[620px] flex flex-col items-start justify-start py-4 gap-3">
                <div id="vapi" tabIndex={-1} className="w-full h-[65vh] md:h-[70vh] vapi-host relative overflow-hidden">
                  <Script src="https://unpkg.com/@vapi-ai/client-sdk-react/dist/embed/widget.umd.js" strategy="afterInteractive" />
                  <vapi-widget
                    public-key="0fa00c22-0391-456a-a959-7f2f44a0fc35"
                    assistant-id="042e3cf1-21d5-4fde-934c-d67ed083527f"
                    mode="voice"
                    theme="dark"
                    lang="en-US"
                    voice-transcript-language="en-US"
                    base-bg-color="hsl(222,84%,8%)"
                    accent-color="hsl(214,32%,25%)"
                    cta-button-color="hsl(214,32%,25%)"
                    cta-button-text-color="hsl(var(--primary-foreground))"
                    border-radius="var(--radius)"
                    size="full"
                    position="center"
                    title="TALK WITH AI COACH"
                    start-button-text="Click to Start Coaching"
                    end-button-text="End Coaching"
                    chat-first-message="Welcome! How can I assist you today?"
                    chat-placeholder="Type your question here..."
                    voice-show-transcript="true"
                    consent-required="true"
                    consent-title="Terms and Conditions"
                    consent-content="By clicking &quot;Agree,&quot; and each time I interact with this AI agent, I consent to the recording, storage, and sharing of my communications with third-party service providers, and as otherwise described in our Terms of Service."
                    consent-storage-key="vapi_widget_consent"
                    style={{ width: '100%', height: '100%', display: 'block', position: 'relative' as any, zIndex: 60 }}
                  />
                </div>
                
                <div className="w-full flex justify-center pt-2">
                  <button
                    onClick={clickStart}
                    className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-semibold shadow-lg hover:scale-105 transition-transform"
                  >
                    Start coaching
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}