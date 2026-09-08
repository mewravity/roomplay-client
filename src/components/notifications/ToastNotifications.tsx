import toast from 'react-hot-toast';
import { UserPlus, UserMinus, Play, Pause } from 'lucide-react';

export const showNotification = (type: 'join' | 'leave' | 'play' | 'pause' | 'general', message: string) => {
  const IconMap = {
    join: <UserPlus className="w-4 h-4 text-green-400" />,
    leave: <UserMinus className="w-4 h-4 text-red-400" />,
    play: <Play className="w-4 h-4 text-cyan-400" />,
    pause: <Pause className="w-4 h-4 text-amber-400" />,
    general: null
  };

  toast(
    <div className="flex items-center gap-3">
      {IconMap[type]}
      <span className="text-sm font-medium text-slate-200">{message}</span>
    </div>,
    {
      style: {
        background: '#1e1e36',
        border: '1px solid rgba(255,255,255,0.1)',
        color: '#fff',
        borderRadius: '12px',
        padding: '12px 16px',
      },
      duration: 3000,
    }
  );
};
