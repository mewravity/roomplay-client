import { AnimatePresence, motion } from 'framer-motion';
import { useReactions } from '@/hooks/use-reactions';

export default function FloatingReactions({ roomId }: { roomId: string }) {
  const { activeReactions } = useReactions(roomId);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      <AnimatePresence>
        {activeReactions.map(r => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: '90%', scale: 0.5, x: `${r.x}%` }}
            animate={{ opacity: [0, 1, 1, 0], y: '10%', scale: [0.5, 1.2, 1, 0.8], x: `${r.x + (Math.random() * 10 - 5)}%` }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.5, ease: 'easeOut' }}
            className="absolute text-4xl drop-shadow-lg"
          >
            {r.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
