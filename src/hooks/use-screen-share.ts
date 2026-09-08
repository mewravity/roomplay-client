import { useState, useCallback } from 'react';

export function useScreenShare() {
  const [isSharing, setIsSharing] = useState(false);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const startShare = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
      setRemoteStream(stream);
      setIsSharing(true);
      stream.getVideoTracks()[0].onended = () => {
        setIsSharing(false);
        setRemoteStream(null);
      };
    } catch (e) {
      console.error('Screen share cancelled/failed:', e);
    }
  }, []);

  const stopShare = useCallback(() => {
    if (remoteStream) {
      remoteStream.getTracks().forEach(t => t.stop());
      setRemoteStream(null);
    }
    setIsSharing(false);
  }, [remoteStream]);

  return { isSharing, remoteStream, startShare, stopShare };
}
