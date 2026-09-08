import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mic, MicOff, Video, VideoOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

export default function JoinRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [room, setRoom] = useState<any>(null);
  const [joining, setJoining] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [camOn, setCamOn] = useState(false);

  useEffect(() => {
    if (!roomId) return;
    let mounted = true;
    api.rooms.get(roomId)
      .then(r => { if (mounted) setRoom(r); })
      .catch(err => {
        if (mounted) { toast.error(err.message || 'Room not found'); navigate('/discover'); }
      });
    return () => { mounted = false; };
  }, [roomId, navigate]);

  const handleJoin = async () => {
    if (!roomId || joining) return;
    setJoining(true);
    try {
      // Join room membership via API (host is already a member)
      await api.rooms.join(roomId).catch((err: any) => {
        // "Already joined" or membership issues are fine if we can still load detail
        if (!String(err.message || '').includes('Already')) throw err;
      });
      navigate(`/room/${roomId}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to join room');
      setJoining(false);
    }
  };

  const displayName = user?.displayName || 'Guest';

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-surface border border-white/10 rounded-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Preview Area */}
        <div className="flex-1 bg-black p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/10 min-h-[300px]">
          <div className="w-32 h-32 rounded-full bg-surface-lighter flex items-center justify-center mb-6 relative">
            <img src={user?.avatarUrl || user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName || 'demo'}`} className="w-full h-full rounded-full object-cover opacity-50" alt="" />
            {camOn ? <Video className="absolute text-white w-8 h-8" /> : <VideoOff className="absolute text-slate-500 w-8 h-8" />}
          </div>
          
          <div className="flex gap-4">
            <Button variant="outline" size="icon" className={`rounded-full w-12 h-12 ${!micOn && 'bg-red-500/20 border-red-500/50 text-red-500'}`} onClick={() => setMicOn(!micOn)}>
              {micOn ? <Mic /> : <MicOff />}
            </Button>
            <Button variant="outline" size="icon" className={`rounded-full w-12 h-12 ${!camOn && 'bg-red-500/20 border-red-500/50 text-red-500'}`} onClick={() => setCamOn(!camOn)}>
              {camOn ? <Video /> : <VideoOff />}
            </Button>
          </div>
        </div>

        {/* Form Area */}
        <div className="w-full md:w-[400px] p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-2">Ready to join?</h2>
          <p className="text-slate-400 mb-2 text-sm">{room ? `Room: ${room.name}` : 'Loading room...'}</p>
          <p className="text-slate-500 mb-8 text-xs">Joining as {displayName}</p>

          <div className="space-y-4">
            <Button onClick={handleJoin} disabled={joining || !room} className="w-full bg-primary hover:bg-primary-hover h-12 text-lg mt-4">
              {joining ? 'Joining...' : 'Join Room'}
            </Button>
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="w-full">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
