"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface SpeechSynthesisOptions {
  pitch?: number;
  rate?: number;
  voiceURI?: string;
  volume?: number;
}

export function useSpeechSynthesis() {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const supported = typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
    setIsSupported(supported);

    if (!supported) {
      return;
    }

    function loadVoices() {
      setVoices(window.speechSynthesis.getVoices());
    }

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const stop = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    setIsSpeaking(false);
  }, []);

  const speak = useCallback(
    (text: string, options: SpeechSynthesisOptions = {}) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
        setIsSupported(false);
        return;
      }

      const trimmedText = text.trim();
      if (!trimmedText) {
        return;
      }

      stop();

      const utterance = new SpeechSynthesisUtterance(trimmedText);
      const selectedVoice = voices.find((voice) => voice.voiceURI === options.voiceURI);
      utterance.voice = selectedVoice ?? null;
      utterance.rate = options.rate ?? 0.92;
      utterance.pitch = options.pitch ?? 1;
      utterance.volume = options.volume ?? 1;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [stop, voices]
  );

  useEffect(() => {
    return () => stop();
  }, [stop]);

  return {
    speak,
    stop,
    isSpeaking,
    isSupported,
    voices
  };
}
