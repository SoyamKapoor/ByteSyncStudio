import React from 'react';
import { Target, Brain, ShieldCheck, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

export const WhyByteSync: React.FC = () => {
  const differentiators = [
    {
      title: 'BUSINESS-FIRST APPROACH',
      description: 'Technology decisions should support real business objectives.',
      icon: <Target className="w-5 h-5 text-[#00D9F5]" />,
    },
    {
      title: 'PRACTICAL AI',
      description:
        'We focus on useful solutions to operational problems, not technology for its own sake.',
      icon: <Brain className="w-5 h-5 text-[#087BFF]" />,
    },
    {
      title: 'SCALABLE ENGINEERING',
      description: 'Build with maintainability and future requirements in mind.',
      icon: <ShieldCheck className="w-5 h-5 text-[#00D9F5]" />,
    },
    {
      title: 'CLEAR COMMUNICATION',
      description: 'Understand the scope, approach, and next steps before committing.',
      icon: <MessageSquare className="w-5 h-5 text-[#087BFF]" />,
    },
  ];

  return (
    <section id="about" className="py-24 relative bg-[#050B14] border-t border-[rgba(100,160,220,0.18)]">
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
            <span>Our Principles</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F4F7FB] leading-tight">
            Practical Technology. Purposeful Engineering.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#A8B5C7]">
            We partner with businesses to engineer high-utility digital workflows without unnecessary complexity.
          </p>
        </motion.div>

        {/* 4 Differentiators Grid with stagger and hover */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {differentiators.map((diff, idx) => (
            <motion.div
              key={diff.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="rounded-xl bg-[#0D1928]/70 border border-[rgba(100,160,220,0.18)] hover:border-[#00D9F5]/40 p-6 flex flex-col justify-between transition-colors shadow-lg hover:shadow-xl hover:shadow-[#087BFF]/10 group"
            >
              <div>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 3 }}
                  className="w-10 h-10 rounded-lg bg-[#091321] border border-[rgba(100,160,220,0.2)] group-hover:border-[#00D9F5]/40 flex items-center justify-center mb-5 transition-colors shadow-inner"
                >
                  {diff.icon}
                </motion.div>
                <h3 className="text-sm font-bold text-[#F4F7FB] tracking-wide mb-2 group-hover:text-[#00D9F5] transition-colors">
                  {diff.title}
                </h3>
                <p className="text-xs text-[#A8B5C7] leading-relaxed">
                  {diff.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
