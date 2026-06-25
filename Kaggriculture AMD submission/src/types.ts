export type SimulationState = {
  day: number;
  season: string;
  activeCrisis: string | null;
  systemStress: number;
  governance: {
    waterLimit: number;
    marketShareLimit: number;
    sustainabilityEnforced: boolean;
  };
  personality: string;
  currentDrift: string;
  strategicConfidence: number;
  weatherForecast: Array<{
    day: number;
    summary: string;
    temp: number;
    rainProb: number;
  }>;
  resources: {
    capital: number;
    water: number;
    land: number;
    biomass: number;
    soilHealth: number;
  };
  economy: {
    wheatPrice: number;
    tomatoPrice: number;
    marketVolatility: number;
  };
  competitors: Array<{
    name: string;
    behavior: string;
    aggression: number;
    marketShare: number;
    trend: 'up' | 'down' | 'flat';
    status: string;
  }>;
  historicalData: Array<{
    day: number;
    season: string;
    capital: number;
    water: number;
    wheatPrice: number;
    tomatoPrice: number;
    systemStress: number;
  }>;
  agentCommunications: Array<{
    id: string;
    agent: string;
    message: string;
    type: 'warning' | 'proposal' | 'dissent' | 'consensus';
  }>;
  chronicles: Array<{
    day: number;
    event: string;
    type?: 'crisis' | 'milestone' | 'rival' | 'adaptation' | 'standard';
  }>;
  agentLogs: Array<{
    id: string;
    timestamp: string;
    agent: string;
    decision: string;
    reasoning: string[];
    decisionTree: Array<{ step: string; output: string }>;
    rejectedAlternatives: string[];
    confidenceScore: number;
    riskScore: number;
    futureSimulation: {
      capitalImpact: string;
      waterImpact: string;
      survivalProbability: number;
    };
  }>;
};

