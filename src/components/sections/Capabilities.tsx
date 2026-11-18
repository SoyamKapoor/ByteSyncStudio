import React from 'react';
import { motion } from 'motion/react';
import {
  Cpu,
  Database,
  Server,
  Code2,
  Terminal,
  Workflow,
  Cloud,
  Box,
  Layers,
  Sparkles,
} from 'lucide-react';

interface TechItem {
  name: string;
  category: string;
  icon: React.ReactNode;
}

const TECH_STACK: TechItem[] = [
  { name: 'Python 3.12', category: 'Inference Runtime', icon: <Terminal className="w-3.5 h-3.5 text-[#00D9F5]" /> },
  { name: 'TypeScript 5.8', category: 'Strict Determinism', icon: <Code2 className="w-3.5 h-3.5 text-[#087BFF]" /> },
  { name: 'PyTorch', category: 'Neural Engineering', icon: <Cpu className="w-3.5 h-3.5 text-[#00D9F5]" /> },
  { name: 'PostgreSQL & pgvector', category: 'Vector Embeddings', icon: <Database className="w-3.5 h-3.5 text-[#087BFF]" /> },
  { name: 'FastAPI', category: 'Async High-Throughput', icon: <Server className="w-3.5 h-3.5 text-[#00D9F5]" /> },
  { name: 'LangChain', category: 'Semantic RAG', icon: <Sparkles className="w-3.5 h-3.5 text-[#087BFF]" /> },
  { name: 'Docker & Microservices', category: 'Isolated Sandboxes', icon: <Box className="w-3.5 h-3.5 text-[#00D9F5]" /> },
  { name: 'Supabase', category: 'Edge Sync & RLS', icon: <Layers className="w-3.5 h-3.5 text-[#087BFF]" /> },
  { name: 'Redis', category: 'In-Memory Queues', icon: <Workflow className="w-3.5 h-3.5 text-[#00D9F5]" /> },
  { name: 'AWS & Cloudflare Edge', category: 'Global Deployments', icon: <Cloud className="w-3.5 h-3.5 text-[#087BFF]" /> },
];

export const Capabilities: React.FC = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.6 }}
      className="relative py-7 bg-[#091321]/60 border-y border-[rgba(100,160,220,0.18)] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-mono font-medium tracking-widest text-[#00D9F5] uppercase flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D9F5] animate-ping" />
            <span>ENTERPRISE ENGINEERING STACK</span>
          </div>
          <span className="text-[11px] font-mono text-[#A8B5C7]/60 hidden sm:inline-block">
            STRICT TYPE SAFETY · PRODUCTION-READY
          </span>
        </div>
      </div>

      {/* Infinite Seamless Scrolling Tech Marquee with Edge Fade Masks */}
      <div className="relative w-full mask-marquee">
        <div className="animate-marquee gap-4 flex py-1">
          {/* Double list for smooth 100% loop */}
          {[...TECH_STACK, ...TECH_STACK].map((item, idx) => (
            <div
              key={`${item.name}-${idx}`}
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg bg-[#0D1928]/90 border border-[rgba(100,160,220,0.18)] hover:border-[#00D9F5]/40 transition-colors shadow-sm shrink-0 cursor-default group"
            >
              <div className="p-1 rounded bg-[#050B14] group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#F4F7FB] group-hover:text-[#00D9F5] transition-colors leading-tight">
                  {item.name}
                </span>
                <span className="text-[10px] font-mono text-[#A8B5C7]/70 leading-tight">
                  {item.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};
