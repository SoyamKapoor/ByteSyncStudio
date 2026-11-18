import React from 'react';
import { motion } from 'motion/react';

export const Process: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'DISCOVER',
      description: 'Understand your business, challenges, and objectives.',
    },
    {
      num: '02',
      title: 'PLAN',
      description: 'Define requirements, technical direction, and implementation scope.',
    },
    {
      num: '03',
      title: 'BUILD',
      description: 'Develop, test, and refine a solution around your needs.',
    },
    {
      num: '04',
      title: 'SCALE',
      description: 'Improve and expand your digital systems as your business evolves.',
    },
  ];

  return (
    <section className="py-24 relative bg-[#050B14] overflow-hidden">
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
            <span>Engagement Methodology</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F4F7FB] leading-tight">
            A Clear Path From Idea to Implementation.
          </h2>
        </motion.div>

        {/* Desktop Horizontal / Mobile Vertical Timeline */}
        <div className="relative">
          {/* Subtle connecting line across desktop steps */}
          <div className="hidden lg:block absolute top-7 left-12 right-12 h-0.5 bg-gradient-to-r from-[#00D9F5]/30 via-[#087BFF]/40 to-[#00D9F5]/30 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, idx) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: idx * 0.12 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="rounded-xl bg-[#0D1928]/80 border border-[rgba(100,160,220,0.18)] hover:border-[#00D9F5]/40 p-6 flex flex-col justify-between transition-colors shadow-lg hover:shadow-xl hover:shadow-[#087BFF]/10 backdrop-blur-sm group"
              >
                <div>
                  {/* Step Index Circle */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-14 h-14 rounded-full bg-[#091321] border border-[rgba(100,160,220,0.3)] group-hover:border-[#00D9F5]/60 flex items-center justify-center mb-6 shadow-inner transition-colors"
                  >
                    <span className="font-mono text-base font-bold text-[#00D9F5] group-hover:drop-shadow-[0_0_8px_rgba(0,217,245,0.6)] transition-all">
                      {step.num}
                    </span>
                  </motion.div>

                  <h3 className="text-lg font-bold text-[#F4F7FB] tracking-wide mb-2 group-hover:text-[#00D9F5] transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[#A8B5C7] leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[rgba(100,160,220,0.1)] flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#087BFF] uppercase tracking-wider">
                    Phase {step.num}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00D9F5]/60 group-hover:bg-[#00D9F5] group-hover:scale-125 transition-all" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
