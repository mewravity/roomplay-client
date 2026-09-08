import { useState } from 'react';
import Header from '@/components/layout/Header';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({ 
    displayName: user?.displayName || '', 
    status: user?.status || '' 
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(formData);
      toast.success('Profile updated');
    } catch (err: any) {
      toast.error('Failed to update');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-white pb-20">
      <Header />
      <main className="max-w-3xl mx-auto px-4 pt-24">
        <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>
        
        <div className="bg-surface rounded-xl border border-white/10 p-8">
          <div className="flex items-center gap-8 mb-8">
            <div className="relative group cursor-pointer">
              <img src={user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'user'}`} alt="" className="w-24 h-24 rounded-full bg-surface-lighter" />
              <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-sm font-medium">Change</div>
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user?.displayName}</h2>
              <p className="text-slate-400">@{user?.username}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Display Name</label>
              <Input value={formData.displayName} onChange={e => setFormData({...formData, displayName: e.target.value})} className="max-w-md" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status / Bio</label>
              <Input value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} placeholder="What are you watching?" className="max-w-md" />
            </div>
            <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary-hover">
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-8">
          <div className="bg-surface rounded-xl border border-white/10 p-6 text-center">
            <div className="text-3xl font-bold text-violet-400 mb-1">12</div>
            <div className="text-sm text-slate-400">Rooms Created</div>
          </div>
          <div className="bg-surface rounded-xl border border-white/10 p-6 text-center">
            <div className="text-3xl font-bold text-cyan-400 mb-1">48</div>
            <div className="text-sm text-slate-400">Watch Sessions</div>
          </div>
        </div>
      </main>
    </div>
  );
}
