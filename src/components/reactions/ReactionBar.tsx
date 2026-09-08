import { demoReactions } from '@/lib/demo';

export default function ReactionBar({ onSelect }: { onSelect: (emoji: string) => void }) {
  return (
    <div className="bg-[#1a1a2e] border border-white/10 p-2 rounded-xl shadow-xl flex flex-wrap gap-1 w-[200px]">
      {demoReactions.map(emoji => (
        <button
          key={emoji}
          onClick={() => onSelect(emoji)}
          className="w-8 h-8 flex items-center justify-center text-xl hover:bg-white/10 rounded transition-colors"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}
