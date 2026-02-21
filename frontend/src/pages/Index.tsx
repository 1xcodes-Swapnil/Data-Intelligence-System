import { useAutonomousAgent } from '@/hooks/useAutonomousAgent';
import { AgentHeader } from '@/components/dashboard/AgentHeader';
import { PriceDisplay } from '@/components/dashboard/PriceDisplay';
import { DecisionPanel } from '@/components/dashboard/DecisionPanel';
import { SourceRanking } from '@/components/dashboard/SourceRanking';
import { BudgetAllocation } from '@/components/dashboard/BudgetAllocation';
import { StalenessMonitor } from '@/components/dashboard/StalenessMonitor';
import { PriceChart } from '@/components/dashboard/PriceChart';
import { ActivityLog } from '@/components/dashboard/ActivityLog';

const Index = () => {
  const { sources, decisions, agentState, priceHistory, currentPrice } = useAutonomousAgent();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <AgentHeader agentState={agentState} currentPrice={currentPrice} />
      
      <main className="p-6">
        <div className="max-w-[1800px] mx-auto space-y-6">
          {/* Top row: Price + Decision Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <PriceDisplay currentPrice={currentPrice} priceHistory={priceHistory} />
            <div className="lg:col-span-2">
              <DecisionPanel agentState={agentState} />
            </div>
          </div>

          {/* Price chart */}
          <PriceChart priceHistory={priceHistory} currentPrice={currentPrice} />

          {/* Main content: Sources + Budget + Log */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <SourceRanking sources={sources} />
            <BudgetAllocation sources={sources} agentState={agentState} />
            <ActivityLog decisions={decisions} />
          </div>

          {/* Staleness monitor */}
          <StalenessMonitor sources={sources} />
        </div>
      </main>
    </div>
  );
};

export default Index;
