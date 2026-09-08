import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

export default function CreateRoomModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [category, setCategory] = useState('Movie');
  const [maxUsers, setMaxUsers] = useState([10]);
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setCreating(true);
    try {
      const room = await api.rooms.create({
        name: name.trim(),
        description: description.trim(),
        thumbnail: '',
        privacy: isPrivate ? 'Private' : 'Public',
        password: null,
        maxParticipants: maxUsers[0],
        playbackPermission: 'HostOnly',
        chatEnabled: true,
        voiceEnabled: true,
        videoEnabled: true,
        screenSharingEnabled: true,
        reactionsEnabled: true,
        reactionPermission: 'Everyone',
        category,
      });
      toast.success('Room created!');
      onClose();
      navigate(`/room/${room.id}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to create room');
      setCreating(false);
    }
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

          <div>
            <label className="text-sm font-medium mb-2 block">Description (optional)</label>
            <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="What are you watching?" />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium block">Private Room</label>
              <span className="text-xs text-slate-400">Only people with the link can join</span>
            </div>
            <Switch checked={isPrivate} onCheckedChange={setIsPrivate} />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Category</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Movie">Movie</SelectItem>
                <SelectItem value="Anime">Anime</SelectItem>
                <SelectItem value="Gaming">Gaming</SelectItem>
                <SelectItem value="Music">Music</SelectItem>
                <SelectItem value="ScreenShare">Screen Share</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium block">Max Participants</label>
              <span className="text-sm text-slate-400">{maxUsers[0]}</span>
            </div>
            <Slider value={maxUsers} onValueChange={setMaxUsers} min={2} max={50} step={1} />
          </div>

          <Button onClick={handleCreate} disabled={creating || !name.trim()} className="w-full">
            {creating ? 'Creating...' : 'Create Room'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
