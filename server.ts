import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: { 'User-Agent': 'aistudio-build' }
  }
});

// --- SIMULATION STATE ---
let day = 0;
const seasons = ["Spring", "Summer", "Autumn", "Winter"];
let currentSeasonIndex = 0;

let governance = {
  waterLimit: 2000,
  marketShareLimit: 60,
  sustainabilityEnforced: true,
};
let personality = "Conservative Analyst";
let currentDrift = "Risk-Aware Opportunistic Expansion";
let strategicConfidence = 92;
let systemStress = 10;
let strategicMemory = [];

let weatherForecast: any[] = [];
function generateWeather() {
  const types = ["Sunny", "Cloudy", "Light Rain", "Heavy Rain", "Storm"];
  let baseTemp = currentSeasonIndex === 1 ? 30 : currentSeasonIndex === 3 ? 5 : 18;
  return Array.from({length: 5}).map((_, i) => ({
    day: day + i,
    summary: types[Math.floor(Math.random() * types.length)],
    temp: baseTemp + Math.floor(Math.random() * 10 - 5),
    rainProb: Math.floor(Math.random() * 100)
  }));
}
weatherForecast = generateWeather();

let resources = {
  capital: 50000,
  water: 10000,
  land: 100, // acres
  biomass: 5000,
  soilHealth: 100 // Out of 100
};

let economy = {
  wheatPrice: 15,
  tomatoPrice: 20,
  marketVolatility: 0.1,
  supplyDemandShock: 0,
};

let activeCrisis: string | null = null;
let crisisDuration = 0;

let competitors = [
  { name: "AgriCorp", behavior: "Aggressive Expansion", aggression: 0.8, marketShare: 35, trend: "up", status: "Dominating Northern Sectors" },
  { name: "TerraDyn", behavior: "Conservative Sustain", aggression: 0.3, marketShare: 20, trend: "flat", status: "Stabilizing Supply Chains" },
  { name: "HydroMind", behavior: "High-Tech Yields", aggression: 0.6, marketShare: 15, trend: "down", status: "Executing R&D Pivot" },
  { name: "BioForge", behavior: "Volatile Disruptor", aggression: 0.9, marketShare: 5, trend: "up", status: "Launching Hostile Acquisition" }
];

let agentCommunications: any[] = [];
let chronicles: any[] = [
  { day: 0, event: "Cerebro-Kaggriculture OS activated. Neural link established. Initializing autonomous simulation.", type: "milestone" }
];
let agentLogs: any[] = [];
let historicalData : any[] = [];

// Broadcast mechanism
let clients: express.Response[] = [];

function broadcast(data: any) {
  const payload = `data: ${JSON.stringify(data)}\n\n`;
  for (const client of clients) {
    client.write(payload);
  }
}

// Generate realistic natural fluctuations
function randomFluctuation(base: number, volatility: number) {
  const change = (Math.random() - 0.5) * volatility;
  return Math.max(0.1, base * (1 + change));
}

// Ensure positive integers for UI display
const round = (num: number) => Math.round(num * 100) / 100;

// Internal Simulation Loop
setInterval(() => {
  day++;
  if (day % 30 === 0) {
    currentSeasonIndex = (currentSeasonIndex + 1) % 4;
    chronicles.unshift({ day, event: `Phase Shift Detected: Ecosystem transitioning to ${seasons[currentSeasonIndex]} patterns.`, type: "standard" });
  }

  // Environmental stress (Drought in summer, etc.)
  const season = seasons[currentSeasonIndex];
  let waterUsage = 100 + (Math.random() * 20);
  if (season === "Summer") waterUsage = 250 + (Math.random() * 50);
  if (season === "Spring") waterUsage = 50 + (Math.random() * 10);

  // Economy simulation cascades
  economy.marketVolatility = Math.max(0.05, economy.marketVolatility + (Math.random() - 0.5) * 0.02);
  economy.wheatPrice = randomFluctuation(economy.wheatPrice, economy.marketVolatility);
  economy.tomatoPrice = randomFluctuation(economy.tomatoPrice, economy.marketVolatility);
  
  // Resource usage & income
  resources.water = Math.max(0, resources.water - waterUsage + (Math.random() * 50)); // Some rain
  const dailyIncome = (Math.random() * 100 * (economy.wheatPrice / 10)) - 100; // revenue minus operational cost
  resources.capital += dailyIncome;
  
  // System Stress Calculation
  systemStress = Math.min(100, Math.max(0, 
      (resources.water < 3000 ? 40 : 0) + 
      (resources.capital < 20000 ? 30 : 0) + 
      (resources.soilHealth < 50 ? 20 : 0) +
      (activeCrisis ? 50 : 0)
  ));

  // Determine Confidence Drift
  strategicConfidence = Math.max(20, Math.min(100, 100 - systemStress + (Math.random() * 10 - 5)));

  // Drift AI personality based on prolonged stress
  if (systemStress > 70 && strategicConfidence < 50) {
     currentDrift = "Defensive Liquidity Preservation";
  } else if (systemStress < 20 && resources.capital > 80000) {
     currentDrift = "Hyper-Aggressive Market Takeover";
  } else {
     currentDrift = "Calculated Opportunistic Growth";
  }
  
  // Crisis Engine with Cascading Effects
  if (crisisDuration > 0) {
     crisisDuration--;
     
     // Cascading consequences during crisis
     if (activeCrisis === "Severe Drought") {
         resources.water -= 100;
         resources.soilHealth = Math.max(0, resources.soilHealth - 0.5);
         economy.wheatPrice *= 1.05; // Inflationary cascade
     }
     if (activeCrisis === "Market Flash Crash") {
         economy.tomatoPrice *= 0.95;
         economy.wheatPrice *= 0.95;
         resources.capital = Math.max(0, resources.capital - 50); // Liquidity drain
     }

     if (crisisDuration === 0) {
         chronicles.unshift({ day, event: `Ecosystem Status: ${activeCrisis} stabilizing. Recovery phase initiated.`, type: "adaptation" });
         activeCrisis = null;
     }
  } else if (Math.random() < 0.01) { // 1% chance per tick to spawn a crisis naturally
     const crisesList = ["Severe Drought", "Market Flash Crash", "Supply Chain Collapse", "Crop Disease Outbreak"];
     activeCrisis = crisesList[Math.floor(Math.random() * crisesList.length)];
     crisisDuration = 10 + Math.floor(Math.random() * 20);
     
     chronicles.unshift({ day, event: `CRITICAL ALERT: ${activeCrisis} detected. Sweeping systemic impacts projected.`, type: "crisis" });
  }

  // Opponent Behavioral Evolution
  if (day % 10 === 0) {
     competitors.forEach(comp => {
         // Rivals react to market and crises
         if (activeCrisis === "Market Flash Crash") {
             comp.trend = 'down';
             comp.status = "Bleeding Capital - Defensive Posture";
             comp.marketShare = Math.max(1, comp.marketShare - (Math.random() * 2));
         } else if (activeCrisis === "Severe Drought" && comp.name === "HydroMind") {
             comp.trend = 'up';
             comp.status = "Capitalizing on Water Efficiency";
             comp.marketShare += (Math.random() * 3);
         } else {
             // Random organic market battles
             const shift = (Math.random() - 0.5) * 4 * comp.aggression;
             comp.marketShare = Math.max(1, comp.marketShare + shift);
             comp.trend = shift > 1 ? 'up' : shift < -1 ? 'down' : 'flat';
             
             if (comp.trend === 'up') comp.status = "Expanding Territorial Influence";
             else if (comp.trend === 'down') comp.status = "Consolidating Core Assets";
             else comp.status = "Maintaining Static Output";
             
             // Announce major competitive moves
             if (shift > 2.5 && Math.random() < 0.3) {
                 chronicles.unshift({ day, event: `RIVAL INTELLIGENCE: ${comp.name} executing aggressive territorial expansion vectors.`, type: "rival" });
             }
         }
     });
     
     // Normalize market share
     let totalShare = competitors.reduce((acc, c) => acc + c.marketShare, 0);
     // AI share implicitly the remainder, just roughly keeping bounds
     if (totalShare > 90) {
         competitors.forEach(c => c.marketShare *= (90 / totalShare));
     }
  }

  const historyPoint = {
    day,
    season,
    capital: round(resources.capital),
    water: round(resources.water),
    wheatPrice: round(economy.wheatPrice),
    tomatoPrice: round(economy.tomatoPrice),
    systemStress: Math.round(systemStress)
  };
  
  if (day % 5 === 0) weatherForecast = generateWeather();
  else {
    weatherForecast = weatherForecast.filter(w => w.day >= day);
    while (weatherForecast.length < 5) {
      const types = ["Sunny", "Cloudy", "Light Rain", "Heavy Rain", "Storm"];
      let baseTemp = currentSeasonIndex === 1 ? 30 : currentSeasonIndex === 3 ? 5 : 18;
      weatherForecast.push({
        day: weatherForecast[weatherForecast.length - 1].day + 1,
        summary: types[Math.floor(Math.random() * types.length)],
        temp: baseTemp + Math.floor(Math.random() * 10 - 5),
        rainProb: Math.floor(Math.random() * 100)
      });
    }
  }

  historicalData.push(historyPoint);
  if (historicalData.length > 50) historicalData.shift();

  // Simulated internal chat chatter constantly happening
  if (Math.random() < 0.15) {
      const chatAgents = ["Economy", "Risk", "Resource", "Opponent", "Commander"];
      const chatTypes = ["warning", "proposal", "dissent", "consensus"] as const;
      
      let message = "";
      let type = chatTypes[Math.floor(Math.random() * chatTypes.length)];
      
      if (activeCrisis) {
          message = type === "warning" ? `System collapse probability rising due to ${activeCrisis}.` : `Proposing emergency yield suspension to preserve capital.`;
      } else if (systemStress > 60) {
           message = type === "dissent" ? `Objecting to further expansion. Resources unstable.` : `Warning: Water reserves reaching critical threshold.`;
      } else {
           message = type === "proposal" ? `Recommend aggressive northern territory acquisition.` : `Market variables stable. Maintaining current vector.`;
      }

      agentCommunications.unshift({
          id: Math.random().toString(),
          agent: chatAgents[Math.floor(Math.random() * chatAgents.length)],
          type,
          message
      });
      if (agentCommunications.length > 15) agentCommunications.pop();
  }

  broadcast({
    type: "TICK",
    payload: {
      day,
      season,
      activeCrisis,
      systemStress: Math.round(systemStress),
      governance,
      personality,
      currentDrift,
      strategicConfidence: Math.round(strategicConfidence),
      weatherForecast,
      resources: {
        capital: round(resources.capital),
        water: round(resources.water),
        land: resources.land,
        biomass: round(resources.biomass),
        soilHealth: round(resources.soilHealth)
      },
      economy: {
        wheatPrice: round(economy.wheatPrice),
        tomatoPrice: round(economy.tomatoPrice),
        marketVolatility: round(economy.marketVolatility)
      },
      competitors,
      historicalData,
      agentCommunications,
      chronicles,
      agentLogs,
    }
  });

}, 2000); // Tick every 2 seconds


// Autonomous Strategy Engine (Gemini) triggering every 20 seconds
setInterval(async () => {
    try {
        const prompt = `You are the Commander AI for a high-stakes agricultural simulation infrastructure.
Your Core Personality Base: "${personality}"
Current Adaptive Strategic Drift: "${currentDrift}" (Modify decisions heavily based on this recent drift).
System Stress Level: ${systemStress}/100 (High stress demands stabilization over expansion).
Active Crises: ${activeCrisis || 'None'}
Governance Constraints: Max Water Usage / tick: ${governance.waterLimit}, Sustainability Enforced: ${governance.sustainabilityEnforced} (Requires maintaining soil health via crop rotation).

Current State:
Season: ${seasons[currentSeasonIndex]} (Day ${day})
Capital: $${round(resources.capital)}
Water: ${round(resources.water)} megaliters
Land: ${resources.land} acres
Soil Health: ${round(resources.soilHealth)}%
Wheat Price: ${round(economy.wheatPrice)}
Tomato Price: ${round(economy.tomatoPrice)}
Weather Forecast (Next 5 Days): ${JSON.stringify(weatherForecast.map(f => f.summary))}
Competitors: ${JSON.stringify(competitors.map(c => ({n: c.name, stat: c.status})))}

Task: Provide your next autonomous execution step. Choose a specific agent (Commander, Economy, Resource, Risk, Opponent, Reflection), decide an action based on current state, and provide concise reasoning.
Additionally, simulate your logic flow inside "decisionTree", an array of 3 distinct step objects outlining your analytical reasoning path to reach this decision. If crop rotation is advised, explicitly cite planting 'Legumes' to restore soil health.
Include projected future impacts in "futureSimulation".
Output JSON only:
{
  "agent": "Name of agent",
  "decision": "Short decision title (e.g. Plant Legumes for Rotation, Aggressive Land Expansion)",
  "reasoning": [ "Bullet point 1", "Bullet point 2", "Bullet point 3" ],
  "decisionTree": [
     {"step": "Analyze Market", "output": "Findings"},
     {"step": "Evaluate Risk", "output": "Risk summary"},
     {"step": "Finalize Strategy", "output": "Conclusion"}
  ],
  "rejectedAlternatives": ["Alternative 1", "Alternative 2"],
  "confidenceScore": 0-100,
  "riskScore": 0-100,
  "futureSimulation": {
     "capitalImpact": "+15%",
     "waterImpact": "-10%",
     "survivalProbability": 0-100
  }
}`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });
        
        let decisionData;
        try {
            decisionData = JSON.parse(response.text.trim().replace(/```json/g, '').replace(/```/g, ''));
        } catch (parseError) {
             console.error("AI JSON Parse Error", parseError);
             return;
        }

        const newLog = {
            id: Date.now().toString(),
            timestamp: `Day ${day} - ${seasons[currentSeasonIndex]}`,
            ...decisionData,
            confidenceScore: Math.min(decisionData.confidenceScore, strategicConfidence + 15) // constrain to system drift limits
        };
        
        agentLogs.unshift(newLog);
        if (agentLogs.length > 20) agentLogs.pop(); // keep last 20 logs
        
        // Log major decisions to chronicles
        if (chronicles.length === 0 || decisionData.decision !== chronicles[0].event) {
             chronicles.unshift({ day, event: `Strategic Shift: ${decisionData.decision} - Conf: ${newLog.confidenceScore}%`, type: "adaptation" });
             if (chronicles.length > 100) chronicles.pop();
        }
        
        // Minor state impact based on decision to make it feel real
        const dStr = newLog.decision.toLowerCase();
        if (dStr.includes("water") || dStr.includes("irrigation")) {
            resources.water += 1000;
        } else if (dStr.includes("expand") || dStr.includes("acquire")) {
            resources.land += 10;
            resources.capital -= 5000;
        }
        
        // Crop rotation logic applied via AI intent
        if (dStr.includes("legume") || dStr.includes("rotation") || dStr.includes("restor")) {
            resources.soilHealth = Math.min(100, resources.soilHealth + 15);
            resources.capital -= 500;
        } else if (dStr.includes("plant") || dStr.includes("wheat") || dStr.includes("tomato") || dStr.includes("harvest")) {
            resources.soilHealth = Math.max(10, resources.soilHealth - 8);
        }

        broadcast({
            type: "AI_DECISION",
            payload: newLog
        });

    } catch (err: any) {
        // Suppressing the raw error log so it doesn't clutter AI Studio logs as a hard crash
        const errMsg = err?.message || String(err);
        if (errMsg.includes("503") || errMsg.includes("429") || errMsg.includes("quota")) {
            console.log(`[Neural Link] Temporary latency detected (${err?.status || 'throttle'}). Engaging autonomous fallback...`);
        } else {
            console.log(`[Neural Link] Sub-system degraded: ${errMsg.split('\n')[0]}. Using failover protocols.`);
        }
        // Fallback decision to maintain simulation immersion if API limits are hit or service is temporarily unavailable
        const fallbackLog = {
            id: Date.now().toString(),
            timestamp: `Day ${day} - ${seasons[currentSeasonIndex]}`,
            agent: "Emergency Backup",
            decision: "Conserve resources due to neural link latency",
            reasoning: ["High cognitive load detected in primary neural cluster", "Executing local contingency protocols", "Maintaining current state"],
            decisionTree: [
                 {"step": "Telemetry Check", "output": "API link degraded (429/503)"},
                 {"step": "Assess Risk", "output": "Blind actions pose high risk"},
                 {"step": "Fallback Action", "output": "Engage conservation mode"}
            ],
            rejectedAlternatives: ["Expand territory", "Initiate Trade"],
            confidenceScore: 40,
            riskScore: 20,
            futureSimulation: {
                capitalImpact: "+0%",
                waterImpact: "+0%",
                survivalProbability: 85
            }
        };
        
        agentLogs.unshift(fallbackLog);
        if (agentLogs.length > 20) agentLogs.pop();
        
        broadcast({
            type: "AI_DECISION",
            payload: fallbackLog
        });
    }
}, 45000); // 45 seconds


async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API ROUTES
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/stream", (req, res) => {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive"
    });
    
    clients.push(res);
    
    res.write(`data: ${JSON.stringify({ 
      type: "INIT", 
      payload: { day, season: seasons[currentSeasonIndex], activeCrisis, governance, personality, weatherForecast, resources, economy, competitors, historicalData, agentCommunications, chronicles, agentLogs } 
    })}\n\n`);

    req.on("close", () => {
      clients = clients.filter(c => c !== res);
    });
  });

  app.post("/api/intervention", (req, res) => {
      // Allow user/dashboard to manually trigger an extreme event or change
      const { action } = req.body;
      if (action === "inject_capital") {
          resources.capital += 50000;
          chronicles.unshift({ day, event: `EXTERNAL OVERRIDE: Massive VC Capital Injection Received.`, type: "milestone" });
      }
      if (action === "drought") {
          activeCrisis = "Severe Drought";
          crisisDuration = 30;
          resources.water = Math.max(0, resources.water - 5000);
          chronicles.unshift({ day, event: `EXTERNAL OVERRIDE: Severe Drought Induced manually.`, type: "crisis" });
      }
      if (action === "showcase_scenario") {
          activeCrisis = "Market Flash Crash";
          crisisDuration = 45;
          economy.tomatoPrice *= 0.3;
          economy.wheatPrice *= 0.4;
          resources.water -= 3000;
          competitors[0].marketShare += 25; // AgriCorp takes over
          competitors[0].trend = 'up';
          competitors[0].status = "Hostile Takeover Imminent";
          chronicles.unshift({ day, event: `SHOWCASE INITIALIZATION: Perfect storm crisis conditions synthesized.`, type: "crisis" });
      }
      res.json({ success: true });
  });

  app.post("/api/config", (req, res) => {
      const { newGovernance, newPersonality } = req.body;
      if (newGovernance) governance = { ...governance, ...newGovernance };
      if (newPersonality) personality = newPersonality;
      res.json({ success: true, governance, personality });
  });

  // VITE MIDDLEWARE FOR DEVELOPMENT
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
