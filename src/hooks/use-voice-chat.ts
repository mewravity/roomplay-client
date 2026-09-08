import { useState, useCallback } from 'react';

export function useVoiceChat() {
  const [isInVoice, setIsInVoice] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const joinVoice = useCallback(() => {
    setIsInVoice(true);
    setIsMuted(false);
  }, []);

  const leaveVoice = useCallback(() => {
    setIsInVoice(false);
    setIsMuted(true);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  return { isInVoice, isMuted, joinVoice, leaveVoice, toggleMute };
}
