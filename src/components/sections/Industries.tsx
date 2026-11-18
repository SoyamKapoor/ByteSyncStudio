import React from 'react';
import { industriesData } from '../../config/services';
import { Building2, Stethoscope, Rocket, Building, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { IndustryType } from '../../types';
import { motion } from 'motion/react';
import { SpotlightCard } from '../ui/SpotlightCard';

interface IndustriesProps {
  onSelectIndustry: (industry: IndustryType) => void;
}

export const Industries: React.FC<IndustriesProps> = ({ onSelectIndustry }) => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'real-estate':
        return <Building2 className="w-5 h-5 text-[#00D9F5]" />;
      case 'healthcare-clinics':
        return <Stethoscope className="w-5 h-5 text-[#087BFF]" />;
      case 'startups-growing-businesses':
        return <Rocket className="w-5 h-5 text-[#00D9F5]" />;
      case 'established-businesses':
        return <Building className="w-5 h-5 text-[#087BFF]" />;
      default:
        return <Building2 className="w-5 h-5 text-[#00D9F5]" />;
    }
  };

  const handleDiscuss = (industryTitle: string) => {
    onSelectIndustry(industryTitle as IndustryType);
    const element = document.getElementById('consultation');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="solutions" className="py-24 relative bg-[#091321]/40 border-t border-[rgba(100,160,220,0.18)]">
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
            <span>Industry Solutions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F4F7FB] leading-tight">
            Technology That Fits Your Business.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#A8B5C7] leading-relaxed">
            Every business faces different challenges. We help identify practical digital solutions
            around the way your organization works.
          </p>
        </motion.div>

        {/* 4 Industry Cards with SpotlightCard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {industriesData.map((ind, idx) => (
            <motion.div
              key={ind.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="h-full"
            >
              <SpotlightCard className="h-full rounded-xl bg-[#0D1928]/90 border border-[rgba(100,160,220,0.18)] p-6 flex flex-col justify-between transition-colors duration-200 shadow-lg hover:shadow-xl hover:shadow-[#087BFF]/10">
                <div>
                  {/* Industry Header with Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 2 }}
                    className="w-10 h-10 rounded-lg bg-[#091321] border border-[rgba(100,160,220,0.2)] flex items-center justify-center mb-5 group-hover:border-[#00D9F5]/40 transition-colors shadow-inner"
                  >
                    {getIcon(ind.id)}
                  </motion.div>

                  <h3 className="text-lg font-bold text-[#F4F7FB] mb-2 group-hover:text-[#00D9F5] transition-colors">
                    {ind.title}
                  </h3>
                  <p className="text-xs text-[#A8B5C7] leading-relaxed mb-5">{ind.description}</p>

                  {/* Potential Solutions List */}
                  <div className="space-y-2 pt-4 border-t border-[rgba(100,160,220,0.12)]">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-[#A8B5C7]/70 mb-2">
                      Potential Solutions
                    </div>
                    {ind.solutions.map((sol) => (
                      <div key={sol} className="flex items-start gap-2 text-xs text-[#F4F7FB]/90">
                        <Check className="w-3.5 h-3.5 text-[#00D9F5] shrink-0 mt-0.5" />
                        <span>{sol}</span>
                      </div>
                    ))}
                  </div>

                  {/* Healthcare Security Notice if applicable */}
                  {ind.securityNote && (
                    <div className="mt-4 pt-3 border-t border-[rgba(100,160,220,0.12)] flex items-start gap-2 text-[11px] text-[#A8B5C7] bg-[#050B14]/40 p-2.5 rounded">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#087BFF] shrink-0 mt-0.5" />
                      <span>{ind.securityNote}</span>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <div className="pt-6 mt-6 border-t border-[rgba(100,160,220,0.12)]">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDiscuss(ind.title)}
                    className="w-full py-2 px-3 text-xs font-semibold text-[#F4F7FB] hover:text-white bg-[#091321] hover:bg-[#087BFF] border border-[rgba(100,160,220,0.25)] hover:border-[#087BFF] rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Discuss Requirements</span>
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
