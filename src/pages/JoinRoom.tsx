import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mic, MicOff, Video, VideoOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';

export default function JoinRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [micOn, setMicOn] = useState(false);
  const [camOn, setCamOn] = useState(false);

  const handleJoin = () => {
    // In real app, might save settings to store
    navigate(`/room/${roomId}`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-surface border border-white/10 rounded-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Preview Area */}
        <div className="flex-1 bg-black p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/10 min-h-[300px]">
          <div className="w-32 h-32 rounded-full bg-surface-lighter flex items-center justify-center mb-6 relative">
            <img src={user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName || 'demo'}`} className="w-full h-full rounded-full object-cover opacity-50" alt="" />
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
          <p className="text-slate-400 mb-8 text-sm">Room code: {roomId}</p>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Display Name</label>
              <Input value={displayName} onChange={e => setDisplayName(e.target.value)} />
            </div>
            
            <Button onClick={handleJoin} className="w-full bg-primary hover:bg-primary-hover h-12 text-lg mt-4">
              Join Room
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
