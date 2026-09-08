import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import RoomCard from '@/components/room/RoomCard';
import CreateRoomModal from '@/components/room/CreateRoomModal';
import FriendsPanel from '@/components/friends/FriendsPanel';
import { isDemoMode, demoRooms, demoUsers } from '@/lib/demo';
import { Plus } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';

export default function Dashboard() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    if (isDemoMode()) {
      setRooms(demoRooms);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-white pb-20">
      <Header />
      <main className="max-w-7xl mx-auto px-4 pt-24 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        <div className="lg:col-span-3 space-y-12">
          {/* Continue Watching */}
          <section>
            <h2 className="text-xl font-bold mb-4">Continue Watching</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
              {rooms.slice(0,2).map(r => (
                <div key={r.id} className="min-w-[300px] bg-surface rounded-xl border border-white/10 overflow-hidden flex-shrink-0 snap-center hover:bg-surface-lighter transition-colors cursor-pointer">
                  <div className="h-24 bg-gradient-to-r from-violet-600/50 to-cyan-600/50 relative">
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20"><div className="h-full bg-primary w-[45%]"></div></div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold">{r.name}</h3>
                    <p className="text-sm text-slate-400 mt-1">{r.memberCount} watching • {formatRelativeTime(r.lastActiveAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* My Rooms */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">My Rooms</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {rooms.map(room => (
                <RoomCard key={room.id} room={room} />
              ))}
              <div 
                onClick={() => setIsCreateOpen(true)}
                className="rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center p-8 text-slate-400 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all cursor-pointer min-h-[200px]"
              >
                <Plus className="w-8 h-8 mb-2" />
                <span className="font-semibold">Create Room</span>
              </div>
            </div>
          </section>

          {/* Recent Activity */}
          <section>
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {isDemoMode() && [
                { id: 1, text: "Alex joined Movie Night", time: "2m ago", user: demoUsers[0] },
                { id: 2, text: "Sarah created Anime Night", time: "1h ago", user: demoUsers[1] },
                { id: 3, text: "Mike invited you to Gaming Stream", time: "3h ago", user: demoUsers[2] },
              ].map(act => (
                <div key={act.id} className="flex items-center gap-4 bg-surface p-4 rounded-xl border border-white/5">
                  <img src={act.user.avatar} alt="" className="w-10 h-10 rounded-full bg-surface-lighter" />
                  <div className="flex-1">
                    <p className="text-sm">{act.text}</p>
                    <p className="text-xs text-slate-500 mt-1">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <FriendsPanel />
        </div>
      </main>

      {isCreateOpen && <CreateRoomModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />}
    </div>
  );
}
