import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0a0a0a]">
      <div className="w-full max-w-md bg-[#16162a] border border-white/10 p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Reset your password</h2>
        
        {sent ? (
          <div className="text-center space-y-4">
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm">
              If an account exists with that email, we've sent a reset link.
            </div>
            <Link to="/login" className="inline-flex items-center text-sm text-violet-400 hover:text-violet-300">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
              <Input type="email" placeholder="Email address" className="pl-10" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700">Send Reset Link</Button>
            <div className="text-center mt-4">
              <Link to="/login" className="text-sm text-slate-400 hover:text-white">Back to login</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
