import { useState, useEffect, useCallback, useRef } from 'react';
import { DataSource, AgentDecision, AgentState, PriceData } from '@/types/agent';
import {
  calculatePriorityScore,
  allocateBudget,
  getCollectionInterval,
  shouldSkipSource,
  calculateVolatility,
  generateSilverPrice,
  generatePrediction,
  STALENESS_THRESHOLD
} from '@/lib/agentLogic';

const INITIAL_SOURCES: DataSource[] = [
  {
    id: 'reuters',
    name: 'Reuters API',
    icon: '📰',
    qualityScore: 92,
    freshnessScore: 95,
    reliabilityScore: 98,
    lastUpdate: Date.now(),
    status: 'active',
    callsUsed: 0,
    callsAllocated: 350,
    priorityScore: 0,
    isSelected: false
  },
  {
    id: 'lbma',
    name: 'LBMA Feed',
    icon: '🏦',
    qualityScore: 89,
    freshnessScore: 88,
    reliabilityScore: 95,
    lastUpdate: Date.now(),
    status: 'active',
    callsUsed: 0,
    callsAllocated: 280,
    priorityScore: 0,
    isSelected: false
  },
  {
    id: 'metals',
    name: 'MetalsAPI',
    icon: '⚙️',
    qualityScore: 85,
    freshnessScore: 82,
    reliabilityScore: 88,
    lastUpdate: Date.now(),
    status: 'active',
    callsUsed: 0,
    callsAllocated: 220,
    priorityScore: 0,
    isSelected: false
  },
  {
    id: 'yahoo',
    name: 'Yahoo Finance',
    icon: '📊',
    qualityScore: 78,
    freshnessScore: 75,
    reliabilityScore: 82,
    lastUpdate: Date.now() - 40000, // Start stale
    status: 'stale',
    callsUsed: 0,
    callsAllocated: 150,
    priorityScore: 0,
    isSelected: false
  }
];

export function useAutonomousAgent() {
  const [sources, setSources] = useState<DataSource[]>(() => 
    INITIAL_SOURCES.map(s => ({ ...s, priorityScore: calculatePriorityScore(s) }))
  );
  const [decisions, setDecisions] = useState<AgentDecision[]>([]);
  const [agentState, setAgentState] = useState<AgentState>({
    mode: 'adaptive',
    isActive: true,
    volatility: 'medium',
    nextCollectionIn: 15,
    totalBudget: 1000,
    budgetUsed: 0,
    resourcesSaved: 0,
    collectionsToday: 0,
    skippedToday: 0
  });
  const [priceHistory, setPriceHistory] = useState<PriceData[]>([]);
  const [currentPrice, setCurrentPrice] = useState(30.45);
  
  const pricesRef = useRef<number[]>([30.45]);
  const countdownRef = useRef<number>(15);

  const addDecision = useCallback((decision: Omit<AgentDecision, 'id' | 'timestamp'>) => {
    const newDecision: AgentDecision = {
      ...decision,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now()
    };
    setDecisions(prev => [newDecision, ...prev].slice(0, 50));
  }, []);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      countdownRef.current -= 1;
      setAgentState(prev => ({
        ...prev,
        nextCollectionIn: Math.max(0, countdownRef.current)
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Update staleness status
  useEffect(() => {
    const interval = setInterval(() => {
      setSources(prev => prev.map(source => {
        const age = Date.now() - source.lastUpdate;
        const isStale = age > STALENESS_THRESHOLD;
        
        if (isStale && source.status === 'active') {
          addDecision({
            type: 'staleness',
            sourceId: source.id,
            sourceName: source.name,
            reason: `Data became stale (${Math.round(age/1000)}s > ${STALENESS_THRESHOLD/1000}s threshold)`,
            details: 'Queuing automatic refresh'
          });
        }
        
        return {
          ...source,
          status: source.status === 'offline' ? 'offline' : (isStale ? 'stale' : 'active'),
          freshnessScore: Math.max(0, 100 - (age / 1000) * 2)
        };
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, [addDecision]);

  // Main collection cycle
  useEffect(() => {
    const runCollection = () => {
      const newPrice = generateSilverPrice(currentPrice);
      const prediction = generatePrediction(newPrice);
      
      pricesRef.current = [...pricesRef.current, newPrice].slice(-100);
      setCurrentPrice(newPrice);
      
      const volatility = calculateVolatility(pricesRef.current);
      setAgentState(prev => ({ ...prev, volatility }));
      
      // Determine which sources to use
      let resourcesSaved = 0;
      let collectionsCount = 0;
      let skipsCount = 0;
      
      setSources(prev => {
        const updated = prev.map(source => {
          const { skip, reason } = shouldSkipSource(source, agentState);
          
          if (skip) {
            skipsCount++;
            resourcesSaved += 1; // Each skipped call saves 1 resource unit
            addDecision({
              type: 'skip',
              sourceId: source.id,
              sourceName: source.name,
              reason: `Skipped: ${reason}`,
              resourcesSaved: 1
            });
            return { ...source, isSelected: false, skipReason: reason };
          } else {
            collectionsCount++;
            // Simulate quality fluctuation
            const qualityDelta = (Math.random() - 0.5) * 4;
            const newQuality = Math.min(100, Math.max(50, source.qualityScore + qualityDelta));
            
            addDecision({
              type: 'collect',
              sourceId: source.id,
              sourceName: source.name,
              reason: `Collected data (quality: ${newQuality.toFixed(0)}%)`,
              details: `Priority score: ${source.priorityScore.toFixed(1)}`
            });
            
            return {
              ...source,
              isSelected: true,
              skipReason: undefined,
              lastUpdate: Date.now(),
              status: 'active' as const,
              qualityScore: newQuality,
              freshnessScore: 100,
              callsUsed: source.callsUsed + 1,
              priorityScore: calculatePriorityScore({ ...source, qualityScore: newQuality, freshnessScore: 100 })
            };
          }
        });
        
        // Reallocate budget based on new priority scores
        const allocations = allocateBudget(updated, agentState.totalBudget);
        return updated.map(s => ({
          ...s,
          callsAllocated: allocations.get(s.id) || s.callsAllocated
        }));
      });
      
      setAgentState(prev => ({
        ...prev,
        budgetUsed: prev.budgetUsed + collectionsCount,
        resourcesSaved: prev.resourcesSaved + resourcesSaved,
        collectionsToday: prev.collectionsToday + collectionsCount,
        skippedToday: prev.skippedToday + skipsCount
      }));
      
      // Add price to history
      setPriceHistory(prev => [...prev, {
        timestamp: Date.now(),
        price: newPrice,
        predicted: prediction.predicted,
        confidenceLow: prediction.low,
        confidenceHigh: prediction.high
      }].slice(-60));
      
      // Set next collection interval
      const nextInterval = getCollectionInterval(volatility);
      countdownRef.current = Math.round(nextInterval / 1000);
      setAgentState(prev => ({ ...prev, nextCollectionIn: countdownRef.current }));
      
      if (resourcesSaved > 0) {
        addDecision({
          type: 'budget',
          reason: `Cycle complete: ${collectionsCount} collected, ${skipsCount} skipped`,
          resourcesSaved,
          details: `Total resources saved this session: ${agentState.resourcesSaved + resourcesSaved}`
        });
      }
    };
    
    // Initial run
    runCollection();
    
    // Set up adaptive interval
    const scheduleNext = () => {
      const interval = getCollectionInterval(agentState.volatility);
      return setTimeout(() => {
        runCollection();
        scheduleNext();
      }, interval);
    };
    
    const timeoutId = scheduleNext();
    return () => clearTimeout(timeoutId);
  }, []);

  return {
    sources,
    decisions,
    agentState,
    priceHistory,
    currentPrice
  };
}
