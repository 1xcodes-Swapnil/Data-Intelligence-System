import { AgentState } from '@/types/agent';
import { Clock, Brain, Zap } from 'lucide-react';

interface DecisionPanelProps {
  agentState: AgentState;
}

export function DecisionPanel({ agentState }: DecisionPanelProps) {
  const getVolatilityReason = () => {
    switch (agentState.volatility) {
      case 'high':
        return 'High price volatility detected - increasing collection frequency for accuracy';
      case 'medium':
        return 'Moderate volatility - balanced collection rate';
      case 'low':
        return 'Stable market conditions - conserving resources with slower collection';
    }
  };

  const getIntervalExplanation = () => {
    switch (agentState.volatility) {
      case 'high':
        return '5-10s (aggressive)';
      case 'medium':
        return '10-20s (balanced)';
      case 'low':
        return '20-35s (conservative)';
    }
  };

  return (
    <div className="rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-violet-400" />
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
          Agent Decision System
        </h3>
      </div>

      <div className="space-y-4">
        {/* WHEN section */}
        <div className="bg-slate-800/50 rounded-xl p-4 border border-cyan-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-400 font-medium text-sm">WHEN to Collect</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Next collection in:</span>
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold font-mono text-white">
                {agentState.nextCollectionIn}
              </div>
              <span className="text-slate-500">seconds</span>
            </div>
          </div>
          <div className="text-xs text-slate-500">
            Interval: {getIntervalExplanation()}
          </div>
          {/* Progress bar for countdown */}
          <div className="mt-2 h-1 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 transition-all duration-1000"
              style={{ 
                width: `${Math.max(0, (1 - agentState.nextCollectionIn / 35) * 100)}%` 
              }}
            />
          </div>
        </div>

        {/* WHY section */}
        <div className="bg-slate-800/50 rounded-xl p-4 border border-violet-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-violet-400" />
            <span className="text-violet-400 font-medium text-sm">WHY this Timing</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            {getVolatilityReason()}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-slate-500">Current volatility:</span>
            <div className={`
              px-2 py-0.5 rounded text-xs font-medium uppercase
              ${agentState.volatility === 'high' ? 'bg-rose-500/20 text-rose-400' : ''}
              ${agentState.volatility === 'medium' ? 'bg-amber-500/20 text-amber-400' : ''}
              ${agentState.volatility === 'low' ? 'bg-emerald-500/20 text-emerald-400' : ''}
            `}>
              {agentState.volatility}
            </div>
          </div>
        </div>

        {/* Algorithm explanation */}
        <div className="bg-gradient-to-r from-fuchsia-500/10 to-violet-500/10 rounded-xl p-4 border border-fuchsia-500/20">
          <div className="text-xs text-slate-400 mb-2">Priority Score Formula:</div>
          <code className="text-xs text-fuchsia-300 bg-slate-900/50 px-2 py-1 rounded block">
            score = (quality × 0.5) + (freshness × 0.3) + (reliability × 0.2)
          </code>
        </div>
      </div>
    </div>
  );
}
