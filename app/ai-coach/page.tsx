/// <reference path="../../types/globals.d.ts" />
"use client";

import React from 'react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { Activity, ArrowLeft, Mic2, Sparkles } from 'lucide-react';
import Vapi from '@vapi-ai/web';
import VoiceOrb from '../../components/VoiceOrb';

const enhancedBackgroundVariants: Variants = {
  initial: { backgroundPosition: '0% 50%' },
  animate: { backgroundPosition: ['0% 50%', '100% 50%'], transition: { duration: 15, repeat: Infinity, ease: 'linear' } },
};

export default function VoiceAssistantPage() {
  const [liveTranscript, setLiveTranscript] = React.useState<string>("");
  const [isCallActive, setIsCallActive] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const vapiRef = React.useRef<Vapi | null>(null);

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
    const vapi = new Vapi('0fa00c22-0391-456a-a959-7f2f44a0fc35');
    vapiRef.current = vapi;

    const handleCallStart = () => { setIsCallActive(true); setErrorMessage(""); };
    const handleCallEnd = () => setIsCallActive(false);
    const handleMessage = (message: any) => {
      if (message?.type !== 'transcript') return;
      const text = message?.transcript ?? message?.transcript?.text ?? message?.text ?? '';
      if (text) setLiveTranscript(normalizeTranscript(String(text), message?.transcriptType === 'final'));
    };
    const handleError = (error: unknown) => {
      console.error('Vapi call error:', error);
      setIsCallActive(false);
      setErrorMessage('Voice connection could not start. Check microphone permission and try again.');
    };

    vapi.on('call-start', handleCallStart);
    vapi.on('call-end', handleCallEnd);
    vapi.on('message', handleMessage);
    vapi.on('error', handleError);

    return () => {
      vapi.stop();
      vapi.removeAllListeners();
      vapiRef.current = null;
    };
  }, []);
  const clickStart = () => {
    const vapi = vapiRef.current;
    if (!vapi) return;
    setErrorMessage("");
    if (isCallActive) {
      vapi.stop();
      return;
    }
    void vapi.start('c67b1596-3884-4d84-9ac2-a8bb899bb631').catch((error) => {
      console.error('Unable to start Vapi:', error);
      setErrorMessage('Voice connection could not start. Check microphone permission and try again.');
    });
  };

  return (
    <motion.main
      className="coach-page relative h-dvh overflow-hidden px-4 py-3 text-white sm:px-6 sm:py-4 lg:px-10"
      variants={enhancedBackgroundVariants}
      initial="initial"
      animate="animate"
    >
      <VoiceOrb />

      <div className="coach-grid" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1180px] flex-col">
        <header className="flex shrink-0 items-center">
          <Link href="/" className="coach-ghost-button"><ArrowLeft size={15} /> Back to home</Link>
        </header>
        <section className="coach-hero shrink-0">
          <motion.div initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="coach-kicker"><Sparkles size={13} /> Neural voice workspace</p>
            <h1>Voice Chat <span className="coach-hero-inline-subtitle">x EduPath AI</span></h1>
          </motion.div>
        </section>

        <motion.section
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="coach-stage flex min-h-0 flex-1 flex-col"
        >
          <div className="coach-stage-glow" aria-hidden="true" />
          <div className="relative min-h-0 flex-1 p-2 pt-1 sm:p-3 sm:pt-1 lg:p-4 lg:pt-1">
            <div className="coach-widget-frame h-full">
              <div id="vapi" tabIndex={-1} className="vapi-host relative h-full w-full">
                <div className="voice-surface">
                  <div className="voice-surface-header">
                    <div className="voice-avatar"><Activity size={22} /></div>
                    <div><p>EDUPATHAI TUTOR</p><span>{isCallActive ? 'Connected • Listening now' : 'Ready when you are'}</span></div>
                  </div>
                  <div className="voice-surface-center">
                    <div className={`voice-pulse ${isCallActive ? 'is-active' : ''}`}><Mic2 size={34} /></div>
                    <p>{isCallActive ? 'I’m listening...' : 'Start a conversation'}</p>
                    <span>{isCallActive ? 'Speak naturally. Your tutor is ready.' : 'Tap the microphone to talk with your AI tutor.'}</span>
                  </div>
                  <button className={`voice-main-button ${isCallActive ? 'is-active' : ''}`} onClick={clickStart} aria-label={isCallActive ? 'End conversation' : 'Start conversation'}>
                    <Mic2 size={18} /> {isCallActive ? 'End conversation' : 'Start conversation'}
                  </button>
                  {errorMessage && <p className="voice-error" role="alert">{errorMessage}</p>}
                </div>
              </div>
            </div>
          </div>
          <div className="coach-session-row"><div className="flex items-center gap-2 text-xs text-slate-400"><Activity size={14} className="text-cyan-300" /> {liveTranscript || 'I’m listening, ...'}</div></div>
        </motion.section>
      </div>
    </motion.main>
  );
}