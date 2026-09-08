// HostControls.tsx - Minimal placeholder for Host Controls dropdown
import { ShieldAlert, MonitorPlay, Lock, UserX, Power } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export default function HostControls() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="border-white/10 text-slate-300"><ShieldAlert className="w-4 h-4 mr-2"/> Host</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem><MonitorPlay className="w-4 h-4 mr-2"/> Change Source</DropdownMenuItem>
        <DropdownMenuItem><Lock className="w-4 h-4 mr-2"/> Lock Room</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem><UserX className="w-4 h-4 mr-2"/> Mute All</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-400 focus:text-red-300"><Power className="w-4 h-4 mr-2"/> End Room</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
