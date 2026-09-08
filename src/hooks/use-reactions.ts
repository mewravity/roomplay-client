import { useEffect, useState } from 'react';
import { useSignalR } from './use-signalr';
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
      x: 10 + Math.random() * 80,
      userId,
      avatar
    };
    setActiveReactions(prev => [...prev, newReaction]);
    setTimeout(() => {
      setActiveReactions(prev => prev.filter(r => r.id !== newReaction.id));
    }, 3000);
  };

  useEffect(() => {
    // Hub sends: ReactionReceived(userId, username, emoji)
    const onReaction = (userId: string, username: string, emoji: string) => {
      addReaction(emoji, userId);
    };
    signalr.on('ReactionReceived', onReaction);
    return () => signalr.off('ReactionReceived', onReaction);
  }, [roomId, signalr]);

  const sendReaction = async (emoji: string) => {
    addReaction(emoji, user?.id || 'me', user?.avatarUrl || user?.avatar);
    await signalr.invoke('SendReaction', roomId, emoji);
  };

  return { activeReactions, sendReaction };
}
