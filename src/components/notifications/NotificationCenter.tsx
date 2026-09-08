import { Bell } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export default function NotificationCenter() {
  const notifications = [
    { id: 1, title: 'Alex invited you', desc: 'Friday Anime Night', time: '2m', unread: true },
    { id: 2, title: 'Friend Request', desc: 'Sarah sent you a request', time: '1h', unread: true },
    { id: 3, title: 'Room Updated', desc: 'Movie Night details changed', time: '1d', unread: false },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-slate-300 hover:text-white">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-surface"></span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="p-3 border-b border-white/10 flex justify-between items-center">
          <h3 className="font-semibold text-sm">Notifications</h3>
          <button className="text-xs text-primary hover:text-primary-hover">Mark all read</button>
        </div>
        <div className="max-h-80 overflow-auto">
          {notifications.map(n => (
            <div key={n.id} className={`p-3 border-b border-white/5 hover:bg-white/5 cursor-pointer flex gap-3 ${n.unread ? 'bg-primary/5' : ''}`}>
              <div className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${n.unread ? 'bg-primary' : 'bg-transparent'}`}></div>
              <div>
                <p className="text-sm font-medium text-slate-200">{n.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{n.desc}</p>
                <p className="text-[10px] text-slate-500 mt-1">{n.time} ago</p>
              </div>
            </div>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
