// hooks/useVoiceAssistant.ts
import { useState, useRef, useCallback } from 'react';

export const useVoiceAssistant = () => {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const initializeSpeechRecognition = useCallback(() => {
    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-US";
      
      recognitionRef.current = recognition;
      return true;
    }
    return false;
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current) {
      setListening(true);
      recognitionRef.current.start();
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && listening) {
      recognitionRef.current.stop();
      setListening(false);
    }
  }, [listening]);

  return {
    listening,
    initializeSpeechRecognition,
    startListening,
    stopListening,
    recognitionRef
  };
};