import { Film, Clock, WifiOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export function EmptyRoom({ onInvite, onChooseSource }: any) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-center p-6 z-10">
      <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4"><Film className="w-8 h-8 text-primary" /></div>
      <h2 className="text-2xl font-bold mb-2">Your room is ready.</h2>
      <p className="text-slate-400 mb-8 max-w-sm">Invite your friends to get started, and choose something to watch together.</p>
      <div className="flex gap-4">
        <Button onClick={onChooseSource} className="bg-primary hover:bg-primary-hover">Choose Source</Button>
        <Button onClick={onInvite} variant="outline" className="border-white/20">Invite Friends</Button>
      </div>
    </motion.div>
  );
}

export function WaitingForHost() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-center p-6 z-10">
      <Clock className="w-12 h-12 text-slate-400 mb-4 animate-pulse" />
      <h2 className="text-xl font-medium">Waiting for the host to start playing...</h2>
    </motion.div>
  );
}

export function ScreenSharingOverlay({ username }: { username: string }) {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur border border-white/10 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 z-10">
      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
      {username} is sharing their screen
    </div>
  );
}
