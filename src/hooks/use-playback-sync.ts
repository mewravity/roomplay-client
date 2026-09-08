import { useEffect } from 'react';
import { useRoomStore } from '../stores/room-store';
import { useSignalR } from './use-signalr';
import { isDemoMode } from '../lib/demo';

export function usePlaybackSync(roomId: string) {
  const { playbackState, setPlaybackState } = useRoomStore();
  const signalr = useSignalR(roomId);

  useEffect(() => {
    if (isDemoMode()) {
      let isPlaying = true;
      let time = 0;
      const interval = setInterval(() => {
        if (isPlaying) time += 1;
        setPlaybackState({ isPlaying, currentTime: time, updatedAt: new Date().toISOString(), speed: 1 });
      }, 1000);
      return () => clearInterval(interval);
    }

    const onUpdate = (state: any) => setPlaybackState(state);
    signalr.on('PlaybackUpdate', onUpdate);
    return () => signalr.off('PlaybackUpdate', onUpdate);
  }, [roomId, signalr, setPlaybackState]);

  const sync = (state: any) => {
    setPlaybackState(state);
    if (!isDemoMode()) signalr.invoke('UpdatePlayback', roomId, state);
  };

  return { playbackState, sync };
}
