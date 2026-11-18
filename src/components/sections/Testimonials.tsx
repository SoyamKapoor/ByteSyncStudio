import React from 'react';
import { testimonialsData, technicalCredibilityHighlights } from '../../config/testimonials';
import { ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export const Testimonials: React.FC = () => {
  const verifiedTestimonials = testimonialsData.filter(
    (t) => t.verified && t.hasPermission && t.feedback.trim().length > 0
  );

  // If testimonials are verified, show real testimonials
  if (verifiedTestimonials.length > 0) {
    return (
      <section className="py-24 relative bg-[#091321]/40 border-t border-[rgba(100,160,220,0.18)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mb-16"
          >
            <div className="text-xs font-mono font-medium tracking-widest text-[#00D9F5] uppercase mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D9F5]" />
              <span>Verified Feedback</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F4F7FB]">
              Client Collaborations
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {verifiedTestimonials.map((t, idx) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="rounded-xl bg-[#0D1928] border border-[rgba(100,160,220,0.18)] hover:border-[#00D9F5]/40 p-6 flex flex-col justify-between shadow-lg hover:shadow-xl hover:shadow-[#087BFF]/10 transition-colors"
              >
                <p className="text-sm text-[#F4F7FB] leading-relaxed mb-6 italic">
                  "{t.feedback}"
                </p>
                <div className="pt-4 border-t border-white/5">
                  <div className="text-sm font-bold text-[#F4F7FB]">{t.clientName}</div>
                  <div className="text-xs text-[#A8B5C7]">
                    {t.role} · {t.organization}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Zero-Fabrication Fallback: Technical Credibility & Rigorous Engineering Standards
  return (
    <section className="py-24 relative bg-[#091321]/40 border-t border-[rgba(100,160,220,0.18)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-16"
        >
          <div className="text-xs font-mono font-medium tracking-widest text-[#00D9F5] uppercase mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D9F5]" />
            <span>Technical Credibility & Rigor</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F4F7FB] leading-tight">
            Engineering Standards You Can Verify.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#A8B5C7]">
            We operate with strict engineering principles: zero invented vanity metrics, deterministic
            type safety, and rigorous data protection.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {technicalCredibilityHighlights.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="rounded-xl bg-[#0D1928] border border-[rgba(100,160,220,0.18)] hover:border-[#00D9F5]/40 p-6 flex flex-col justify-between shadow-lg hover:shadow-xl hover:shadow-[#087BFF]/10 transition-colors group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono text-[#00D9F5] group-hover:drop-shadow-[0_0_6px_rgba(0,217,245,0.6)] transition-all">
                    {item.metric}
                  </span>
                  <span className="text-xs font-mono text-[#A8B5C7]/50">0{idx + 1}</span>
                </div>
                <h3 className="text-base font-bold text-[#F4F7FB] mb-2 group-hover:text-[#00D9F5] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-[#A8B5C7] leading-relaxed">{item.description}</p>
              </div>

              <div className="pt-4 mt-6 border-t border-[rgba(100,160,220,0.1)] flex items-center gap-1.5 text-[11px] font-mono text-[#087BFF]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00D9F5]" />
                <span>Audited Architecture</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
