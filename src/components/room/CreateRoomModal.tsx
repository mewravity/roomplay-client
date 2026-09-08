import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { isDemoMode } from '@/lib/demo';

export default function CreateRoomModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [maxUsers, setMaxUsers] = useState([10]);
  const [creating, setCreating] = useState(false);

  const handleCreate = () => {
    if (!name.trim()) return;
    setCreating(true);
    setTimeout(() => {
      setCreating(false);
      onClose();
      const newId = isDemoMode() ? `demo-room-${Date.now()}` : 'room-123';
      navigate(`/room/${newId}`);
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader><DialogTitle>Create Room</DialogTitle></DialogHeader>
        <div className="space-y-6 py-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Room Name</label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Friday Movie Night" />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium block">Private Room</label>
              <span className="text-xs text-slate-400">Only people with the link can join</span>
            </div>
            <Switch checked={isPrivate} onCheckedChange={setIsPrivate} />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium block">Max Participants</label>
              <span className="text-sm text-slate-400">{maxUsers[0]}</span>
            </div>
            <Slider value={maxUsers} onValueChange={setMaxUsers} min={2} max={50} step={1} />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Category</label>
            <Select defaultValue="movie">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="movie">Movie</SelectItem>
                <SelectItem value="anime">Anime</SelectItem>
                <SelectItem value="gaming">Gaming</SelectItem>
                <SelectItem value="music">Music</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleCreate} disabled={creating || !name.trim()} className="w-full">
            {creating ? 'Creating...' : 'Create Room'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
