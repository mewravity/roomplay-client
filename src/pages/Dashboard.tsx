import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import RoomCard from '@/components/room/RoomCard';
import CreateRoomModal from '@/components/room/CreateRoomModal';
import FriendsPanel from '@/components/friends/FriendsPanel';
import { api } from '@/lib/api';
import { Plus } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';

export default function Dashboard() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api.rooms.list()
      .then(r => { if (mounted) setRooms(r); })
      .catch(err => console.error('Failed to load rooms:', err))
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const continueRooms = rooms.filter(r => r.isActive).slice(0, 2);

  return (
    <div className="min-h-screen bg-background text-white pb-20">
      <Header />
      <main className="max-w-7xl mx-auto px-4 pt-24 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        <div className="lg:col-span-3 space-y-12">
          {/* Continue Watching */}
          {continueRooms.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4">Continue Watching</h2>
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
                {continueRooms.map(r => (
                  <div key={r.id} className="min-w-[300px] bg-surface rounded-xl border border-white/10 overflow-hidden flex-shrink-0 snap-center hover:bg-surface-lighter transition-colors cursor-pointer" onClick={() => window.location.href = `/room/${r.id}/join`}>
                    <div className="h-24 bg-gradient-to-r from-violet-600/50 to-cyan-600/50 relative">
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20"><div className="h-full bg-primary w-[45%]"></div></div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold">{r.name}</h3>
                      <p className="text-sm text-slate-400 mt-1">{r.currentParticipants} watching • {formatRelativeTime(r.lastActiveAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* My Rooms */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">My Rooms</h2>
            </div>
            {loading ? (
              <div className="text-slate-400 text-center py-16">Loading your rooms...</div>
            ) : (
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
            )}
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
