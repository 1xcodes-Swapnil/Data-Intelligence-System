import { DataSource, AgentState } from '@/types/agent';
import { Wallet, TrendingDown, CheckCircle2, XCircle } from 'lucide-react';

interface BudgetAllocationProps {
  sources: DataSource[];
  agentState: AgentState;
}

export function BudgetAllocation({ sources, agentState }: BudgetAllocationProps) {
  const sortedSources = [...sources].sort((a, b) => b.callsAllocated - a.callsAllocated);
  const totalAllocated = sources.reduce((sum, s) => sum + s.callsAllocated, 0);
  const totalUsed = sources.reduce((sum, s) => sum + s.callsUsed, 0);
  const budgetRemaining = agentState.totalBudget - agentState.budgetUsed;
  const budgetPercentUsed = (agentState.budgetUsed / agentState.totalBudget) * 100;

  const sourceColors = [
    'from-cyan-500 to-cyan-400',
    'from-violet-500 to-violet-400',
    'from-fuchsia-500 to-fuchsia-400',
    'from-amber-500 to-amber-400'
  ];

  return (
    <div className="rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
            Budget Allocation
          </h3>
        </div>
        <div className="text-xs text-slate-500">
          Adaptive Distribution
        </div>
      </div>

      {/* Overall budget bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-400">Total Budget Usage</span>
          <span className="text-white font-mono">{agentState.budgetUsed} / {agentState.totalBudget} calls</span>
        </div>
        <div className="h-4 bg-slate-700/50 rounded-full overflow-hidden relative">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500 transition-all duration-500"
            style={{ width: `${budgetPercentUsed}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-medium text-white drop-shadow-lg">
              {budgetPercentUsed.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Source allocation visualization */}
      <div className="mb-6">
        <div className="text-xs text-slate-500 mb-2">Per-Source Allocation</div>
        <div className="h-8 bg-slate-700/30 rounded-lg overflow-hidden flex">
          {sortedSources.map((source, index) => {
            const percentage = (source.callsAllocated / totalAllocated) * 100;
            return (
              <div
                key={source.id}
                className={`h-full bg-gradient-to-r ${sourceColors[index]} flex items-center justify-center transition-all duration-500`}
                style={{ width: `${percentage}%` }}
              >
                <span className="text-xs font-medium text-white drop-shadow-md truncate px-1">
                  {source.name.split(' ')[0]} {percentage.toFixed(0)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/30">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-slate-500">Collections</span>
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">
            {agentState.collectionsToday}
          </div>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/30">
          <div className="flex items-center gap-2 mb-1">
            <XCircle className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-slate-500">Skipped</span>
          </div>
          <div className="text-2xl font-bold text-amber-400 font-mono">
            {agentState.skippedToday}
          </div>
        </div>
      </div>

      {/* Resources saved */}
      <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-xl p-4 border border-emerald-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-emerald-400" />
            <span className="text-sm text-slate-300">Resources Saved</span>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-emerald-400 font-mono">
              {agentState.resourcesSaved}
            </div>
            <div className="text-xs text-emerald-400/60">API calls avoided</div>
          </div>
        </div>
      </div>

      {/* Per-source usage */}
      <div className="mt-4 space-y-2">
        <div className="text-xs text-slate-500 mb-2">Per-Source Usage</div>
        {sortedSources.map((source, index) => {
          const usagePercent = (source.callsUsed / source.callsAllocated) * 100;
          return (
            <div key={source.id} className="flex items-center gap-3">
              <span className="text-sm w-24 truncate">{source.icon} {source.name.split(' ')[0]}</span>
              <div className="flex-1 h-2 bg-slate-700/50 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${sourceColors[index]} transition-all duration-300`}
                  style={{ width: `${Math.min(100, usagePercent)}%` }}
                />
              </div>
              <span className="text-xs text-slate-500 w-16 text-right">
                {source.callsUsed}/{source.callsAllocated}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
