import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import toast from 'react-hot-toast';

export default function InviteModal({ isOpen, onClose, roomId }: { isOpen: boolean, onClose: () => void, roomId: string }) {
  const link = `${window.location.origin}/room/${roomId}/join`;

  const copyLink = () => {
    navigator.clipboard.writeText(link);
    toast.success('Link copied!');
  };

  const copyCode = () => {
    navigator.clipboard.writeText(roomId);
    toast.success('Code copied!');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Invite Friends</DialogTitle></DialogHeader>
        <div className="space-y-6 py-4">
          <div>
            <label className="text-sm font-medium mb-2 block text-slate-300">Room Link</label>
            <div className="flex gap-2">
              <Input readOnly value={link} className="bg-black/20" />
              <Button variant="outline" size="icon" onClick={copyLink}><Copy className="w-4 h-4" /></Button>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block text-slate-300">Room Code</label>
            <div className="flex gap-2">
              <div className="flex-1 bg-black/20 border border-white/10 rounded-md flex items-center justify-center py-2 text-2xl font-mono tracking-widest text-primary">
                {roomId.toUpperCase()}
              </div>
              <Button variant="outline" className="h-auto" size="icon" onClick={copyCode}><Copy className="w-4 h-4" /></Button>
            </div>
          </div>
          <Button className="w-full bg-primary hover:bg-primary-hover">Send Invitations</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
