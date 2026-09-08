import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RoomHeader from '@/components/room/RoomHeader';
import VideoPlayer from '@/components/video/VideoPlayer';
import ChatPanel from '@/components/chat/ChatPanel';
import ParticipantsPanel from '@/components/participants/ParticipantsPanel';
import { useUIStore } from '@/stores/ui-store';
import { useSignalR } from '@/hooks/use-signalr';

export default function WatchRoom() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { isChatOpen, isParticipantsOpen, isMobile, setIsMobile, activeTab } = useUIStore();
  const signalr = useSignalR(roomId);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsMobile]);

  // Demo room state
  const room = { id: roomId, name: 'Movie Night', memberCount: 5 };

  if (isMobile) {
    return (
      <div className="h-screen flex flex-col bg-black text-white overflow-hidden">
        <RoomHeader room={room} onLeave={() => navigate('/dashboard')} />
        <div className="w-full aspect-video flex-shrink-0 bg-black relative z-10">
          <VideoPlayer roomId={roomId!} />
        </div>
        <div className="flex-1 relative overflow-hidden bg-surface">
          {activeTab === 'chat' && <ChatPanel roomId={roomId!} />}
          {activeTab === 'participants' && <ParticipantsPanel roomId={roomId!} />}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0a] text-white overflow-hidden">
      <RoomHeader room={room} onLeave={() => navigate('/dashboard')} />
      <div className="flex-1 flex overflow-hidden relative">
        <div className={`flex-1 relative bg-black transition-all duration-300 ${isChatOpen || isParticipantsOpen ? 'mr-0' : ''}`}>
          <VideoPlayer roomId={roomId!} />
        </div>
        
        {isChatOpen && (
          <div className="w-80 flex-shrink-0 border-l border-white/10 bg-surface flex flex-col z-20">
            <ChatPanel roomId={roomId!} />
          </div>
        )}
        
        {isParticipantsOpen && (
          <div className="w-80 flex-shrink-0 border-l border-white/10 bg-surface flex flex-col z-20">
            <ParticipantsPanel roomId={roomId!} />
          </div>
        )}
      </div>
    </div>
  );
}
