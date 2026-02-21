import { DataSource, AgentState } from '@/types/agent';

export const STALENESS_THRESHOLD = 30000; // 30 seconds

export function calculatePriorityScore(source: DataSource): number {
  return (
    source.qualityScore * 0.5 +
    source.freshnessScore * 0.3 +
    source.reliabilityScore * 0.2
  );
}

export function allocateBudget(sources: DataSource[], totalBudget: number): Map<string, number> {
  const activeSources = sources.filter(s => s.status !== 'offline');
  const totalPriority = activeSources.reduce((sum, s) => sum + s.priorityScore, 0);
  
  const allocations = new Map<string, number>();
  activeSources.forEach(source => {
    const allocation = Math.round((source.priorityScore / totalPriority) * totalBudget);
    allocations.set(source.id, allocation);
  });
  
  return allocations;
}

export function getCollectionInterval(volatility: AgentState['volatility']): number {
  switch (volatility) {
    case 'high':
      return 5000 + Math.random() * 5000; // 5-10s
    case 'medium':
      return 10000 + Math.random() * 10000; // 10-20s
    case 'low':
      return 20000 + Math.random() * 15000; // 20-35s
  }
}

export function shouldSkipSource(source: DataSource, agentState: AgentState): { skip: boolean; reason: string } {
  // Check if source is offline
  if (source.status === 'offline') {
    return { skip: true, reason: 'Source is offline' };
  }
  
  // Check quality threshold
  if (source.qualityScore < 60) {
    return { skip: true, reason: `Low quality signal (${source.qualityScore}% < 60% threshold)` };
  }
  
  // Check budget allocation
  if (source.callsUsed >= source.callsAllocated) {
    return { skip: true, reason: `Budget exhausted (${source.callsUsed}/${source.callsAllocated} calls used)` };
  }
  
  // Check staleness - if data is fresh enough, skip collection
  const age = Date.now() - source.lastUpdate;
  if (age < 5000 && source.status === 'active') {
    return { skip: true, reason: `Data still fresh (${Math.round(age/1000)}s old)` };
  }
  
  // Conservative mode - only collect from top sources
  if (agentState.mode === 'conservative' && source.priorityScore < 80) {
    return { skip: true, reason: `Below priority threshold in conservative mode (${source.priorityScore.toFixed(0)} < 80)` };
  }
  
  return { skip: false, reason: '' };
}

export function calculateVolatility(prices: number[]): AgentState['volatility'] {
  if (prices.length < 5) return 'low';
  
  const recent = prices.slice(-10);
  const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const variance = recent.reduce((sum, p) => sum + Math.pow(p - avg, 2), 0) / recent.length;
  const stdDev = Math.sqrt(variance);
  const volatilityPercent = (stdDev / avg) * 100;
  
  if (volatilityPercent > 0.5) return 'high';
  if (volatilityPercent > 0.2) return 'medium';
  return 'low';
}

export function generateSilverPrice(lastPrice: number): number {
  const change = (Math.random() - 0.5) * 0.3; // ±$0.15 max change
  const meanReversion = (30.5 - lastPrice) * 0.02; // Pull toward $30.50
  return Math.max(28, Math.min(33, lastPrice + change + meanReversion));
}

export function generatePrediction(currentPrice: number): { predicted: number; low: number; high: number } {
  const trend = (Math.random() - 0.4) * 0.5; // Slight bullish bias
  const predicted = currentPrice + trend;
  const confidence = 0.3 + Math.random() * 0.4;
  return {
    predicted: Math.round(predicted * 100) / 100,
    low: Math.round((predicted - confidence) * 100) / 100,
    high: Math.round((predicted + confidence) * 100) / 100
  };
}
