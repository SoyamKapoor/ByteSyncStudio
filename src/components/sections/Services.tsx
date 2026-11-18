import React from 'react';
import { servicesData } from '../../config/services';
import { Cpu, Server, GitBranch, Activity, ArrowRight, Check } from 'lucide-react';
import { ServiceType } from '../../types';
import { motion } from 'motion/react';
import { SpotlightCard } from '../ui/SpotlightCard';

interface ServicesProps {
  onSelectService: (serviceName: ServiceType) => void;
}

export const Services: React.FC<ServicesProps> = ({ onSelectService }) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Cpu':
        return <Cpu className="w-6 h-6 text-[#00D9F5]" />;
      case 'Server':
        return <Server className="w-6 h-6 text-[#087BFF]" />;
      case 'GitBranch':
        return <GitBranch className="w-6 h-6 text-[#00D9F5]" />;
      case 'Activity':
        return <Activity className="w-6 h-6 text-[#087BFF]" />;
      default:
        return <Cpu className="w-6 h-6 text-[#00D9F5]" />;
    }
  };

  const handleServiceSelect = (serviceTitle: string) => {
    onSelectService(serviceTitle as ServiceType);
    const element = document.getElementById('consultation');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="py-24 relative bg-[#050B14] overflow-hidden">
      {/* Background ambient accent */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#087BFF]/5 blur-[120px] pointer-events-none rounded-full animate-pulse-glow" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-16"
        >
          <div className="text-xs font-mono font-medium tracking-widest text-[#00D9F5] uppercase mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D9F5]" />
            <span>Core Engineering Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F4F7FB] leading-tight">
            Technology Built Around Your Business.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#A8B5C7] leading-relaxed">
            From intelligent automation to custom software, we build practical digital solutions
            around your business needs.
          </p>
        </motion.div>

        {/* 4 Premium Service Cards with Dynamic Cursor Spotlight & Stagger */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {servicesData.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.55, delay: idx * 0.12 }}
              whileHover={{ y: -6, transition: { duration: 0.22 } }}
              className="h-full"
            >
              <SpotlightCard className="h-full rounded-2xl bg-[#0D1928]/85 border border-[rgba(100,160,220,0.18)] p-8 flex flex-col justify-between shadow-xl hover:shadow-2xl hover:shadow-[#087BFF]/15 backdrop-blur-sm transition-colors">
                <div>
                  {/* Header with icon and index */}
                  <div className="flex items-center justify-between mb-6">
                    <motion.div
                      whileHover={{ scale: 1.08, rotate: 2 }}
                      className="w-12 h-12 rounded-lg bg-[#091321] border border-[rgba(100,160,220,0.2)] flex items-center justify-center group-hover:border-[#00D9F5]/50 transition-colors shadow-inner"
                    >
                      {getIcon(service.iconName)}
                    </motion.div>
                    <span className="text-xs font-mono text-[#A8B5C7]/60">
                      0{idx + 1}
                    </span>
                  </div>

                  {/* Title and description */}
                  <h3 className="text-xl font-bold text-[#F4F7FB] mb-3 group-hover:text-[#00D9F5] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-[#A8B5C7] leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Clean unboxed offerings list */}
                  <div className="space-y-2.5 pt-4 border-t border-[rgba(100,160,220,0.12)]">
                    {service.offerings.map((offering) => (
                      <div key={offering} className="flex items-start gap-2.5 text-xs text-[#F4F7FB]/90">
                        <Check className="w-3.5 h-3.5 text-[#00D9F5] mt-0.5 shrink-0" />
                        <span>{offering}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button: Pre-selects service and scrolls to booking */}
                <div className="pt-8 mt-6 border-t border-[rgba(100,160,220,0.12)]">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleServiceSelect(service.title)}
                    className="w-full py-2.5 px-4 text-xs font-semibold text-[#F4F7FB] group-hover:text-white bg-[#091321] hover:bg-gradient-to-r hover:from-[#087BFF] hover:to-[#0098f5] border border-[rgba(100,160,220,0.25)] hover:border-[#087BFF] rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group-hover:shadow-md group-hover:shadow-[#087BFF]/25"
                  >
                    <span>Select {service.title}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
