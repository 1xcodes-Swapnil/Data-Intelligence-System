import { AgentDecision } from '@/types/agent';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, RefreshCw, AlertTriangle, Wallet } from 'lucide-react';

interface ActivityLogProps {
  decisions: AgentDecision[];
}

export function ActivityLog({ decisions }: ActivityLogProps) {
  const getIcon = (type: AgentDecision['type']) => {
    switch (type) {
      case 'collect':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'skip':
        return <XCircle className="w-4 h-4 text-amber-400" />;
      case 'staleness':
        return <AlertTriangle className="w-4 h-4 text-rose-400" />;
      case 'reallocate':
        return <RefreshCw className="w-4 h-4 text-violet-400" />;
      case 'budget':
        return <Wallet className="w-4 h-4 text-cyan-400" />;
    }
  };

  const getTypeBadge = (type: AgentDecision['type']) => {
    const styles = {
      collect: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      skip: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      staleness: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
      reallocate: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
      budget: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
    };
    return styles[type];
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
            Agent Activity Log
          </h3>
        </div>
        <span className="text-xs text-slate-500">Real-Time</span>
      </div>

      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-2">
          {decisions.length === 0 ? (
            <div className="text-center text-slate-500 py-8">
              Waiting for agent decisions...
            </div>
          ) : (
            decisions.map((decision) => (
              <div
                key={decision.id}
                className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/30 animate-fade-in"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{getIcon(decision.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-slate-500 font-mono">
                        {formatTime(decision.timestamp)}
                      </span>
                      <Badge variant="outline" className={`text-[10px] ${getTypeBadge(decision.type)}`}>
                        {decision.type.toUpperCase()}
                      </Badge>
                      {decision.sourceName && (
                        <span className="text-xs text-cyan-400">{decision.sourceName}</span>
                      )}
                    </div>
                    <p className="text-sm text-slate-300">{decision.reason}</p>
                    {decision.details && (
                      <p className="text-xs text-slate-500 mt-1">{decision.details}</p>
                    )}
                    {decision.resourcesSaved && decision.resourcesSaved > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-xs text-emerald-400">
                          💰 {decision.resourcesSaved} resource(s) saved
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
