import { Play, Pause, Volume2, VolumeX, Maximize, Smile, ScreenShare, PictureInPicture } from 'lucide-react';
import ProgressBar from './ProgressBar';
import { formatTime } from '@/lib/utils';
import { useScreenShare } from '@/hooks/use-screen-share';
import { useReactions } from '@/hooks/use-reactions';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import ReactionBar from '../reactions/ReactionBar';
import { useState } from 'react';

export default function VideoControls({ roomId, playbackState, onSync, containerRef }: any) {
  const { isSharing, startShare, stopShare } = useScreenShare();
  const { sendReaction } = useReactions(roomId);
  const [vol, setVol] = useState(100);
  const duration = 135; // Dummy 2m15s

  const handlePlayPause = () => onSync({ ...playbackState, isPlaying: !playbackState.isPlaying });
  const handleSeek = (time: number) => onSync({ ...playbackState, currentTime: time });
  const handleFullscreen = () => {
    if (!document.fullscreenElement) containerRef.current?.requestFullscreen();
    else document.exitFullscreen();
  };

  return (
    <div className="flex flex-col gap-2 w-full text-white">
      <ProgressBar currentTime={playbackState.currentTime} duration={duration} onSeek={handleSeek} />
      
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-4">
          <button onClick={handlePlayPause} className="hover:text-primary transition-colors">
            {playbackState.isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
          </button>
          
          <div className="flex items-center gap-2 group">
            <button onClick={() => setVol(vol === 0 ? 100 : 0)} className="hover:text-primary">
              {vol === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <div className="w-0 overflow-hidden group-hover:w-20 transition-all duration-300 ease-in-out flex items-center">
              <input type="range" min="0" max="100" value={vol} onChange={e => setVol(Number(e.target.value))} className="w-16 accent-primary h-1" />
            </div>
          </div>

          <span className="text-xs font-medium tabular-nums opacity-80">{formatTime(playbackState.currentTime)} / {formatTime(duration)}</span>
        </div>

        <div className="flex items-center gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <button className="hover:text-primary transition-colors relative"><Smile className="w-5 h-5" /></button>
            </PopoverTrigger>
            <PopoverContent side="top" align="center" className="w-auto p-0 mb-2 border-none bg-transparent">
              <ReactionBar onSelect={sendReaction} />
            </PopoverContent>
          </Popover>

          <button onClick={isSharing ? stopShare : startShare} className={`transition-colors ${isSharing ? 'text-green-400' : 'hover:text-primary'}`}>
            <ScreenShare className="w-5 h-5" />
          </button>
          
          <button className="hover:text-primary transition-colors"><PictureInPicture className="w-5 h-5" /></button>
          <button onClick={handleFullscreen} className="hover:text-primary transition-colors"><Maximize className="w-5 h-5" /></button>
        </div>
      </div>
    </div>
  );
}
