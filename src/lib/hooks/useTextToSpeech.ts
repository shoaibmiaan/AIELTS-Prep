// src/hooks/useTextToSpeech.ts

import { useCallback } from 'react';

const useTextToSpeech = () => {
  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  }, []);

  return speak;
};

export default useTextToSpeech;
