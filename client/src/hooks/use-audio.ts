import { useCallback } from "react";
import { audioManager } from "@/lib/audio";

export function useAudio() {
  const playPurchaseSound = useCallback(() => {
    audioManager.playPurchaseSound();
  }, []);

  const playWhisperSound = useCallback(() => {
    audioManager.playWhisperSound();
  }, []);

  const playGlitchSound = useCallback(() => {
    audioManager.playGlitchSound();
  }, []);

  return {
    playPurchaseSound,
    playWhisperSound,
    playGlitchSound,
  };
}
