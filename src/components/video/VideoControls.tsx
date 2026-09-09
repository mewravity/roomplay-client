import { Play, Pause, Volume2, VolumeX, Maximize, Smile, ScreenShare, PictureInPicture, KeyRound } from 'lucide-react';
import ProgressBar from './ProgressBar';
import { formatTime } from '@/lib/utils';
import { useScreenShare } from '@/hooks/use-screen-share';
import { useReactions } from '@/hooks/use-reactions';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import ReactionBar from '../reactions/ReactionBar';
import { useState, useEffect } from 'react';

interface VideoControlsProps {
  roomId: string;
  playbackState: any;
  onSync: (state: any) => void;
  containerRef: React.RefObject<HTMLDivElement>;
  onOpenCredentials?: () => void;
}

export default function VideoControls({
  roomId,
  playbackState,
  onSync,
  containerRef,
  onOpenCredentials,
}: VideoControlsProps) {
  const { isSharing, isViewer, startShare, stopShare } = useScreenShare(roomId);
  const { sendReaction } = useReactions(roomId);
  const [vol, setVol] = useState(100);
  const duration = 135; // Dummy duration for media sync demo

  const handlePlayPause = () => onSync({ ...playbackState, isPlaying: !playbackState.isPlaying });
  const handleSeek = (time: number) => onSync({ ...playbackState, currentTime: time });
  const handleFullscreen = () => {
    if (!document.fullscreenElement) containerRef.current?.requestFullscreen();
    else document.exitFullscreen();
  };

  const handlePictureInPicture = async () => {
    const video = containerRef.current?.querySelector('video');
    if (video) {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await video.requestPictureInPicture();
      }
    }
  };

  // Sync volume with the video element
  useEffect(() => {
    const video = containerRef.current?.querySelector('video');
    if (video) {
      video.volume = vol / 100;
      video.muted = vol === 0;
    }
  }, [vol, containerRef]);

  const isLiveScreen = isSharing || isViewer;

  return (
    <div className="flex flex-col gap-2 w-full text-white">
      {!isLiveScreen && (
        <ProgressBar currentTime={playbackState.currentTime} duration={duration} onSeek={handleSeek} />
      )}
      
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-4">
          {!isLiveScreen && (
            <button onClick={handlePlayPause} className="hover:text-primary transition-colors">
              {playbackState.isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
            </button>
          )}
          
          <div className="flex items-center gap-2 group">
            <button onClick={() => setVol(vol === 0 ? 100 : 0)} className="hover:text-primary transition-colors">
              {vol === 0 ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <div className="w-0 overflow-hidden group-hover:w-20 transition-all duration-300 ease-in-out flex items-center">
              <input
                type="range"
                min="0"
                max="100"
                value={vol}
                onChange={(e) => setVol(Number(e.target.value))}
                className="w-16 accent-primary h-1 bg-white/20 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {!isLiveScreen && (
            <span className="text-xs font-medium tabular-nums opacity-80">
              {formatTime(playbackState.currentTime)} / {formatTime(duration)}
            </span>
          )}

          {isLiveScreen && (
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-medium animate-pulse">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              {isSharing ? 'Sharing Screen Live' : 'Viewing Live Screen'}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Reaction Bar */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="p-1.5 rounded-lg hover:bg-white/10 hover:text-primary transition-colors relative" title="Reactions">
                <Smile className="w-5 h-5" />
              </button>
            </PopoverTrigger>
            <PopoverContent side="top" align="center" className="w-auto p-0 mb-2 border-none bg-transparent">
              <ReactionBar onSelect={sendReaction} />
            </PopoverContent>
          </Popover>

          {/* Streaming Accounts Vault Button */}
          {onOpenCredentials && (
            <button
              onClick={onOpenCredentials}
              className="p-1.5 rounded-lg hover:bg-white/10 text-amber-300 hover:text-amber-200 transition-colors relative group"
              title="Streaming Accounts Vault"
            >
              <KeyRound className="w-5 h-5" />
              <span className="sr-only">Streaming Accounts</span>
            </button>
          )}

          {/* Screen Share Button */}
          <button
            onClick={isSharing ? stopShare : startShare}
            className={`p-1.5 rounded-lg transition-all relative ${
              isSharing
                ? 'bg-green-500/20 text-green-400 ring-1 ring-green-500/50 shadow-sm shadow-green-500/20'
                : 'hover:bg-white/10 hover:text-primary text-slate-300'
            }`}
            title={isSharing ? 'Stop Sharing Screen' : 'Share Screen with Room'}
          >
            <ScreenShare className="w-5 h-5" />
            {isSharing && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full animate-ping" />
            )}
          </button>
          
          <button
            onClick={handlePictureInPicture}
            className="p-1.5 rounded-lg hover:bg-white/10 hover:text-primary transition-colors text-slate-300"
            title="Picture in Picture"
          >
            <PictureInPicture className="w-5 h-5" />
          </button>

          <button
            onClick={handleFullscreen}
            className="p-1.5 rounded-lg hover:bg-white/10 hover:text-primary transition-colors text-slate-300"
            title="Fullscreen"
          >
            <Maximize className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
