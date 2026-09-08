import { useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChat } from '@/hooks/use-chat';
import { useUIStore } from '@/stores/ui-store';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

export default function ChatPanel({ roomId }: { roomId: string }) {
  const { toggleChat } = useUIStore();
  const { messages, sendMessage } = useChat(roomId);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full w-full bg-surface border-l border-white/10">
      <div className="flex items-center justify-between p-4 border-b border-white/10 h-14">
        <h3 className="font-semibold">Chat</h3>
        <button onClick={toggleChat} className="text-slate-400 hover:text-white sm:hidden"><X className="w-5 h-5" /></button>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <ChatMessage key={msg.id || i} message={msg} />
          ))}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-white/10 bg-surface/50 backdrop-blur">
        <ChatInput onSend={sendMessage} />
      </div>
    </div>
  );
}
