import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Globe, Monitor, Play } from 'lucide-react';

export default function WatchSourceModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader><DialogTitle>Choose what to watch</DialogTitle></DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
          
          <div className="border border-white/10 rounded-xl p-4 hover:bg-white/5 cursor-pointer transition-colors text-center">
            <Globe className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <h3 className="font-semibold mb-1">Video URL</h3>
            <p className="text-xs text-slate-400">Direct link to mp4, webm, etc.</p>
          </div>
          
          <div className="border border-white/10 rounded-xl p-4 hover:bg-white/5 cursor-pointer transition-colors text-center">
            <Monitor className="w-8 h-8 text-violet-400 mx-auto mb-2" />
            <h3 className="font-semibold mb-1">Screen Share</h3>
            <p className="text-xs text-slate-400">Share your screen or browser tab.</p>
          </div>

          <div className="border border-white/10 rounded-xl p-4 hover:bg-white/5 cursor-pointer transition-colors text-center">
            <Play className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <h3 className="font-semibold mb-1">Sample Video</h3>
            <p className="text-xs text-slate-400">Watch a demo video.</p>
          </div>

        </div>
        <div className="text-xs text-slate-500 text-center mt-2">
          Some streaming services can't be embedded. Use Screen Share to watch those together.
        </div>
      </DialogContent>
    </Dialog>
  );
}
