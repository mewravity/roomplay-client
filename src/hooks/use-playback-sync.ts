import { useEffect } from 'react';
import { useRoomStore } from '../stores/room-store';
import { useSignalR } from './use-signalr';

export function usePlaybackSync(roomId: string) {
  const { playbackState, setPlaybackState } = useRoomStore();
  const signalr = useSignalR(roomId);

  useEffect(() => {
    const onUpdate = (state: any) => {
      if (!state) return;
      setPlaybackState({
        isPlaying: !!state.isPlaying,
        currentTime: state.currentTime || 0,
        updatedAt: state.lastUpdated || new Date().toISOString(),
        speed: state.playbackRate || 1,
        mediaUrl: state.mediaUrl || undefined,
        mediaTitle: state.mediaTitle || undefined,
        screenShareUserId: state.screenShareUserId || null,
      });
    };
    signalr.on('PlaybackUpdate', onUpdate);
    signalr.on('SyncState', onUpdate);
    return () => {
      signalr.off('PlaybackUpdate', onUpdate);
      signalr.off('SyncState', onUpdate);
    };
  }, [roomId, signalr, setPlaybackState]);

  const sync = async (state: any) => {
    setPlaybackState(state);
    // Hub has Play/Pause/Seek/ChangePlaybackRate — send intent-based calls
    const wasPlaying = playbackState.isPlaying;
    const wasTime = playbackState.currentTime;
    try {
      if (state.isPlaying && !wasPlaying) {
        await signalr.invoke('Play', roomId, state.currentTime || 0);
      } else if (!state.isPlaying && wasPlaying) {
        await signalr.invoke('Pause', roomId, state.currentTime || 0);
      } else if (Math.abs((state.currentTime || 0) - (wasTime || 0)) > 1.5) {
        await signalr.invoke('Seek', roomId, state.currentTime || 0);
      } else {
        await signalr.invoke('ChangePlaybackRate', roomId, state.speed || 1);
      }
    } catch (e) {
      // ignore — e.g. not host & no permission
    }
  };

  return { playbackState, sync };
}
