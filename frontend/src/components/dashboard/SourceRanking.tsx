import { DataSource } from '@/types/agent';
import { Badge } from '@/components/ui/badge';
import { Check, X, AlertTriangle, RefreshCw } from 'lucide-react';

interface SourceRankingProps {
  sources: DataSource[];
}

export function SourceRanking({ sources }: SourceRankingProps) {
  const sortedSources = [...sources].sort((a, b) => b.priorityScore - a.priorityScore);

  const getStatusBadge = (source: DataSource) => {
    if (source.isSelected) {
      return (
        <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 gap-1">
          <Check className="w-3 h-3" />
          SELECTED
        </Badge>
      );
    }
    if (source.status === 'stale') {
      return (
        <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30 gap-1">
          <RefreshCw className="w-3 h-3" />
          STALE
        </Badge>
      );
    }
    if (source.status === 'offline') {
      return (
        <Badge className="bg-rose-500/20 text-rose-400 border border-rose-500/30 gap-1">
          <AlertTriangle className="w-3 h-3" />
          OFFLINE
        </Badge>
      );
    }
    return (
      <Badge className="bg-slate-500/20 text-slate-400 border border-slate-500/30 gap-1">
        <X className="w-3 h-3" />
        SKIPPED
      </Badge>
    );
  };

  return (
    <div className="rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">📊</span>
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
          Source Priority Ranking
        </h3>
        <span className="text-xs text-violet-400">(Signal Quality)</span>
      </div>

      <div className="space-y-3">
        {sortedSources.map((source, index) => (
          <div
            key={source.id}
            className={`
              relative overflow-hidden rounded-xl p-4
              transition-all duration-300
              ${source.isSelected 
                ? 'bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30' 
                : 'bg-slate-800/50 border border-slate-700/30'
              }
            `}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`
                  w-8 h-8 rounded-lg flex items-center justify-center text-lg font-bold
                  ${index === 0 ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white' : ''}
                  ${index === 1 ? 'bg-gradient-to-br from-slate-400 to-slate-500 text-white' : ''}
                  ${index === 2 ? 'bg-gradient-to-br from-amber-700 to-amber-800 text-white' : ''}
                  ${index > 2 ? 'bg-slate-700 text-slate-400' : ''}
                `}>
                  #{index + 1}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{source.icon}</span>
                    <span className="font-medium text-white">{source.name}</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Priority Score: {source.priorityScore.toFixed(1)}
                  </div>
                </div>
              </div>
              {getStatusBadge(source)}
            </div>

            {/* Quality bars */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500">Quality</span>
                  <span className="text-cyan-400">{source.qualityScore.toFixed(0)}%</span>
                </div>
                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full transition-all duration-500"
                    style={{ width: `${source.qualityScore}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500">Freshness</span>
                  <span className="text-violet-400">{source.freshnessScore.toFixed(0)}%</span>
                </div>
                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-violet-500 to-violet-400 rounded-full transition-all duration-500"
                    style={{ width: `${source.freshnessScore}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500">Reliability</span>
                  <span className="text-fuchsia-400">{source.reliabilityScore.toFixed(0)}%</span>
                </div>
                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-fuchsia-500 to-fuchsia-400 rounded-full transition-all duration-500"
                    style={{ width: `${source.reliabilityScore}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Skip reason */}
            {source.skipReason && (
              <div className="mt-3 text-xs text-amber-400/80 bg-amber-500/10 px-3 py-2 rounded-lg">
                ⚠️ {source.skipReason}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
