import { useRef, useState } from 'react';
import { formatTime } from '@/lib/utils';

export default function ProgressBar({ currentTime, duration, onSeek }: any) {
  const barRef = useRef<HTMLDivElement>(null);
  const [hoverPct, setHoverPct] = useState<number | null>(null);

  const calcPct = (e: React.MouseEvent) => {
    if (!barRef.current) return 0;
    const rect = barRef.current.getBoundingClientRect();
    return Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  };

  const handleClick = (e: React.MouseEvent) => onSeek(calcPct(e) * duration);
  const handleMouseMove = (e: React.MouseEvent) => setHoverPct(calcPct(e));
  const currentPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div 
      className="relative h-2 group cursor-pointer flex items-center"
      ref={barRef}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoverPct(null)}
    >
      <div className="absolute w-full h-1 bg-white/20 rounded-full group-hover:h-1.5 transition-all"></div>
      <div className="absolute h-1 bg-primary rounded-full group-hover:h-1.5 transition-all" style={{ width: `${currentPct}%` }}></div>
      <div className="absolute h-3 w-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity -ml-1.5 shadow" style={{ left: `${currentPct}%` }}></div>
      
      {hoverPct !== null && (
        <div className="absolute bottom-4 -ml-4 px-2 py-1 bg-black/80 rounded text-xs font-medium tabular-nums pointer-events-none" style={{ left: `${hoverPct * 100}%` }}>
          {formatTime(hoverPct * duration)}
        </div>
      )}
    </div>
  );
}
