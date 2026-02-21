import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { PriceData } from '@/types/agent';

interface PriceDisplayProps {
  currentPrice: number;
  priceHistory: PriceData[];
}

export function PriceDisplay({ currentPrice, priceHistory }: PriceDisplayProps) {
  const [prevPrice, setPrevPrice] = useState(currentPrice);
  const [flash, setFlash] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    if (currentPrice !== prevPrice) {
      setFlash(currentPrice > prevPrice ? 'up' : 'down');
      setPrevPrice(currentPrice);
      const timer = setTimeout(() => setFlash(null), 500);
      return () => clearTimeout(timer);
    }
  }, [currentPrice, prevPrice]);

  const priceChange = priceHistory.length > 1 
    ? currentPrice - priceHistory[0].price 
    : 0;
  const priceChangePercent = priceHistory.length > 1 
    ? ((currentPrice - priceHistory[0].price) / priceHistory[0].price) * 100 
    : 0;
  const isUp = priceChange >= 0;

  const latestPrediction = priceHistory[priceHistory.length - 1];

  return (
    <div className={`
      relative overflow-hidden rounded-2xl p-6
      bg-gradient-to-br from-slate-800/80 to-slate-900/80
      border border-slate-700/50
      transition-all duration-300
      ${flash === 'up' ? 'ring-2 ring-emerald-500/50' : ''}
      ${flash === 'down' ? 'ring-2 ring-rose-500/50' : ''}
    `}>
      {/* Background glow */}
      <div className={`
        absolute inset-0 opacity-20 blur-3xl
        ${isUp ? 'bg-emerald-500' : 'bg-rose-500'}
      `} />
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">🪙</span>
          <span className="text-slate-400 text-sm font-medium">SILVER / USD</span>
        </div>
        
        <div className="flex items-baseline gap-3 mb-4">
          <span className={`
            text-5xl font-bold font-mono tracking-tight
            ${flash === 'up' ? 'text-emerald-400' : ''}
            ${flash === 'down' ? 'text-rose-400' : ''}
            ${!flash ? 'text-white' : ''}
            transition-colors duration-300
          `}>
            ${currentPrice.toFixed(2)}
          </span>
          <span className="text-slate-500 text-lg">/oz</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className={`
            flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium
            ${isUp 
              ? 'bg-emerald-500/20 text-emerald-400' 
              : 'bg-rose-500/20 text-rose-400'
            }
          `}>
            {isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{isUp ? '+' : ''}{priceChange.toFixed(2)}</span>
            <span>({isUp ? '+' : ''}{priceChangePercent.toFixed(2)}%)</span>
          </div>
          
          <span className="text-slate-500 text-sm">Session</span>
        </div>

        {latestPrediction && (
          <div className="mt-4 pt-4 border-t border-slate-700/50">
            <div className="text-slate-400 text-xs mb-2">NEXT HOUR PREDICTION</div>
            <div className="flex items-center gap-3">
              <span className="text-cyan-400 font-mono text-lg font-semibold">
                ${latestPrediction.predicted?.toFixed(2)}
              </span>
              <span className="text-slate-500 text-sm">
                ({latestPrediction.confidenceLow?.toFixed(2)} - {latestPrediction.confidenceHigh?.toFixed(2)})
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
