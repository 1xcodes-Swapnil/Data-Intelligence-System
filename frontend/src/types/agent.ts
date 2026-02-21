export interface DataSource {
  id: string;
  name: string;
  icon: string;
  qualityScore: number;
  freshnessScore: number;
  reliabilityScore: number;
  lastUpdate: number;
  status: 'active' | 'stale' | 'offline' | 'refreshing';
  callsUsed: number;
  callsAllocated: number;
  priorityScore: number;
  isSelected: boolean;
  skipReason?: string;
}

export interface AgentDecision {
  id: string;
  timestamp: number;
  type: 'collect' | 'skip' | 'reallocate' | 'staleness' | 'budget';
  sourceId?: string;
  sourceName?: string;
  reason: string;
  details?: string;
  resourcesSaved?: number;
}

export interface AgentState {
  mode: 'adaptive' | 'aggressive' | 'conservative';
  isActive: boolean;
  volatility: 'low' | 'medium' | 'high';
  nextCollectionIn: number;
  totalBudget: number;
  budgetUsed: number;
  resourcesSaved: number;
  collectionsToday: number;
  skippedToday: number;
}

export interface PriceData {
  timestamp: number;
  price: number;
  predicted?: number;
  confidenceLow?: number;
  confidenceHigh?: number;
  source?: string;
}

export interface CollectionEvent {
  timestamp: number;
  sources: string[];
  avgQuality: number;
}
