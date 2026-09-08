import { X, Mic, MicOff, Video, Crown, Shield } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUIStore } from '@/stores/ui-store';
import { demoUsers } from '@/lib/demo';

export default function ParticipantsPanel({ roomId }: { roomId: string }) {
  const { toggleParticipants } = useUIStore();
  const users = [...demoUsers, { ...demoUsers[0], id: 'me', displayName: 'You (Host)', role: 'Host' }];

  return (
    <div className="flex flex-col h-full w-full bg-surface border-l border-white/10">
      <div className="flex items-center justify-between p-4 border-b border-white/10 h-14">
        <h3 className="font-semibold">Participants ({users.length})</h3>
        <button onClick={toggleParticipants} className="text-slate-400 hover:text-white sm:hidden"><X className="w-5 h-5" /></button>
      </div>
      
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-1">
          {users.map((u: any, i) => (
            <div key={i} className="flex items-center justify-between p-2 hover:bg-white/5 rounded-lg group">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img src={u.avatar} alt="" className="w-8 h-8 rounded-full bg-surface-lighter" />
                  <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-surface ${u.isOnline ? 'bg-green-500' : 'bg-slate-500'}`}></div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-slate-200">{u.displayName}</span>
                    {u.role === 'Host' && <Crown className="w-3 h-3 text-amber-400" />}
                    {u.role === 'Mod' && <Shield className="w-3 h-3 text-blue-400" />}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                {u.isOnline ? <Mic className="w-4 h-4 text-green-400" /> : <MicOff className="w-4 h-4 text-red-400" />}
                {i % 2 === 0 && <Video className="w-4 h-4" />}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
