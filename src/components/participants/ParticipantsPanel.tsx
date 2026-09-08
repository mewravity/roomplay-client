import { X, Mic, MicOff, Crown, Shield } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUIStore } from '@/stores/ui-store';
import { useRoomStore } from '@/stores/room-store';
import { useAuth } from '@/hooks/use-auth';

export default function ParticipantsPanel({ roomId }: { roomId: string }) {
  const { toggleParticipants } = useUIStore();
  const { members } = useRoomStore();
  const { user: me } = useAuth();

  const allMembers = [...members];
  const meInList = allMembers.some(m => m.userId === me?.id);
  const host = allMembers.find(m => m.role === 'Host');

  // Ensure current user appears (server may not include yet)
  const users = meInList ? allMembers : [
    ...allMembers,
    {
      id: me?.id || 'me',
      userId: me?.id || 'me',
      displayName: me?.displayName || 'You',
      avatar: me?.avatarUrl || me?.avatar || '',
      role: host?.userId === me?.id ? 'Host' : 'Member',
      isOnline: true,
    },
  ];

  return (
    <div className="flex flex-col h-full w-full bg-surface border-l border-white/10">
      <div className="flex items-center justify-between p-4 border-b border-white/10 h-14">
        <h3 className="font-semibold">Participants ({users.length})</h3>
        <button onClick={toggleParticipants} className="text-slate-400 hover:text-white sm:hidden"><X className="w-5 h-5" /></button>
      </div>
      
      <ScrollArea className="flex-1 p-2">
        {users.length === 0 ? (
          <div className="text-center py-10 text-sm text-slate-500">No participants yet</div>
        ) : (
        <div className="space-y-1">
          {users.map((u: any, i) => (
            <div key={u.userId || i} className="flex items-center justify-between p-2 hover:bg-white/5 rounded-lg group">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img src={u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.displayName || u.username || 'u'}`} alt="" className="w-8 h-8 rounded-full bg-surface-lighter" />
                  <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-surface ${u.isOnline ? 'bg-green-500' : 'bg-slate-500'}`}></div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-slate-200">{u.displayName}{u.userId === me?.id && <span className="text-slate-500"> (you)</span>}</span>
                    {u.role === 'Host' && <Crown className="w-3 h-3 text-amber-400" />}
                    {u.role === 'Mod' && <Shield className="w-3 h-3 text-blue-400" />}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                {u.isOnline ? <Mic className="w-4 h-4 text-green-400" /> : <MicOff className="w-4 h-4 text-red-400" />}
              </div>
            </div>
          ))}
        </div>
        )}
      </ScrollArea>
    </div>
  );
}
