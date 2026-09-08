import { useEffect, useState } from 'react';
import { useSignalR } from './use-signalr';
import { isDemoMode, startDemoReactions } from '../lib/demo';
import { useAuthStore } from '../stores/auth-store';

export interface ActiveReaction {
  id: string;
  emoji: string;
  x: number;
  userId: string;
  avatar?: string;
}

export function useReactions(roomId: string) {
  const [activeReactions, setActiveReactions] = useState<ActiveReaction[]>([]);
  const signalr = useSignalR(roomId);
  const { user } = useAuthStore();

  const addReaction = (emoji: string, userId: string, avatar?: string) => {
    const newReaction = {
      id: `${Date.now()}-${Math.random()}`,
      emoji,
      x: 10 + Math.random() * 80, // Random percentage between 10 and 90
      userId,
      avatar
    };

    setActiveReactions(prev => [...prev, newReaction]);

    setTimeout(() => {
      setActiveReactions(prev => prev.filter(r => r.id !== newReaction.id));
    }, 3000); // Remove after 3s matching float animation duration
  };

  useEffect(() => {
    if (isDemoMode()) {
      return startDemoReactions((emoji, rUser) => addReaction(emoji, rUser.id, rUser.avatar));
    }

    const onReaction = (data: any) => addReaction(data.emoji, data.userId, data.avatarUrl);
    signalr.on('ReactionReceived', onReaction);
    return () => signalr.off('ReactionReceived', onReaction);
  }, [roomId, signalr]);

  const sendReaction = async (emoji: string) => {
    addReaction(emoji, user?.id || 'me', user?.avatarUrl);
    if (!isDemoMode()) {
      await signalr.invoke('SendReaction', roomId, emoji);
    }
  };

  return { activeReactions, sendReaction };
}
