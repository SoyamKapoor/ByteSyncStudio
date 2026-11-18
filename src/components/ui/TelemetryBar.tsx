import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Cpu, Terminal } from 'lucide-react';

export const TelemetryBar: React.FC = () => {
  const [latency, setLatency] = useState(14);

  // Subtle live latency jitter to simulate authentic telemetry
  useEffect(() => {
    const timer = setInterval(() => {
      setLatency(12 + Math.floor(Math.random() * 5));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-[#050B14]/90 border-y border-[rgba(100,160,220,0.14)] py-2.5 px-4 overflow-hidden backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] font-mono text-[#A8B5C7] overflow-x-auto gap-6 whitespace-nowrap scrollbar-none">
        {/* Live Status indicator */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00D9F5] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00D9F5]"></span>
          </span>
          <span className="text-[#F4F7FB] font-semibold tracking-wider uppercase">
            Telemetry Live
          </span>
        </div>

        {/* Latency Metric */}
        <div className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-[#00D9F5]" />
          <span>Inference Latency:</span>
          <span className="text-[#00D9F5] font-semibold">{latency}ms</span>
        </div>

        {/* Strict Type Safety */}
        <div className="flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-[#087BFF]" />
          <span>Type Safety:</span>
          <span className="text-[#F4F7FB]">Deterministic 100% Strict</span>
        </div>

        {/* Zero-Log Policy */}
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#00D9F5]" />
          <span>Privacy:</span>
          <span className="text-[#F4F7FB]">Zero-Data-Retention / VPC Isolated</span>
        </div>

        {/* Engine status */}
        <div className="flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-[#087BFF]" />
          <span>Architecture:</span>
          <span className="text-[#00D9F5]">Sub-millisecond Edge Mesh</span>
        </div>
      </div>
    </div>
  );
};

