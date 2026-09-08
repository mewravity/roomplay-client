import { useState, useCallback } from 'react';
import { isDemoMode } from '../lib/demo';

export function useVoiceChat() {
  const [isInVoice, setIsInVoice] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const joinVoice = useCallback(() => {
    if (isDemoMode()) {
      setIsInVoice(true);
      setIsMuted(false);
      return;
    }
    // WebRTC logic would go here
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
