import React from 'react';
import { ConsultationForm } from '../booking/ConsultationForm';
import { IndustryType, ServiceType } from '../../types';
import { motion } from 'motion/react';

interface ConsultationSectionProps {
  initialService?: ServiceType;
  initialIndustry?: IndustryType;
}

export const Consultation: React.FC<ConsultationSectionProps> = ({
  initialService,
  initialIndustry,
}) => {
  return (
    <section id="consultation" className="py-24 relative bg-[#050B14] border-t border-[rgba(100,160,220,0.18)] overflow-hidden">
      {/* Background glow behind form */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#087BFF]/8 blur-[160px] pointer-events-none rounded-full animate-pulse-glow" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <div className="text-xs font-mono font-medium tracking-widest text-[#00D9F5] uppercase mb-3 flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D9F5] animate-ping" />
            <span>Discovery & Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F4F7FB] leading-tight">
            Let's Solve Your Next Technical Challenge.
          </h2>
          <p className="mt-4 text-base text-[#A8B5C7] leading-relaxed">
            Tell us about your business and what you're looking to improve. We'll review your
            requirements and discuss the next steps.
          </p>
        </motion.div>

        {/* Consultation Booking Form with scroll-in */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <ConsultationForm
            initialService={initialService}
            initialIndustry={initialIndustry}
          />
        </motion.div>
      </div>
    </section>
  );
};
