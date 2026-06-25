import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip
} from "recharts";
import { 
  BrainCircuit, Sprout, Droplet, DollarSign, Activity, AlertTriangle, ShieldCheck, Zap, Leaf, CloudRain, Sun, Cloud, CloudLightning, ActivitySquare, TerminalSquare, Settings2, ShieldAlert, Cpu
} from "lucide-react";
import { SimulationState } from "./types";
import { cn } from "./lib/utils";

function GlitchText({ children, active }: { children: React.ReactNode, active: boolean }) {
  if (!active) return <>{children}</>;
  return (
    <motion.div animate={{ x: [-1, 1, -2, 2, 0], y: [1, -1, 0, 2, 0] }} transition={{ duration: 0.2, repeat: Infinity, repeatType: "mirror" }} className="inline-block relative">
      <span className="absolute top-0 left-[1px] text-red-500 opacity-70 mix-blend-screen">{children}</span>
      <span className="absolute top-0 left-[-1px] text-blue-500 opacity-70 mix-blend-screen">{children}</span>
      {children}
    </motion.div>
  );
}

function MetricPanel({ title, value, icon: Icon, trend, alert = false, className }: { title: string, value: string | number, icon: any, trend?: string, alert?: boolean, className?: string }) {
  return (
    <div className={cn("bg-[#0A0D10]/80 border backdrop-blur-xl rounded-xl p-4 flex flex-col relative overflow-hidden group transition-all", alert ? "border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.15)]" : "border-white/10", className)}>
      <div className="absolute top-0 right-0 p-3 opacity-5">
         <Icon size={48} />
      </div>
      <div className={cn("flex items-center gap-2 text-xs font-mono uppercase tracking-widest mb-1", alert ? "text-red-400" : "text-white/50")}>
        <Icon size={14} className={alert ? "animate-pulse" : ""} />
        {title}
      </div>
      <div className="text-3xl font-light tracking-tight text-white mb-1 z-10">
        {alert ? <GlitchText active>{value}</GlitchText> : value}
      </div>
      {trend && (
        <div className={cn("text-[10px] font-mono", alert ? "text-red-400" : "text-emerald-400/80")}>
          {trend}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [state, setState] = useState<SimulationState | null>(null);
  const [connected, setConnected] = useState(false);
  const [bootPhase, setBootPhase] = useState<number>(0);

  useEffect(() => {
    // Cinematic generic startup sequence
    if (bootPhase < 4) {
      const timer = setTimeout(() => {
        setBootPhase(b => b + 1);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [bootPhase]);

  useEffect(() => {
    if (bootPhase < 4) return;
    
    const eventSource = new EventSource("/api/stream");

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "INIT" || data.type === "TICK") {
          setState((prev) => ({
            ...prev,
            ...data.payload
          }));
          setConnected(true);
        } else if (data.type === "AI_DECISION") {
          setState((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              agentLogs: [data.payload, ...prev.agentLogs].slice(0, 20)
            };
          });
        }
      } catch (err) {
        console.error(err);
      }
    };

    eventSource.onerror = () => setConnected(false);
    return () => eventSource.close();
  }, [bootPhase]);

  const triggerEvent = async (action: string) => {
    await fetch("/api/intervention", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action }) });
  };

  const triggerConfigUpdate = async (params: any) => {
    await fetch("/api/config", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(params) });
  };

  if (!state || bootPhase < 4) {
    const bootMessages = [
        "ESTABLISHING SECURE NEURAL UPLINK...",
        "SYNCHRONIZING GLOBAL ECONOMY TELEMETRY...",
        "INITIALIZING AUTONOMOUS AGENT PROTOCOLS...",
        "WELCOME TO CEREBRO-KAGGRICULTURE OS."
    ];
    return (
      <div className="min-h-screen bg-[#020304] flex items-center justify-center text-white font-mono gap-6 p-4 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.05)_0%,transparent_70%)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-emerald-500/10 rounded-full animate-[spin_10s_linear_infinite]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] border border-emerald-500/20 rounded-full animate-[spin_8s_linear_infinite_reverse]" />
        <motion.div animate={{ rotate: 180 }} transition={{ repeat: Infinity, ease: "linear", duration: 3 }} className="z-10">
          <BrainCircuit size={48} className="text-emerald-500/80" />
        </motion.div>
        <div className="flex flex-col gap-2 z-10 w-[320px]">
          <span className="text-xl tracking-[0.2em] text-white/90">BOOT SEQUENCE</span>
          <div className="h-4 text-xs text-emerald-400 font-mono tracking-widest uppercase">
             {bootMessages[bootPhase]}
             {bootPhase < 3 && <motion.span animate={{opacity:[0,1,0]}} transition={{repeat:Infinity, duration: 1}}>_</motion.span>}
          </div>
          <div className="w-full h-[1px] bg-white/10 mt-4 relative overflow-hidden">
             <motion.div initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear'}} className="absolute inset-y-0 left-0 w-1/3 bg-emerald-500/50" />
          </div>
        </div>
      </div>
    );
  }

  const isCrisis = !!state.activeCrisis;

  return (
    <div className="min-h-screen bg-[#020304] text-white overflow-hidden font-sans select-none flex flex-col p-4 relative">
      
      {/* Cinematic Overlays */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.03)_0%,transparent_50%)]" />
        <div className={cn("absolute inset-0 transition-opacity duration-1000", isCrisis ? "opacity-100" : "opacity-0")}>
           <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(239,68,68,0.05)_100%)] animate-pulse" />
           <div className="absolute top-0 left-0 w-full h-1 bg-red-500/50" />
           <div className="absolute bottom-0 left-0 w-full h-1 bg-red-500/50" />
        </div>
      </div>

      {/* HEADER */}
      <header className="relative z-10 flex justify-between items-start mb-4 border-b border-white/5 pb-4 shrink-0">
        <div className="flex gap-4 items-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0c1015] to-[#050709] border border-white/10 flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.02)]">
            <BrainCircuit className="text-emerald-400" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-light tracking-tight text-white/90 leading-tight">Cerebro-Kaggriculture OS</h1>
            <div className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em] mt-1 flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              Autonomous Civilization Engine
            </div>
          </div>
        </div>

        <div className="flex items-start gap-8">
           <div className="flex flex-col items-end gap-2 text-right border-r border-white/10 pr-6 mr-[-8px] hidden md:flex">
              <div className="text-[9px] font-mono text-white/40 uppercase tracking-widest">System Stress</div>
              <div className="flex items-center gap-2">
                 <div className="w-20 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className={cn("h-full", state.systemStress > 70 ? "bg-red-500" : state.systemStress > 40 ? "bg-amber-500" : "bg-emerald-500")} style={{width: `${state.systemStress}%`}} />
                 </div>
                 <span className="text-xs font-mono">{state.systemStress}%</span>
              </div>
           </div>
           
           <div className="flex flex-col items-end gap-1 text-right border-r border-white/10 pr-6 mr-[-8px] hidden md:flex min-w-[200px]">
               <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Base Persona & Drift</span>
               <span className="text-[11px] font-mono text-white/80">{state.personality}</span>
               <span className="text-[10px] font-mono text-purple-400">➔ {state.currentDrift}</span>
           </div>

           <AnimatePresence>
             {isCrisis && (
               <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="bg-red-950/40 border border-red-500/50 rounded-lg px-4 py-2 flex items-center gap-3 shadow-[0_0_20px_rgba(239,68,68,0.15)] hidden sm:flex">
                  <ShieldAlert className="text-red-500 animate-pulse" size={20} />
                  <div className="flex flex-col">
                     <span className="text-[10px] font-mono text-red-400/80 uppercase">System Crisis Detected</span>
                     <span className="text-sm font-semibold text-red-100"><GlitchText active>{state.activeCrisis}</GlitchText></span>
                  </div>
               </motion.div>
             )}
           </AnimatePresence>

           <div className="text-right flex items-center gap-6 hidden sm:flex">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Temporal Phase</span>
                <span className="text-xl font-light">Day {state.day} <span className="text-emerald-400 ml-1">· {state.season}</span></span>
              </div>
           </div>
        </div>
      </header>

      {/* THREE-COLUMN LAYOUT */}
      <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0 overflow-y-auto lg:overflow-hidden">
        
        {/* LEFT: Neural Comms & Chronicles */}
        <div className="lg:col-span-3 flex flex-col gap-4 overflow-hidden h-[80vh] lg:h-full">
          
          <div className="flex-[0.4] bg-[#0A0D10]/60 border border-white/5 rounded-xl flex flex-col overflow-hidden relative backdrop-blur-md">
             <div className="absolute top-0 inset-x-0 h-10 bg-gradient-to-b from-[#0A0D10] to-transparent z-10 pointer-events-none" />
             <div className="p-4 border-b border-white/5 flex items-center gap-2">
                <ActivitySquare size={14} className="text-blue-400" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/60">Neural Agent Uplink</span>
             </div>
             <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-3 relative z-0 flex flex-col">
                <AnimatePresence>
                  {(state.agentCommunications || []).map((msg) => (
                    <motion.div key={msg.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className={cn("text-xs font-mono p-2 rounded border border-white/5 whitespace-pre-wrap word-break shrink-0", msg.type === "warning" ? "bg-red-950/20 text-red-200 border-red-500/20" : msg.type === "dissent" ? "bg-amber-950/20 text-amber-200" : "bg-white/[0.02] text-white/70")}>
                       <span className="text-blue-400 opacity-80 mr-2">[{msg.agent}]</span>
                       {msg.message}
                    </motion.div>
                  ))}
                </AnimatePresence>
             </div>
          </div>

          <div className="flex-[0.6] bg-[#0A0D10]/60 border border-white/5 rounded-xl flex flex-col overflow-hidden backdrop-blur-md">
             <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <TerminalSquare size={14} className="text-purple-400" />
                   <span className="text-[10px] font-mono uppercase tracking-widest text-white/60">Civilization Chronicle</span>
                </div>
             </div>
             <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4">
                <AnimatePresence>
                  {(state.chronicles || []).map((entry, i) => {
                     const isCrisis = entry.type === 'crisis';
                     const isMilestone = entry.type === 'milestone';
                     const isRival = entry.type === 'rival';
                     const isAdaptation = entry.type === 'adaptation';
                     
                     let bulletColor = "bg-white/20 ring-[#0A0D10]";
                     let textColor = "text-white/70";
                     if (isCrisis) { bulletColor = "bg-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.8)]"; textColor = "text-red-300 font-medium"; }
                     else if (isMilestone) { bulletColor = "bg-emerald-400/80 shadow-[0_0_10px_rgba(52,211,153,0.6)]"; textColor = "text-emerald-200 font-medium"; }
                     else if (isRival) { bulletColor = "bg-orange-500/80 shadow-[0_0_10px_rgba(249,115,22,0.6)]"; textColor = "text-orange-200/90"; }
                     else if (isAdaptation) { bulletColor = "bg-purple-500/80 shadow-[0_0_10px_rgba(168,85,247,0.6)]"; textColor = "text-purple-200/90"; }

                     return (
                        <motion.div initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} key={`${entry.day}-${i}`} className="flex gap-3 relative">
                           {i !== state.chronicles.length - 1 && <div className="absolute left-[3px] top-4 bottom-[-16px] w-[1px] bg-white/5" />}
                           <div className={cn("w-2 h-2 rounded-full mt-1 shrink-0 z-10 ring-4 ring-[#0A0D10]", bulletColor)} />
                           <div className="flex flex-col pb-2">
                              <span className="text-[9px] font-mono text-white/40 uppercase mb-0.5">Day {entry.day}</span>
                              <span className={cn("text-xs leading-relaxed max-w-[280px]", textColor)}>{entry.event}</span>
                           </div>
                        </motion.div>
                     );
                  })}
                </AnimatePresence>
             </div>
          </div>

        </div>

        {/* CENTER: Telemetry & Environment */}
        <div className="lg:col-span-6 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2 h-full">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
             <MetricPanel title="Treasury" value={`$${state.resources.capital.toLocaleString()}`} icon={DollarSign} trend="Market dependent" />
             <MetricPanel title="Water Reserves" value={`${Math.round(state.resources.water)}`} icon={Droplet} alert={state.resources.water < 2000} trend={state.resources.water < 2000 ? "CRITICAL OUTLOOK" : "Sustainable"} />
             <MetricPanel title="Territory" value={`${state.resources.land} Ac`} icon={Sprout} />
             <MetricPanel title="Soil Health" value={`${state.resources.soilHealth}%`} icon={Leaf} alert={state.resources.soilHealth < 50} trend={state.resources.soilHealth < 50 ? "Requires Rotation" : "Optimal"} />
          </div>

          <div className="bg-[#0A0D10]/60 border border-white/5 rounded-xl p-5 backdrop-blur-md">
             <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                   <Activity size={14} className="text-emerald-400" />
                   <span className="text-[10px] font-mono uppercase tracking-widest text-white/60">Market Telemetry</span>
                </div>
                <div className="flex gap-4 text-[10px] font-mono text-white/40">
                   <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-amber-400"/> Wheat: ${state.economy.wheatPrice}</div>
                   <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-rose-500"/> Tomato: ${state.economy.tomatoPrice}</div>
                </div>
             </div>
             <div className="h-[200px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={state.historicalData}>
                   <defs>
                     <linearGradient id="colorWheat" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fbbf24" stopOpacity={0.2}/><stop offset="100%" stopColor="#fbbf24" stopOpacity={0}/></linearGradient>
                     <linearGradient id="colorTomato" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f43f5e" stopOpacity={0.2}/><stop offset="100%" stopColor="#f43f5e" stopOpacity={0}/></linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                   <XAxis dataKey="day" stroke="rgba(255,255,255,0.1)" tick={{ fontSize: 9, fill: "rgba(255,255,255,0.3)" }} tickLine={false} axisLine={false} />
                   <YAxis stroke="rgba(255,255,255,0.1)" tick={{ fontSize: 9, fill: "rgba(255,255,255,0.3)" }} tickLine={false} axisLine={false} width={25} />
                   <RechartsTooltip contentStyle={{ backgroundColor: 'rgba(5,7,9,0.9)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', fontSize: '11px', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                   <Area type="monotone" dataKey="systemStress" stroke="#ef4444" strokeWidth={1} fillOpacity={0.1} fill="#ef4444" isAnimationActive={false} />
                   <Area type="monotone" dataKey="wheatPrice" stroke="#fbbf24" strokeWidth={1.5} fillOpacity={1} fill="url(#colorWheat)" isAnimationActive={false} />
                   <Area type="monotone" dataKey="tomatoPrice" stroke="#f43f5e" strokeWidth={1.5} fillOpacity={1} fill="url(#colorTomato)" isAnimationActive={false} />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* Opponent Intel */}
             <div className="bg-[#0A0D10]/60 border border-white/5 rounded-xl p-5 backdrop-blur-md">
                <div className="flex items-center gap-2 mb-4">
                   <ShieldCheck size={14} className="text-orange-400" />
                   <span className="text-[10px] font-mono uppercase tracking-widest text-white/60">Competitor Field Tracker</span>
                </div>
                <div className="space-y-4 relative">
                   {state.competitors.map((comp, i) => (
                      <div key={i} className="flex flex-col gap-1.5 relative p-2 rounded-lg bg-white/[0.01] border border-white/[0.02]">
                         {comp.trend === 'up' && <div className="absolute top-0 right-0 w-8 h-8 rounded-tr-lg border-t-2 border-r-2 border-red-500/20 opacity-50" />}
                         {comp.status.includes('Takeover') && <div className="absolute inset-0 bg-red-950/20 rounded-lg animate-pulse z-0 pointer-events-none" />}
                         <div className="flex justify-between items-end relative z-10">
                            <span className={cn("text-xs font-semibold", comp.status.includes('Takeover') ? "text-red-400" : "text-white/80")}>{comp.name}</span>
                            <span className="text-[9px] font-mono text-white/40 uppercase relative pr-3">
                               Mkt Share {comp.marketShare.toFixed(1)}%
                               <span className={cn("absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full", comp.trend === 'up' ? "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)]" : comp.trend === 'down' ? "bg-blue-500" : "bg-white/20")} />
                            </span>
                         </div>
                         <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden relative z-10">
                            <div className={cn("h-full transition-all duration-1000", comp.trend === 'up' ? "bg-red-500" : "bg-orange-500/50")} style={{ width: `${comp.marketShare}%` }} />
                         </div>
                         <div className="flex flex-col relative z-10 mt-0.5">
                            <span className="text-[9px] text-white/30 uppercase font-mono">{comp.behavior}</span>
                            <span className={cn("text-[10px] italic leading-tight mt-0.5", comp.trend === 'up' ? "text-red-200" : "text-white/60")}>{comp.status}</span>
                         </div>
                      </div>
                   ))}
                </div>
             </div>

             <div className="flex flex-col gap-4">
                {/* Weather */}
                <div className="bg-[#0A0D10]/60 border border-white/5 rounded-xl p-4 flex-1 backdrop-blur-md">
                   <div className="flex items-center gap-2 mb-3">
                      <Sun size={14} className="text-yellow-400" />
                      <span className="text-[10px] font-mono uppercase tracking-widest text-white/60">Geo-Atmospheric Projections</span>
                   </div>
                   <div className="space-y-2">
                     {state.weatherForecast.slice(0,4).map((w, i) => (
                       <div key={i} className="flex items-center justify-between text-xs font-mono p-1.5 rounded bg-white/[0.02]">
                         <span className="text-white/40">Day {w.day}</span>
                         <span className="flex-1 px-4 text-white/70 truncate">{w.summary}</span>
                         <span className="text-white/90">{w.temp}°</span>
                       </div>
                     ))}
                   </div>
                </div>
                {/* God Controls */}
                <div className="bg-[#0A0D10]/60 border border-white/5 rounded-xl p-4 backdrop-blur-md">
                   <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                         <button onClick={() => triggerEvent("drought")} className="flex-1 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded text-[9px] font-mono uppercase tracking-wider transition-colors flex justify-center items-center gap-1.5">
                            <AlertTriangle size={12}/> Inject Crisis
                         </button>
                         <button onClick={() => triggerEvent("inject_capital")} className="flex-1 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded text-[9px] font-mono uppercase tracking-wider transition-colors flex justify-center items-center gap-1.5">
                            <DollarSign size={12}/> VC Round
                         </button>
                      </div>
                      <button onClick={() => triggerEvent("showcase_scenario")} className="w-full py-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 rounded text-[9px] font-mono uppercase tracking-wider transition-colors flex justify-center items-center gap-1.5">
                         <Zap size={12}/> Execute Showcase Scenario
                      </button>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* RIGHT: AI Decisions & Future Sim */}
        <div className="lg:col-span-3 bg-[#0A0D10]/60 border border-white/5 rounded-xl flex flex-col overflow-hidden backdrop-blur-md h-[80vh] lg:h-full">
           <div className="p-4 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-transparent to-purple-500/5">
              <div className="flex items-center gap-2">
                 <Cpu size={14} className="text-purple-400" />
                 <span className="text-[10px] font-mono uppercase tracking-widest text-white/60">Commander Neural Core</span>
              </div>
           </div>
           
           <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              <AnimatePresence initial={false}>
                 {(!state.agentLogs || state.agentLogs.length === 0) && <div className="text-[10px] font-mono text-white/30 text-center py-10 uppercase tracking-widest">Awaiting Neural Consensus...</div>}
                 {(state.agentLogs || []).map((log) => (
                    <motion.div key={log.id} initial={{ opacity: 0, y: -20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="mb-6 last:mb-0 relative">
                       <div className="pl-4 border-l-2 border-purple-500/30">
                          <div className="flex justify-between items-start mb-2">
                             <div className="flex items-center gap-2">
                               <div className="w-1.5 h-1.5 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                               <span className="text-[10px] font-mono text-white/50">{log.timestamp}</span>
                             </div>
                             {log.confidenceScore !== undefined && (
                                <span className="text-[9px] font-mono bg-purple-500/10 text-purple-300 px-1.5 py-0.5 rounded border border-purple-500/20 pointer-events-none">CONFIDENCE: {log.confidenceScore}%</span>
                             )}
                          </div>
                          
                          <h4 className="text-sm font-semibold text-white/90 leading-snug mb-3">
                             <span className="text-purple-400/50 mr-1.5">➔</span>{log.decision}
                          </h4>

                          {/* Digital Twin Projection */}
                          {log.futureSimulation && typeof log.futureSimulation === 'object' && (
                            <div className="bg-black/40 border border-white/5 rounded-md p-2 mb-3">
                               <div className="text-[9px] font-mono text-white/30 uppercase tracking-widest mb-1.5">Digital Twin Projection</div>
                               <div className="grid grid-cols-3 gap-2 text-[10px] font-mono">
                                  <div className="flex flex-col">
                                     <span className="text-white/40">Capital</span>
                                     <span className={log.futureSimulation.capitalImpact?.startsWith('-') ? "text-red-400" : "text-emerald-400"}>{log.futureSimulation.capitalImpact}</span>
                                  </div>
                                  <div className="flex flex-col border-l border-white/5 pl-2">
                                     <span className="text-white/40">Water</span>
                                     <span className={log.futureSimulation.waterImpact?.startsWith('-') ? "text-red-400" : "text-blue-400"}>{log.futureSimulation.waterImpact}</span>
                                  </div>
                                  <div className="flex flex-col border-l border-white/5 pl-2">
                                     <span className="text-white/40">Survival P(x)</span>
                                     <span className={log.futureSimulation.survivalProbability < 50 ? "text-amber-400" : "text-white/80"}>{log.futureSimulation.survivalProbability}%</span>
                                  </div>
                               </div>
                            </div>
                          )}

                          {/* Decision Logic Tree */}
                          {log.decisionTree && log.decisionTree.length > 0 ? (
                            <div className="mb-3 space-y-2 relative">
                               <div className="absolute left-[3px] top-2 bottom-2 w-px bg-white/5"></div>
                               {log.decisionTree.map((node, i) => (
                                  <div key={i} className="flex gap-2 relative z-10 pl-3">
                                     <div className="w-2 h-2 rounded-full border border-white/20 bg-[#0A0D10] shrink-0 mt-0.5" />
                                     <div className="flex-1 flex flex-col">
                                        <span className="text-[9px] text-white/40 uppercase font-mono">{node.step}</span>
                                        <span className="text-[11px] text-white/70 leading-tight mt-0.5">{node.output}</span>
                                     </div>
                                  </div>
                               ))}
                            </div>
                          ) : (
                            <ul className="space-y-1 mb-3">
                               {(log.reasoning || []).map((r, i) => <li key={i} className="text-[11px] text-white/60">• {r}</li>)}
                            </ul>
                          )}

                          {/* Rejected Alternatives */}
                          {log.rejectedAlternatives && log.rejectedAlternatives.length > 0 && (
                            <div className="mt-2 text-[10px] text-white/40 bg-white/[0.01] rounded px-2 py-1.5 inline-block w-full">
                               <span className="font-mono text-red-400/50 block mb-0.5">⊗ Rejected Paths:</span>
                               {log.rejectedAlternatives.map((alt, i) => (
                                  <span key={i} className="line-through block text-[9px]">{alt}</span>
                               ))}
                            </div>
                          )}
                          
                       </div>
                    </motion.div>
                 ))}
              </AnimatePresence>
           </div>
        </div>

      </div>
    </div>
  );
}
