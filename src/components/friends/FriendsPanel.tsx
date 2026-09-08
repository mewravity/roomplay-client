import { Search, UserPlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { demoUsers } from '@/lib/demo';

export default function FriendsPanel() {
  const online = demoUsers.filter(u => u.isOnline);
  const offline = demoUsers.filter(u => !u.isOnline);

  return (
    <div className="bg-surface rounded-xl border border-white/10 overflow-hidden flex flex-col h-[600px]">
      <div className="p-4 border-b border-white/10">
        <h2 className="font-bold text-lg flex items-center justify-between">
          Friends
          <Button variant="ghost" size="icon" className="w-8 h-8"><UserPlus className="w-4 h-4"/></Button>
        </h2>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <Input placeholder="Search friends..." className="pl-9 bg-black/20 border-white/10 h-9 text-sm" />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Online — {online.length}</h3>
            <div className="space-y-3">
              {online.map(f => (
                <div key={f.id} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img src={f.avatar} alt="" className="w-10 h-10 rounded-full bg-surface-lighter" />
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-surface rounded-full"></div>
                    </div>
                    <div>
                      <div className="font-medium text-sm text-slate-200">{f.displayName}</div>
                      <div className="text-xs text-primary truncate w-32">In Movie Night</div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="opacity-0 group-hover:opacity-100 h-7 text-xs border-white/10 transition-opacity">Invite</Button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Offline — {offline.length}</h3>
            <div className="space-y-3">
              {offline.map(f => (
                <div key={f.id} className="flex items-center gap-3 opacity-60">
                  <div className="relative">
                    <img src={f.avatar} alt="" className="w-10 h-10 rounded-full bg-surface-lighter grayscale" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-slate-500 border-2 border-surface rounded-full"></div>
                  </div>
                  <div className="font-medium text-sm text-slate-200">{f.displayName}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
