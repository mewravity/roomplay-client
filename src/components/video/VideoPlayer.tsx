import { useState, useRef, useEffect } from 'react';
import { usePlaybackSync } from '@/hooks/use-playback-sync';
import { useScreenShare } from '@/hooks/use-screen-share';
import { useRoomStore } from '@/stores/room-store';
import VideoControls from './VideoControls';
import FloatingReactions from '../reactions/FloatingReactions';
import StreamingCredentialsModal from '../streaming/StreamingCredentialsModal';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, KeyRound, Play, StopCircle, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function VideoPlayer({ roomId }: { roomId: string }) {
  const [showControls, setShowControls] = useState(true);
  const [isCredentialsOpen, setIsCredentialsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timeoutRef = useRef<any>(null);

  const { playbackState, sync } = usePlaybackSync(roomId);
  const { isSharing, isViewer, screenStream, screenShareUserId, startShare, stopShare } = useScreenShare(roomId);
  const { members } = useRoomStore();

  const handleMouseMove = () => {
    setShowControls(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setShowControls(false), 3500);
  };

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  // Attach stream to video element when available
  useEffect(() => {
    if (videoRef.current) {
      if (screenStream) {
        videoRef.current.srcObject = screenStream;
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.srcObject = null;
      }
    }
  }, [screenStream]);

  const togglePlay = () => {
    if (!screenStream) {
      sync({ ...playbackState, isPlaying: !playbackState.isPlaying, updatedAt: new Date().toISOString() });
    }
  };

  const playSampleVideo = () => {
    sync({
      ...playbackState,
      isPlaying: true,
      currentTime: 0,
      mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      mediaTitle: 'Big Buck Bunny (Sample)',
      updatedAt: new Date().toISOString(),
    });
  };

  const mediaUrl = (playbackState as any).mediaUrl;
  const presenter = members.find((m) => m.userId === screenShareUserId);
  const presenterName = presenter?.displayName || presenter?.username || 'Host';

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 bg-black overflow-hidden flex flex-col justify-center items-center select-none ${
        !showControls && 'cursor-none'
      }`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
      onClick={togglePlay}
    >
      {/* 1. Screen Sharing Stream */}
      {screenStream ? (
        <div className="relative w-full h-full flex items-center justify-center bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={isSharing} // Mute for presenter to prevent echo/feedback loop
            className="w-full h-full object-contain"
          />

          {/* Top Live Presenter / Viewer Indicator */}
          <div className="absolute top-4 left-4 z-30 flex items-center gap-3">
            {isSharing ? (
              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur border border-green-500/40 text-green-400 text-xs font-semibold shadow-lg">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                <span>You are sharing your screen</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    stopShare();
                  }}
                  className="ml-1 px-2 py-0.5 rounded bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 transition-colors flex items-center gap-1 text-[11px]"
                >
                  <StopCircle className="w-3 h-3" /> Stop
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur border border-red-500/40 text-white text-xs font-semibold shadow-lg">
                <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                <span>Live Screen Share: <span className="text-primary font-bold">{presenterName}</span></span>
              </div>
            )}
          </div>
        </div>
      ) : mediaUrl ? (
        /* 2. Direct Video URL */
        <video
          key={mediaUrl}
          src={mediaUrl}
          className="w-full h-full object-contain"
          autoPlay={playbackState.isPlaying}
        />
      ) : (
        /* 3. Empty State Hero with Quick Actions */
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-950/40 via-[#07080d] to-black flex items-center justify-center p-6">
          <div className="text-center max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto mb-5 shadow-lg shadow-primary/10">
              <Monitor className="w-8 h-8" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">
              Ready to Watch Together
            </h1>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Share your screen or browser tab to stream any video directly, or access shared streaming accounts with your friends.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  startShare();
                }}
                className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
              >
                <Monitor className="w-4 h-4 mr-2" />
                Share Screen
              </Button>

              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCredentialsOpen(true);
                }}
                variant="outline"
                className="border-white/15 bg-white/5 hover:bg-white/10 text-white"
              >
                <KeyRound className="w-4 h-4 mr-2 text-amber-300" />
                Streaming Accounts
              </Button>

              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  playSampleVideo();
                }}
                variant="ghost"
                className="text-slate-400 hover:text-white hover:bg-white/5"
              >
                <Play className="w-4 h-4 mr-1.5" />
                Sample Video
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Reactions Overlay */}
      <FloatingReactions roomId={roomId} />

      {/* Video Controls Bar */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 pb-6 z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <VideoControls
              roomId={roomId}
              playbackState={playbackState}
              onSync={sync}
              containerRef={containerRef}
              onOpenCredentials={() => setIsCredentialsOpen(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Streaming Credentials Modal */}
      <StreamingCredentialsModal
        isOpen={isCredentialsOpen}
        onClose={() => setIsCredentialsOpen(false)}
        roomId={roomId}
      />
    </div>
  );
}
