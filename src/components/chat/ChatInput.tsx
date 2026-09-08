import { useState } from 'react';
import { SendHorizontal, Smile } from 'lucide-react';

export default function ChatInput({ onSend }: { onSend: (msg: string) => void }) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center bg-black/20 rounded-lg border border-white/10 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all">
      <button type="button" className="pl-3 pr-2 text-slate-400 hover:text-white">
        <Smile className="w-5 h-5" />
      </button>
      <input 
        type="text" 
        value={text} 
        onChange={e => setText(e.target.value)} 
        placeholder="Send a message..." 
        className="flex-1 bg-transparent border-none focus:outline-none text-sm py-3 text-white placeholder-slate-500"
      />
      <button type="submit" disabled={!text.trim()} className="pr-3 pl-2 text-primary disabled:text-slate-600 disabled:cursor-not-allowed">
        <SendHorizontal className="w-5 h-5" />
      </button>
    </form>
  );
}
