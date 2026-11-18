import React, { useState } from 'react';
import { ArrowRight, Cpu, Layers, GitBranch, Sparkles, Terminal } from 'lucide-react';
import { ServiceType } from '../../types';
import { motion } from 'motion/react';

interface HeroProps {
  onSelectService?: (serviceName: ServiceType) => void;
}

type NodeType = 'Ingestion' | 'AI Core' | 'Pipelines' | 'APIs' | 'Scale';

const NODE_TELEMETRY: Record<NodeType, { status: string; detail: string; speed: string }> = {
  Ingestion: {
    status: 'INGESTION ENGINE ACTIVE',
    detail: 'Event streaming · Zero-loss buffer · Schema verification',
    speed: '12.4k req/sec',
  },
  'AI Core': {
    status: 'AI NEURAL ROUTER ONLINE',
    detail: 'Sub-100ms LLM routing · Fallback redundancy · Dynamic embeddings',
    speed: '99.8% precision',
  },
  Pipelines: {
    status: 'ASYNC PIPELINES ARMED',
    detail: 'Zero-duplication queues · Distributed retries · State snapshots',
    speed: '18ms execution',
  },
  APIs: {
    status: 'UNIFIED EDGE GATEWAY',
    detail: 'Strict OpenAPI schemas · Rate-limit smoothing · Zero-trust tokens',
    speed: 'Edge deployed',
  },
  Scale: {
    status: 'DISTRIBUTED CLOUD SCALE',
    detail: 'Isolated VPC instances · Multi-region read replicas · Auto-healed',
    speed: '99.99% uptime',
  },
};

export const Hero: React.FC<HeroProps> = () => {
  const [activeNode, setActiveNode] = useState<NodeType | null>(null);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background ambient lighting with subtle breathing animation */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-[#087BFF]/10 blur-[140px] pointer-events-none rounded-full animate-pulse-glow" />
      <div
        className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-[#00D9F5]/8 blur-[120px] pointer-events-none rounded-full animate-pulse-glow"
        style={{ animationDelay: '2.5s' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline, Value Proposition, Action CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-7">
            {/* Clean unboxed eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2.5 text-xs font-mono font-medium tracking-widest text-[#00D9F5] uppercase"
            >
              <span className="w-2 h-2 rounded-full bg-[#00D9F5] animate-ping" />
              <span>AI Engineering · Digital Transformation</span>
            </motion.div>

            {/* Headline with optical balance */}
            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#F4F7FB] leading-[1.12] text-balance"
            >
              Your Business.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D9F5] via-[#087BFF] to-[#00D9F5]">
                Smarter by Design.
              </span>
            </motion.h1>

            {/* Business description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-[#A8B5C7] leading-relaxed max-w-2xl"
            >
              We build intelligent AI solutions, custom web systems, and automation workflows that
              help businesses streamline operations, solve complex problems, and scale with
              confidence.
            </motion.p>

            {/* Primary & Secondary Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => scrollTo('consultation')}
                className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#087BFF] to-[#0098f5] hover:to-[#00D9F5] rounded-lg transition-all duration-200 shadow-lg shadow-[#087BFF]/25 hover:shadow-xl hover:shadow-[#00D9F5]/30 flex items-center gap-2 group whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9F5]"
              >
                <span>Book a Consultation</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => scrollTo('work')}
                className="px-6 py-3 text-sm font-medium text-[#F4F7FB] bg-[#091321] hover:bg-[#0D1928] border border-[rgba(100,160,220,0.25)] hover:border-[#00D9F5]/40 rounded-lg transition-all duration-200 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9F5]"
              >
                Explore Our Work
              </motion.button>
            </motion.div>

            {/* Capability Labels */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-6 border-t border-[rgba(100,160,220,0.15)] w-full"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium text-[#A8B5C7]">
                <div className="flex items-center gap-2.5 group cursor-default">
                  <Cpu className="w-4 h-4 text-[#00D9F5] shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-[#F4F7FB] group-hover:text-[#00D9F5] transition-colors">
                    AI & Machine Learning
                  </span>
                </div>
                <div className="flex items-center gap-2.5 group cursor-default">
                  <Layers className="w-4 h-4 text-[#087BFF] shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-[#F4F7FB] group-hover:text-[#087BFF] transition-colors">
                    Custom Software Systems
                  </span>
                </div>
                <div className="flex items-center gap-2.5 group cursor-default">
                  <GitBranch className="w-4 h-4 text-[#00D9F5] shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-[#F4F7FB] group-hover:text-[#00D9F5] transition-colors">
                    Business Automation
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Sophisticated Technical Architecture Visualization with Interactive Node Telemetry */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <motion.div
              animate={{ y: [-4, 4, -4] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="relative mx-auto w-full max-w-md lg:max-w-none aspect-square rounded-2xl bg-[#091321]/90 border border-[rgba(100,160,220,0.22)] p-6 shadow-2xl backdrop-blur-sm overflow-hidden flex flex-col justify-between group/panel hover:border-[#00D9F5]/40 transition-colors"
            >
              {/* Subtle technical corner marks */}
              <div className="absolute top-3 left-3 w-2 h-2 border-t border-l border-[#00D9F5]/60" />
              <div className="absolute top-3 right-3 w-2 h-2 border-t border-r border-[#00D9F5]/60" />
              <div className="absolute bottom-3 left-3 w-2 h-2 border-b border-l border-[#00D9F5]/60" />
              <div className="absolute bottom-3 right-3 w-2 h-2 border-b border-r border-[#00D9F5]/60" />

              {/* Header inside visualization */}
              <div className="flex items-center justify-between border-b border-[rgba(100,160,220,0.15)] pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00D9F5] animate-ping" />
                  <span className="text-xs font-mono text-[#00D9F5] tracking-wider uppercase">
                    Interactive Mesh
                  </span>
                </div>
                <span className="text-[11px] font-mono text-[#A8B5C7]/70">Hover nodes to inspect</span>
              </div>

              {/* Dynamic SVG System Graph */}
              <div className="relative flex-1 flex items-center justify-center my-3">
                <svg className="w-full h-full max-h-60" viewBox="0 0 400 300" fill="none">
                  {/* Subtle Grid Lines */}
                  <line x1="50" y1="50" x2="350" y2="50" stroke="rgba(100, 160, 220, 0.08)" strokeWidth="1" />
                  <line x1="50" y1="150" x2="350" y2="150" stroke="rgba(100, 160, 220, 0.08)" strokeWidth="1" />
                  <line x1="50" y1="250" x2="350" y2="250" stroke="rgba(100, 160, 220, 0.08)" strokeWidth="1" />
                  <line x1="100" y1="20" x2="100" y2="280" stroke="rgba(100, 160, 220, 0.08)" strokeWidth="1" />
                  <line x1="200" y1="20" x2="200" y2="280" stroke="rgba(100, 160, 220, 0.08)" strokeWidth="1" />
                  <line x1="300" y1="20" x2="300" y2="280" stroke="rgba(100, 160, 220, 0.08)" strokeWidth="1" />

                  {/* Flow interconnect paths with live animated dashes */}
                  <path
                    className="animate-flow-dash"
                    d="M 90 90 Q 150 40 200 90 T 310 90"
                    stroke="#087BFF"
                    strokeWidth="2.5"
                    strokeDasharray="6 6"
                    fill="none"
                    opacity={activeNode && activeNode !== 'Ingestion' && activeNode !== 'AI Core' && activeNode !== 'APIs' ? 0.3 : 0.9}
                  />
                  <path
                    className="animate-flow-dash-reverse"
                    d="M 90 210 Q 150 260 200 210 T 310 210"
                    stroke="#00D9F5"
                    strokeWidth="2.5"
                    strokeDasharray="6 6"
                    fill="none"
                    opacity={activeNode && activeNode !== 'Pipelines' && activeNode !== 'AI Core' && activeNode !== 'Scale' ? 0.3 : 0.9}
                  />
                  <path
                    d="M 90 90 L 200 150 L 310 90"
                    stroke="rgba(100, 160, 220, 0.3)"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  <path
                    d="M 90 210 L 200 150 L 310 210"
                    stroke="rgba(100, 160, 220, 0.3)"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  <line x1="200" y1="90" x2="200" y2="210" stroke="#00D9F5" strokeWidth="2" opacity="0.6" />

                  {/* Node 1: Ingestion */}
                  <g
                    transform="translate(90, 90)"
                    className="cursor-pointer transition-transform hover:scale-110"
                    onMouseEnter={() => setActiveNode('Ingestion')}
                    onMouseLeave={() => setActiveNode(null)}
                  >
                    <circle
                      r="22"
                      fill={activeNode === 'Ingestion' ? '#087BFF' : '#0D1928'}
                      stroke={activeNode === 'Ingestion' ? '#00D9F5' : '#087BFF'}
                      strokeWidth="2"
                    />
                    <circle r="6" fill="#00D9F5" />
                    <text x="0" y="36" textAnchor="middle" fill="#A8B5C7" fontSize="10" fontFamily="'JetBrains Mono', monospace">
                      Ingestion
                    </text>
                  </g>

                  {/* Node 2: Core AI Engine with animated radar ping */}
                  <g
                    transform="translate(200, 150)"
                    className="cursor-pointer transition-transform hover:scale-110"
                    onMouseEnter={() => setActiveNode('AI Core')}
                    onMouseLeave={() => setActiveNode(null)}
                  >
                    <circle cx="0" cy="0" r="14" fill="none" stroke="#00D9F5" strokeWidth="1.5" className="animate-radar-ping" />
                    <rect
                      x="-30"
                      y="-30"
                      width="60"
                      height="60"
                      rx="10"
                      fill={activeNode === 'AI Core' ? '#112238' : '#0D1928'}
                      stroke="#00D9F5"
                      strokeWidth={activeNode === 'AI Core' ? '3.5' : '2.5'}
                    />
                    <circle r="12" fill="#087BFF" opacity="0.3" />
                    <circle r="5" fill="#00D9F5" />
                    <text x="0" y="44" textAnchor="middle" fill="#F4F7FB" fontSize="11" fontWeight="600" fontFamily="'JetBrains Mono', monospace">
                      AI Core
                    </text>
                  </g>

                  {/* Node 3: Automation Logic */}
                  <g
                    transform="translate(90, 210)"
                    className="cursor-pointer transition-transform hover:scale-110"
                    onMouseEnter={() => setActiveNode('Pipelines')}
                    onMouseLeave={() => setActiveNode(null)}
                  >
                    <circle
                      r="22"
                      fill={activeNode === 'Pipelines' ? '#087BFF' : '#0D1928'}
                      stroke="#087BFF"
                      strokeWidth="2"
                    />
                    <circle r="6" fill="#087BFF" />
                    <text x="0" y="36" textAnchor="middle" fill="#A8B5C7" fontSize="10" fontFamily="'JetBrains Mono', monospace">
                      Pipelines
                    </text>
                  </g>

                  {/* Node 4: Unified API */}
                  <g
                    transform="translate(310, 90)"
                    className="cursor-pointer transition-transform hover:scale-110"
                    onMouseEnter={() => setActiveNode('APIs')}
                    onMouseLeave={() => setActiveNode(null)}
                  >
                    <circle
                      r="22"
                      fill={activeNode === 'APIs' ? '#087BFF' : '#0D1928'}
                      stroke="#00D9F5"
                      strokeWidth="2"
                    />
                    <circle r="6" fill="#00D9F5" />
                    <text x="0" y="36" textAnchor="middle" fill="#A8B5C7" fontSize="10" fontFamily="'JetBrains Mono', monospace">
                      APIs
                    </text>
                  </g>

                  {/* Node 5: Enterprise Scale */}
                  <g
                    transform="translate(310, 210)"
                    className="cursor-pointer transition-transform hover:scale-110"
                    onMouseEnter={() => setActiveNode('Scale')}
                    onMouseLeave={() => setActiveNode(null)}
                  >
                    <circle
                      r="22"
                      fill={activeNode === 'Scale' ? '#087BFF' : '#0D1928'}
                      stroke="#087BFF"
                      strokeWidth="2"
                    />
                    <circle r="6" fill="#087BFF" />
                    <text x="0" y="36" textAnchor="middle" fill="#A8B5C7" fontSize="10" fontFamily="'JetBrains Mono', monospace">
                      Scale
                    </text>
                  </g>
                </svg>
              </div>

              {/* Dynamic Node Telemetry HUD */}
              <div className="bg-[#050B14]/90 rounded-lg p-3 border border-[rgba(100,160,220,0.18)] min-h-[56px] flex flex-col justify-center">
                {activeNode ? (
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#00D9F5] font-semibold mb-0.5">
                      <span>{NODE_TELEMETRY[activeNode].status}</span>
                      <span className="text-[#A8B5C7]">{NODE_TELEMETRY[activeNode].speed}</span>
                    </div>
                    <div className="text-[11px] text-[#A8B5C7] truncate">
                      {NODE_TELEMETRY[activeNode].detail}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-xs text-[#A8B5C7]">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00D9F5] animate-ping" />
                      <span>Cluster Topology</span>
                    </div>
                    <span className="text-[#F4F7FB] font-mono text-[11px]">Strict Typing · RLS · Cloud</span>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
