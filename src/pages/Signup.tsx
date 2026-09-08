import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlayCircle, User, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import toast from 'react-hot-toast';

export default function Signup() {
  const [formData, setFormData] = useState({ username: '', displayName: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirm) return toast.error('Passwords do not match');
    if (formData.password.length < 6) return toast.error('Password must be at least 6 characters');
    
    setLoading(true);
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-[#0a0a0a] to-[#0a0a0a]"></div>
      
      <div className="w-full max-w-md bg-[#16162a]/80 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl relative z-10">
        <div className="flex flex-col items-center mb-8">
          <PlayCircle className="text-cyan-500 w-12 h-12 mb-2" />
          <h2 className="text-2xl font-bold">Create your account</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
            <Input placeholder="Username" className="pl-10" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} required />
          </div>
          <div className="relative">
            <User className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
            <Input placeholder="Display Name" className="pl-10" value={formData.displayName} onChange={e => setFormData({...formData, displayName: e.target.value})} required />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
            <Input type="email" placeholder="Email address" className="pl-10" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
            <Input type="password" placeholder="Password" className="pl-10" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
            <Input type="password" placeholder="Confirm Password" className="pl-10" value={formData.confirm} onChange={e => setFormData({...formData, confirm: e.target.value})} required />
          </div>
          <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700" disabled={loading}>
            {loading ? 'Creating...' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <Link to="/login" className="text-slate-400 hover:text-white transition-colors">Already have an account? <span className="text-cyan-400">Sign in</span></Link>
        </div>
      </div>
    </div>
  );
}
