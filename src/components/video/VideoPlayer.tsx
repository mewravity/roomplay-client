import { useState, useRef, useEffect } from 'react';
import { usePlaybackSync } from '@/hooks/use-playback-sync';
import VideoControls from './VideoControls';
import FloatingReactions from '../reactions/FloatingReactions';
import { motion, AnimatePresence } from 'framer-motion';

export default function VideoPlayer({ roomId }: { roomId: string }) {
  const [showControls, setShowControls] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<any>(null);
  const { playbackState, sync } = usePlaybackSync(roomId);

  const handleMouseMove = () => {
    setShowControls(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setShowControls(false), 3000);
  };

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const togglePlay = () => {
    sync({ ...playbackState, isPlaying: !playbackState.isPlaying, updatedAt: new Date().toISOString() });
  };

  const mediaUrl = (playbackState as any).mediaUrl;

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 bg-black overflow-hidden flex flex-col justify-center items-center ${!showControls && 'cursor-none'}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
      onClick={togglePlay}
    >
      {mediaUrl ? (
        <video key={mediaUrl} src={mediaUrl} className="w-full h-full object-contain" autoPlay={playbackState.isPlaying} />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black flex items-center justify-center">
          <div className="text-center px-6">
            <h1 className="text-2xl font-bold text-white/70 mb-2">Nothing playing yet</h1>
            <p className="text-slate-500 text-sm">The host can add a video URL to start watching together</p>
          </div>
        </div>
      )}

      {/* Overlays */}
      <FloatingReactions roomId={roomId} />

      {/* Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pb-6 z-20"
            onClick={e => e.stopPropagation()}
          >
            <VideoControls roomId={roomId} playbackState={playbackState} onSync={sync} containerRef={containerRef} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
