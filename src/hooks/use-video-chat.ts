import { useState, useCallback } from 'react';
import { isDemoMode } from '../lib/demo';

export function useVideoChat() {
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);

  const enableVideo = useCallback(() => {
    if (isDemoMode()) {
      setIsVideoEnabled(true);
      return;
    }
    setIsVideoEnabled(true);
  }, []);

  const disableVideo = useCallback(() => {
    setIsVideoEnabled(false);
  }, []);

  return { isVideoEnabled, enableVideo, disableVideo };
}
