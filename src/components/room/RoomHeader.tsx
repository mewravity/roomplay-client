import { useState } from 'react';
import { Users, UserPlus, LogOut, KeyRound, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/stores/ui-store';
import { useRoomStore } from '@/stores/room-store';
import StreamingCredentialsModal from '../streaming/StreamingCredentialsModal';

export default function RoomHeader({ room, onLeave }: { room: any, onLeave: () => void }) {
  const { toggleParticipants } = useUIStore();
  const { isScreenSharing, screenShareUserId, members } = useRoomStore();
  const [isCredentialsOpen, setIsCredentialsOpen] = useState(false);

  const presenter = members.find((m) => m.userId === screenShareUserId);
  const isLive = isScreenSharing || !!screenShareUserId;

  return (
    <>
      <div className="h-14 flex items-center justify-between px-4 bg-surface/90 backdrop-blur border-b border-white/10 z-30">
        <div className="flex items-center gap-4">
          <h1 className="font-bold text-lg truncate max-w-[200px] sm:max-w-xs">{room.name}</h1>
          <Button variant="ghost" size="sm" onClick={toggleParticipants} className="text-slate-300 hover:text-white hidden sm:flex">
            <Users className="w-4 h-4 mr-2" />
            {room.memberCount}
          </Button>

          {/* Live Screen Sharing Indicator */}
          {isLive && (
            <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
              <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
              <span>Live: {presenter?.displayName || 'Screen Share'}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Streaming Accounts Vault Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCredentialsOpen(true)}
            className="border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 text-xs"
          >
            <KeyRound className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
            <span className="hidden sm:inline">Streaming Accounts</span>
            <span className="sm:hidden">Accounts</span>
          </Button>

          <Button variant="outline" size="sm" className="hidden sm:flex border-white/20">
            <UserPlus className="w-4 h-4 mr-2" /> Invite
          </Button>

          <Button variant="ghost" size="icon" onClick={onLeave} className="text-red-400 hover:text-red-300 hover:bg-red-500/10" title="Leave Room">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <StreamingCredentialsModal
        isOpen={isCredentialsOpen}
        onClose={() => setIsCredentialsOpen(false)}
        roomId={room.id}
      />
    </>
  );
}
