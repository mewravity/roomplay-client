import { useState, useRef, useEffect } from 'react';
import { usePlaybackSync } from '@/hooks/use-playback-sync';
import VideoControls from './VideoControls';
import FloatingReactions from '../reactions/FloatingReactions';
import { isDemoMode } from '@/lib/demo';
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

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 bg-black overflow-hidden flex flex-col justify-center items-center ${!showControls && 'cursor-none'}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
      onClick={togglePlay}
    >
      {/* Fake Video for Demo */}
      {isDemoMode() ? (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-black to-black flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-cyan-400 mb-4 opacity-50">RoomPlay Demo Content</h1>
            {playbackState.isPlaying ? (
              <p className="text-slate-500 animate-pulse">Playing...</p>
            ) : (
              <p className="text-slate-500">Paused</p>
            )}
          </div>
        </div>
      ) : (
        <video className="w-full h-full object-contain" />
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
