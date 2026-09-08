import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import RoomCard from '@/components/room/RoomCard';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { isDemoMode, demoRooms } from '@/lib/demo';

const CATEGORIES = ['All', 'Movie', 'Anime', 'Gaming', 'Music', 'Screen Share'];

export default function Discover() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [rooms, setRooms] = useState<any[]>([]);

  useEffect(() => {
    if (isDemoMode()) {
      setRooms(demoRooms.filter(r => r.privacy === 'Public' || true)); // Show all for demo
    }
  }, []);

  const filtered = rooms.filter(r => 
    (activeCategory === 'All' || r.category === activeCategory) &&
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-white pb-20">
      <Header />
      <main className="max-w-7xl mx-auto px-4 pt-24">
        <h1 className="text-3xl font-bold mb-8">Discover Rooms</h1>
        
        <div className="flex flex-col md:flex-row gap-4 justify-between mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === cat ? 'bg-primary text-white' : 'bg-surface hover:bg-white/10 text-slate-300'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-64 flex-shrink-0">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search rooms..." 
              value={search} 
              onChange={e => setSearch(e.target.value)}
              className="pl-9 bg-surface border-white/10"
            />
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map(room => <RoomCard key={room.id} room={room} />)}
          </div>
        ) : (
          <div className="text-center py-20 bg-surface rounded-xl border border-white/5">
            <h3 className="text-xl font-semibold mb-2">No rooms found</h3>
            <p className="text-slate-400">Try adjusting your filters or search query.</p>
          </div>
        )}
      </main>
    </div>
  );
}
