import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RoomHeader from '@/components/room/RoomHeader';
import VideoPlayer from '@/components/video/VideoPlayer';
import ChatPanel from '@/components/chat/ChatPanel';
import ParticipantsPanel from '@/components/participants/ParticipantsPanel';
import { useUIStore } from '@/stores/ui-store';
import { useSignalR } from '@/hooks/use-signalr';
import { useRoomStore } from '@/stores/room-store';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

export default function WatchRoom() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { isChatOpen, isParticipantsOpen, isMobile, setIsMobile, activeTab } = useUIStore();
  const signalr = useSignalR(roomId);
  const { setRoom, setMembers, setMessages, clearRoom } = useRoomStore();
  const [room, setRoomState] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Load real room detail
  useEffect(() => {
    if (!roomId) return;
    let mounted = true;
    setLoading(true);
    api.rooms.get(roomId)
      .then((detail: any) => {
        if (!mounted) return;
        setRoomState(detail);
        setRoom(detail);
        const members = (detail.members || []).map((m: any) => ({
          id: m.userId,
          userId: m.userId,
          username: m.username,
          displayName: m.displayName,
          avatar: m.avatar,
          avatarUrl: m.avatar,
          role: m.role === 'Host' ? 'Host' : m.role === 'Moderator' ? 'Mod' : 'Member',
          isOnline: m.isOnline,
          isMuted: false,
          isVideoEnabled: false,
          isScreenSharing: false,
        }));
        setMembers(members);
        const msgs = (detail.recentMessages || []).map((m: any) => ({
          id: m.id,
          roomId: m.roomId,
          userId: m.userId,
          username: m.username,
          displayName: m.displayName,
          avatar: m.avatar,
          avatarUrl: m.avatar,
          content: m.content,
          type: m.type,
          isSystem: m.type === 'System',
          createdAt: m.createdAt,
          timestamp: m.createdAt,
          replyToId: m.replyToId,
        }));
        setMessages(msgs);
      })
      .catch(err => {
        if (mounted) {
          toast.error(err.message || 'Room not found');
          navigate('/dashboard');
        }
      })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [roomId, navigate, setRoom, setMembers, setMessages]);

  // React to live membership events
  useEffect(() => {
    const onJoined = () => { refreshMembers(); };
    const onLeft = () => { refreshMembers(); };
    signalr.on('UserJoined', onJoined);
    signalr.on('UserLeft', onLeft);
    return () => {
      signalr.off('UserJoined', onJoined);
      signalr.off('UserLeft', onLeft);
    };
  }, [signalr, roomId]);

  const refreshMembers = useCallback(() => {
    if (!roomId) return;
    api.rooms.members(roomId)
      .then((list: any[]) => {
        setMembers(list.map((m: any) => ({
          id: m.userId,
          userId: m.userId,
          username: m.username,
          displayName: m.displayName,
          avatar: m.avatar,
          avatarUrl: m.avatar,
          role: m.role === 'Host' ? 'Host' : m.role === 'Moderator' ? 'Mod' : 'Member',
          isOnline: m.isOnline,
          isMuted: false,
          isVideoEnabled: false,
          isScreenSharing: false,
        })));
      })
      .catch(() => {});
  }, [roomId, setMembers]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsMobile]);

  useEffect(() => () => clearRoom(), [clearRoom]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0a0a0a] text-white">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Joining room...</p>
        </div>
      </div>
    );
  }

  if (!room) return null;

  const roomForHeader = { id: room.id, name: room.name, memberCount: room.memberCount ?? room.currentParticipants ?? 0 };

  if (isMobile) {
    return (
      <div className="h-screen flex flex-col bg-black text-white overflow-hidden">
        <RoomHeader room={roomForHeader} onLeave={() => navigate('/dashboard')} />
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
      <RoomHeader room={roomForHeader} onLeave={() => navigate('/dashboard')} />
      <div className="flex-1 flex overflow-hidden relative">
        <div className="flex-1 relative bg-black">
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
