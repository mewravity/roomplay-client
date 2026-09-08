import { useState, useCallback } from 'react';

export function useVideoChat() {
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);

  const enableVideo = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setIsVideoEnabled(true);
      return stream;
    } catch (e) {
      console.error('Camera access failed:', e);
      return null;
    }
  }, []);

  const disableVideo = useCallback(() => {
    setIsVideoEnabled(false);
  }, []);

  return { isVideoEnabled, enableVideo, disableVideo };
}
