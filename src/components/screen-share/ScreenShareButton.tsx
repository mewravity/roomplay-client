import { Monitor } from 'lucide-react';
import { useScreenShare } from '@/hooks/use-screen-share';

export default function ScreenShareButton() {
  const { isSharing, startShare, stopShare } = useScreenShare();

  return (
    <button 
      onClick={isSharing ? stopShare : startShare}
      className={`relative p-2 rounded-full transition-colors ${isSharing ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : 'hover:bg-white/10 text-slate-300 hover:text-white'}`}
      title={isSharing ? "Stop Sharing" : "Share Screen"}
    >
      <Monitor className="w-5 h-5" />
      {isSharing && <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-green-400 rounded-full border border-surface"></div>}
    </button>
  );
}
