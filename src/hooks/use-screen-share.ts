import { useState, useCallback } from 'react';
import { startScreenShare as getDisplayMedia } from '../lib/webrtc';
import { isDemoMode } from '../lib/demo';

export function useScreenShare() {
  const [isSharing, setIsSharing] = useState(false);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const startShare = useCallback(async () => {
    if (isDemoMode()) {
      setIsSharing(true);
      return;
    }

    const stream = await getDisplayMedia();
    if (stream) {
      setRemoteStream(stream);
      setIsSharing(true);
      
      // Handle native stop (browser 'stop sharing' button)
      stream.getVideoTracks()[0].onended = () => {
        setIsSharing(false);
        setRemoteStream(null);
      };
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
