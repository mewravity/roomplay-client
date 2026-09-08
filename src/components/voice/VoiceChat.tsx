import { Mic, MicOff, PhoneCall, PhoneOff } from 'lucide-react';
import { useVoiceChat } from '@/hooks/use-voice-chat';
import { Button } from '@/components/ui/button';

export default function VoiceChat() {
  const { isInVoice, isMuted, joinVoice, leaveVoice, toggleMute } = useVoiceChat();

  if (!isInVoice) {
    return (
      <Button variant="outline" size="sm" onClick={joinVoice} className="border-green-500/30 text-green-400 hover:bg-green-500/10">
        <PhoneCall className="w-4 h-4 mr-2" /> Join Voice
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2 bg-surface-lighter rounded-lg p-1 border border-white/5">
      <Button variant="ghost" size="icon" onClick={toggleMute} className={`w-8 h-8 rounded-md ${isMuted ? 'text-red-400 hover:text-red-300' : 'text-slate-300 hover:text-white'}`}>
        {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
      </Button>
      <div className="w-px h-4 bg-white/10"></div>
      <Button variant="ghost" size="icon" onClick={leaveVoice} className="w-8 h-8 rounded-md text-red-400 hover:text-red-300 hover:bg-red-500/10">
        <PhoneOff className="w-4 h-4" />
      </Button>
    </div>
  );
}
