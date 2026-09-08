import { useEffect, useState } from 'react';
import { Search, UserPlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/use-auth';

interface Friend {
  id: string;
  friendshipId: string;
  username: string;
  displayName: string;
  avatar: string;
  isOnline: boolean;
  currentRoom?: string;
}

export default function FriendsPanel() {
  const { user: me } = useAuth();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api.friends.list()
      .then((list: Friend[]) => { if (mounted) setFriends(list || []); })
      .catch(err => console.error('Failed to load friends:', err))
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const online = friends.filter(f => f.isOnline);
  const offline = friends.filter(f => !f.isOnline);

  return (
    <div className="bg-surface rounded-xl border border-white/10 overflow-hidden flex flex-col h-[600px]">
      <div className="p-4 border-b border-white/10">
        <h2 className="font-bold text-lg flex items-center justify-between">
          Friends
          <Button variant="ghost" size="icon" className="w-8 h-8" title="Add friend (search users)">
            <UserPlus className="w-4 h-4" />
          </Button>
        </h2>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <Input placeholder="Search friends..." className="pl-9 bg-black/20 border-white/10 h-9 text-sm" />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {loading ? (
            <p className="text-sm text-slate-500 text-center py-8">Loading friends...</p>
          ) : friends.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">🤝</div>
              <p className="text-sm text-slate-400 mb-1">No friends yet</p>
              <p className="text-xs text-slate-500">Search for users and send a friend request</p>
            </div>
          ) : (
            <>
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Online — {online.length}</h3>
            <div className="space-y-3">
              {online.map(f => (
                <div key={f.id} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img src={f.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${f.username}`} alt="" className="w-10 h-10 rounded-full bg-surface-lighter" />
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-surface rounded-full"></div>
                    </div>
                    <div>
                      <div className="font-medium text-sm text-slate-200">{f.displayName}</div>
                      {f.currentRoom ? (
                        <div className="text-xs text-primary truncate w-32">{f.currentRoom}</div>
                      ) : (
                        <div className="text-xs text-slate-500 truncate w-32">@ {f.username}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {online.length === 0 && <p className="text-xs text-slate-600 pl-1">Nobody online right now</p>}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Offline — {offline.length}</h3>
            <div className="space-y-3">
              {offline.map(f => (
                <div key={f.id} className="flex items-center gap-3 opacity-60">
                  <div className="relative">
                    <img src={f.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${f.username}`} alt="" className="w-10 h-10 rounded-full bg-surface-lighter grayscale" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-slate-500 border-2 border-surface rounded-full"></div>
                  </div>
                  <div className="font-medium text-sm text-slate-200">{f.displayName}</div>
                </div>
              ))}
            </div>
          </div>
            </>
          )}
        </div>
      </ScrollArea>
      <div className="px-4 py-2 border-t border-white/5 text-xs text-slate-600">You: @{me?.username}</div>
    </div>
  );
}
