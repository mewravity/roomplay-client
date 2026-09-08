import { useNavigate } from 'react-router-dom';
import { Users, Lock } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function RoomCard({ room }: { room: any }) {
  const navigate = useNavigate();

  return (
    <motion.div 
      whileHover={{ y: -4, scale: 1.02 }}
      className="bg-surface rounded-xl border border-white/5 overflow-hidden cursor-pointer group shadow-lg"
      onClick={() => navigate(`/room/${room.id}/join`)}
    >
      <div className="h-32 bg-gradient-to-br from-violet-900/60 to-cyan-900/60 relative">
        <div className="absolute top-2 left-2 px-2 py-1 rounded bg-black/50 backdrop-blur-md text-xs font-medium text-white border border-white/10">
          {room.category}
        </div>
        {room.privacy === 'Private' && (
          <div className="absolute top-2 right-2 w-6 h-6 rounded bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/10">
            <Lock className="w-3 h-3 text-white" />
          </div>
        )}
        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
          <span className="bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">Join Room</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-white truncate">{room.name}</h3>
        {room.description && <p className="text-sm text-slate-400 mt-1 line-clamp-1">{room.description}</p>}
        <div className="flex items-center justify-between mt-4 text-xs text-slate-400">
          <div className="flex items-center gap-1"><Users className="w-3 h-3" /> {room.memberCount}</div>
          <div>{formatRelativeTime(room.lastActiveAt)}</div>
        </div>
      </div>
    </motion.div>
  );
}
