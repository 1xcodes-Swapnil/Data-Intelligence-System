import { AgentState } from '@/types/agent';
import { Badge } from '@/components/ui/badge';
import { Activity, Zap, Shield, TrendingUp } from 'lucide-react';

interface AgentHeaderProps {
  agentState: AgentState;
  currentPrice: number;
}

export function AgentHeader({ agentState, currentPrice }: AgentHeaderProps) {
  const volatilityColors = {
    low: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    high: 'bg-rose-500/20 text-rose-400 border-rose-500/30'
  };

  const modeIcons = {
    adaptive: <Zap className="w-4 h-4" />,
    aggressive: <TrendingUp className="w-4 h-4" />,
    conservative: <Shield className="w-4 h-4" />
  };

  return (
    <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-cyan-500/20 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
              <div className="absolute inset-0 w-3 h-3 bg-cyan-400 rounded-full animate-ping opacity-50" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              Autonomous Data Collection Agent
            </h1>
          </div>
          <Badge variant="outline" className="bg-violet-500/20 text-violet-300 border-violet-500/30">
            Silver Prediction
          </Badge>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-400">Agent:</span>
            <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              ACTIVE
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            {modeIcons[agentState.mode]}
            <span className="text-slate-400">Mode:</span>
            <span className="text-cyan-300 capitalize">{agentState.mode}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-400">Volatility:</span>
            <Badge variant="outline" className={volatilityColors[agentState.volatility]}>
              {agentState.volatility.toUpperCase()}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-400">Next:</span>
            <span className="text-fuchsia-400 font-mono font-bold">{agentState.nextCollectionIn}s</span>
          </div>
        </div>
      </div>
    </header>
  );
}
