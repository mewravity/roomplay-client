import { Users, UserPlus, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/stores/ui-store';

export default function RoomHeader({ room, onLeave }: { room: any, onLeave: () => void }) {
  const { toggleParticipants } = useUIStore();

  return (
    <div className="h-14 flex items-center justify-between px-4 bg-surface/90 backdrop-blur border-b border-white/10 z-30">
      <div className="flex items-center gap-4">
        <h1 className="font-bold text-lg truncate">{room.name}</h1>
        <Button variant="ghost" size="sm" onClick={toggleParticipants} className="text-slate-300 hover:text-white hidden sm:flex">
          <Users className="w-4 h-4 mr-2" />
          {room.memberCount}
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="hidden sm:flex border-white/20">
          <UserPlus className="w-4 h-4 mr-2" /> Invite
        </Button>
        <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white">
          <Settings className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onLeave} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
