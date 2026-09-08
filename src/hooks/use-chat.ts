import { useEffect } from 'react';
import { useRoomStore } from '../stores/room-store';
import { useSignalR } from './use-signalr';
import { useAuthStore } from '../stores/auth-store';

export function useChat(roomId: string) {
  const { messages, setMessages, addMessage } = useRoomStore();
  const { user } = useAuthStore();
  const signalr = useSignalR(roomId);

  useEffect(() => {
    const onMessage = (msg: any) => addMessage(msg);
    signalr.on('NewMessage', onMessage);
    return () => signalr.off('NewMessage', onMessage);
  }, [roomId, signalr, addMessage]);

  const sendMessage = async (content: string, replyToId?: string) => {
    await signalr.invoke('SendMessage', roomId, content, replyToId);
  };

  // Local echo for optimistic send
  const sendLocal = (content: string) => {
    addMessage({
      id: `local-${Date.now()}`,
      roomId,
      userId: user?.id || 'me',
      displayName: user?.displayName || 'You',
      avatar: user?.avatarUrl || user?.avatar || '',
      content,
      type: 'User',
      createdAt: new Date().toISOString(),
      isSystem: false,
      isLocal: true,
    });
  };

  return { messages, sendMessage, sendLocal };
}
