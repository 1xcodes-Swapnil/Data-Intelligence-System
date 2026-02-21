import { useState, useEffect } from 'react';
import { DataSource } from '@/types/agent';
import { STALENESS_THRESHOLD } from '@/lib/agentLogic';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface StalenessMonitorProps {
  sources: DataSource[];
}

export function StalenessMonitor({ sources }: StalenessMonitorProps) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const getAgeDisplay = (lastUpdate: number) => {
    const age = Math.round((now - lastUpdate) / 1000);
    return `${age}s`;
  };

  const getAgePercent = (lastUpdate: number) => {
    const age = now - lastUpdate;
    return Math.min(100, (age / STALENESS_THRESHOLD) * 100);
  };

  const getStatusColor = (lastUpdate: number) => {
    const agePercent = getAgePercent(lastUpdate);
    if (agePercent >= 100) return 'text-rose-400';
    if (agePercent >= 70) return 'text-amber-400';
    return 'text-emerald-400';
  };

  const getBarColor = (lastUpdate: number) => {
    const agePercent = getAgePercent(lastUpdate);
    if (agePercent >= 100) return 'from-rose-500 to-rose-400';
    if (agePercent >= 70) return 'from-amber-500 to-amber-400';
    return 'from-emerald-500 to-emerald-400';
  };

  return (
    <div className="rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
            Staleness Monitor
          </h3>
        </div>
        <div className="text-xs text-slate-500">
          Threshold: {STALENESS_THRESHOLD / 1000}s
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-slate-500 text-xs uppercase">
              <th className="text-left pb-3">Source</th>
              <th className="text-center pb-3">Age</th>
              <th className="text-center pb-3">Freshness</th>
              <th className="text-center pb-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/30">
            {sources.map((source) => {
              const isStale = getAgePercent(source.lastUpdate) >= 100;
              return (
                <tr key={source.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{source.icon}</span>
                      <span className="text-slate-300">{source.name}</span>
                    </div>
                  </td>
                  <td className="text-center py-3">
                    <span className={`font-mono font-medium ${getStatusColor(source.lastUpdate)}`}>
                      {getAgeDisplay(source.lastUpdate)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${getBarColor(source.lastUpdate)} transition-all duration-500`}
                        style={{ width: `${100 - getAgePercent(source.lastUpdate)}%` }}
                      />
                    </div>
                  </td>
                  <td className="text-center py-3">
                    {isStale ? (
                      <div className="flex items-center justify-center gap-1 text-rose-400">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-xs font-medium">STALE</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-1 text-emerald-400">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-xs font-medium">FRESH</span>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
