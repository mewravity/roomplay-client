import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, MonitorPlay, ScreenShare, Smile, Mic, Lock, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Landing() {
  const featuresRef = useRef(null);
  const isInView = useInView(featuresRef, { once: true, margin: "-100px" });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden font-sans">
      <nav className="fixed top-0 w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 text-xl font-bold">
          <PlayCircle className="text-violet-500" />
          <span>RoomPlay</span>
        </div>
        <div className="flex gap-4">
          <Link to="/login"><Button variant="ghost">Login</Button></Link>
          <Link to="/signup"><Button className="bg-violet-600 hover:bg-violet-700">Create a Room</Button></Link>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center min-h-[90vh]">
        <motion.div 
          className="flex-1 text-center lg:text-left mb-12 lg:mb-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            Watch together.<br/>
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">Even when you're apart.</span>
          </h1>
          <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto lg:mx-0">
            Create a private room, invite your friends, and watch movies, shows, anime, videos, or your screen together in real time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link to="/signup"><Button size="lg" className="w-full sm:w-auto bg-violet-600 hover:bg-violet-700 text-lg">Create a Room</Button></Link>
            <Link to="/discover"><Button size="lg" variant="outline" className="w-full sm:w-auto text-lg border-white/20 hover:bg-white/5">Join a Room</Button></Link>
          </div>
        </motion.div>

        <motion.div 
          className="flex-1 w-full max-w-lg lg:max-w-xl relative"
          animate={{ y: [-10, 10, -10] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        >
          <div className="rounded-xl border border-white/10 bg-[#16162a] shadow-[0_0_50px_-12px_rgba(124,58,237,0.5)] overflow-hidden aspect-video relative flex flex-col">
            <div className="flex-1 bg-gradient-to-br from-violet-900/40 to-cyan-900/40 relative">
              <motion.div className="absolute right-10 bottom-10 text-4xl" animate={{ y: [0, -100], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 2 }}>❤️</motion.div>
              <motion.div className="absolute right-20 bottom-10 text-4xl" animate={{ y: [0, -150], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 2.5, delay: 0.5 }}>😂</motion.div>
            </div>
            <div className="h-12 bg-[#0a0a0a] border-t border-white/10 flex items-center px-4 gap-4">
              <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center"><PlayCircle size={16} /></div>
              <div className="flex-1 h-1 bg-white/20 rounded-full"><div className="w-1/3 h-full bg-violet-500 rounded-full"></div></div>
            </div>
          </div>
        </motion.div>
      </section>

      <section ref={featuresRef} className="py-24 bg-[#16162a] px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: MonitorPlay, title: "Watch Together", desc: "Synchronize playback with everyone in your room." },
              { icon: ScreenShare, title: "Share Your Screen", desc: "Watch services that can't be embedded using native screen sharing." },
              { icon: Smile, title: "React Together", desc: "Send live reactions that float across the screen." },
              { icon: Mic, title: "Talk While You Watch", desc: "Use voice and optional video chat." },
              { icon: Lock, title: "Private Rooms", desc: "Invite only the people you want." },
              { icon: RefreshCw, title: "Stay Synchronized", desc: "Everyone stays on the same moment." }
            ].map((f, i) => (
              <motion.div 
                key={i}
                className="p-6 rounded-xl bg-white/5 border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center mb-4">
                  <f.icon className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-slate-400">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 text-center px-6">
        <h2 className="text-4xl font-bold mb-8">Ready to watch together?</h2>
        <Link to="/signup"><Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-lg px-8">Get Started Free</Button></Link>
      </section>

      <footer className="border-t border-white/10 py-8 text-center text-slate-500">
        © 2024 RoomPlay. Watch together.
      </footer>
    </div>
  );
}
