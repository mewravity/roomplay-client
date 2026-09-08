import { useEffect } from 'react';
import { useRoomStore } from '../stores/room-store';
import { useSignalR } from './use-signalr';
import { isDemoMode, demoMessages, startDemoChat } from '../lib/demo';
import { useAuthStore } from '../stores/auth-store';

export function useChat(roomId: string) {
  const { messages, setMessages, addMessage } = useRoomStore();
  const { user } = useAuthStore();
  const signalr = useSignalR(roomId);

  useEffect(() => {
    if (isDemoMode()) {
      setMessages(demoMessages as any);
      return startDemoChat(msg => addMessage(msg as any));
    }

    const onMessage = (msg: any) => addMessage(msg);
    signalr.on('NewMessage', onMessage);
    return () => signalr.off('NewMessage', onMessage);
  }, [roomId, signalr, setMessages, addMessage]);

  const sendMessage = async (content: string, replyToId?: string) => {
    if (isDemoMode()) {
      addMessage({
        id: `msg-${Date.now()}`,
        roomId,
        userId: user?.id || 'demo-user',
        displayName: user?.displayName || 'You',
        avatarUrl: user?.avatarUrl,
        content,
        timestamp: new Date().toISOString(),
        isSystem: false,
        replyToId
      });
      return;
    }
    await signalr.invoke('SendMessage', roomId, content, replyToId);
  };

  return { messages, sendMessage };
}
