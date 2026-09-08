import { formatRelativeTime } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function ChatMessage({ message }: { message: any }) {
  if (message.type === 'System' || message.isSystem) {
    return (
      <div className="text-center text-xs text-slate-500 italic my-2">
        {message.content}
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3 group hover:bg-white/5 p-2 -mx-2 rounded-lg transition-colors"
    >
      <img src={message.avatar || message.avatarUrl} alt="" className="w-8 h-8 rounded-full bg-surface-lighter flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-0.5">
          <span className="font-medium text-sm text-primary">{message.displayName}</span>
          <span className="text-[10px] text-slate-500">{formatRelativeTime(message.createdAt || message.timestamp)}</span>
        </div>
        <p className="text-sm text-slate-200 break-words leading-relaxed">{message.content}</p>
      </div>
    </motion.div>
  );
}
