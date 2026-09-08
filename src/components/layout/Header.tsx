import { Link } from 'react-router-dom';
import { PlayCircle, Search, Bell, Settings, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/use-auth';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="fixed top-0 w-full z-40 bg-surface/80 backdrop-blur-md border-b border-white/10 h-16">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between gap-4">
        <Link to="/dashboard" className="flex items-center gap-2 text-xl font-bold flex-shrink-0">
          <PlayCircle className="text-primary w-8 h-8" />
          <span className="hidden sm:block">RoomPlay</span>
        </Link>

        <div className="flex-1 max-w-md hidden md:block relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <Input placeholder="Search rooms..." className="pl-9 bg-black/20 border-white/10" />
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <Button className="hidden sm:flex bg-primary hover:bg-primary-hover">Create Room</Button>
          
          <Button variant="ghost" size="icon" className="relative text-slate-300 hover:text-white">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-9 h-9 rounded-full bg-surface-lighter border border-white/10 overflow-hidden outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface">
                <img src={user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'u'}`} alt="Avatar" className="w-full h-full object-cover" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="p-2 border-b border-white/10 mb-1">
                <p className="font-medium text-sm truncate">{user?.displayName}</p>
                <p className="text-xs text-slate-400 truncate">@{user?.username}</p>
              </div>
              <DropdownMenuItem asChild><Link to="/profile" className="cursor-pointer"><User className="mr-2 w-4 h-4"/> Profile</Link></DropdownMenuItem>
              <DropdownMenuItem><Settings className="mr-2 w-4 h-4"/> Settings</DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10 my-1" />
              <DropdownMenuItem onClick={logout} className="text-red-400 focus:text-red-300 cursor-pointer"><LogOut className="mr-2 w-4 h-4"/> Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
