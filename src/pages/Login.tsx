import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlayCircle, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async () => {
    setLoading(true);
    try {
      await demoLogin();
      navigate('/dashboard');
    } catch (err: any) {
      toast.error('Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-900/20 via-[#0a0a0a] to-[#0a0a0a]"></div>
      
      <div className="w-full max-w-md bg-[#16162a]/80 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl relative z-10">
        <div className="flex flex-col items-center mb-8">
          <PlayCircle className="text-violet-500 w-12 h-12 mb-2" />
          <h2 className="text-2xl font-bold">Welcome back</h2>
          <p className="text-slate-400 text-sm mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
            <Input type="email" placeholder="Email address" className="pl-10" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
            <Input type={showPass ? 'text' : 'password'} placeholder="Password" className="pl-10 pr-10" value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 text-slate-400">
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-white/10"></div>
          <span className="px-3 text-sm text-slate-500">or</span>
          <div className="flex-1 border-t border-white/10"></div>
        </div>

        <Button variant="outline" className="w-full border-violet-500/30 hover:bg-violet-500/10" onClick={handleDemo} disabled={loading}>
          Explore Demo Mode
        </Button>

        <div className="mt-6 text-center text-sm">
          <Link to="/signup" className="text-slate-400 hover:text-white transition-colors">Don't have an account? <span className="text-violet-400">Sign up</span></Link>
          <br/>
          <Link to="/forgot-password" className="text-slate-400 hover:text-white transition-colors mt-2 inline-block">Forgot password?</Link>
        </div>
      </div>
    </div>
  );
}
