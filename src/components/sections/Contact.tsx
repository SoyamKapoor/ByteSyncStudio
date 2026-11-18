import React from 'react';
import { siteConfig } from '../../config/site';
import { BrandLogo } from '../ui/BrandLogo';
import { Mail, Instagram, Linkedin, MessageCircle, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { SpotlightCard } from '../ui/SpotlightCard';

export const Contact: React.FC = () => {
  const scrollToBooking = () => {
    const el = document.getElementById('consultation');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="contact" className="py-24 relative bg-[#091321]/50 border-t border-[rgba(100,160,220,0.18)] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-[#087BFF]/5 blur-[140px] pointer-events-none rounded-full animate-pulse-glow" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading, Description, CTA */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="text-xs font-mono font-medium tracking-widest text-[#00D9F5] uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D9F5] animate-ping" />
              <span>Start The Conversation</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F4F7FB] leading-tight">
              Have a Business Problem Worth Solving?
            </h2>
            <p className="text-base sm:text-lg text-[#A8B5C7] leading-relaxed max-w-xl">
              Let's explore how the right technology can help your business work smarter. Whether
              you need an automated workflow, an AI integration, or a full backend overhaul.
            </p>

            <div className="pt-2">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={scrollToBooking}
                className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#087BFF] to-[#0098f5] hover:to-[#00D9F5] rounded-lg transition-all duration-200 shadow-md shadow-[#087BFF]/20 hover:shadow-lg hover:shadow-[#00D9F5]/25 flex items-center gap-2 group"
              >
                <span>Book a Consultation</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>
          </motion.div>

          {/* Right Column: Direct Verified Channels in Reactive SpotlightCard */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-5"
          >
            <SpotlightCard className="rounded-2xl bg-[#0D1928]/95 border border-[rgba(100,160,220,0.22)] p-8 shadow-2xl space-y-6 backdrop-blur-sm">
              <div className="pb-4 border-b border-[rgba(100,160,220,0.15)] flex items-center justify-between">
                <BrandLogo size="sm" />
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00D9F5] animate-pulse" />
                  <span className="text-xs font-mono text-[#00D9F5]">Direct Channels</span>
                </div>
              </div>

              <div className="space-y-4">
                {/* Instagram */}
                <motion.a
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.15 }}
                  href={siteConfig.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-lg bg-[#091321] hover:bg-[#087BFF]/10 border border-[rgba(100,160,220,0.18)] hover:border-[#00D9F5]/40 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-md bg-[#050B14] flex items-center justify-center text-[#00D9F5]">
                      <Instagram className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs text-[#A8B5C7] block">Instagram</span>
                      <span className="text-sm font-semibold text-[#F4F7FB]">
                        {siteConfig.instagramHandle}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#A8B5C7] group-hover:text-[#00D9F5] group-hover:translate-x-1 transition-all" />
                </motion.a>

                {/* Email */}
                <motion.a
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.15 }}
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-center justify-between p-3.5 rounded-lg bg-[#091321] hover:bg-[#087BFF]/10 border border-[rgba(100,160,220,0.18)] hover:border-[#00D9F5]/40 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-md bg-[#050B14] flex items-center justify-center text-[#087BFF]">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs text-[#A8B5C7] block">Direct Inquiry</span>
                      <span className="text-sm font-semibold text-[#F4F7FB] break-all sm:break-normal">
                        {siteConfig.email}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#A8B5C7] group-hover:text-[#00D9F5] group-hover:translate-x-1 transition-all shrink-0" />
                </motion.a>

                {/* LinkedIn: Coming Soon */}
                <motion.div
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center justify-between p-3.5 rounded-lg bg-[#091321] hover:bg-[#087BFF]/5 border border-[rgba(100,160,220,0.18)] hover:border-[#00D9F5]/30 transition-all duration-200 group cursor-default"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-md bg-[#050B14] flex items-center justify-center text-[#00D9F5]">
                      <Linkedin className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs text-[#A8B5C7] block">LinkedIn</span>
                      <span className="text-sm font-semibold text-[#F4F7FB]">
                        Coming Soon
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono tracking-wider uppercase text-[#00D9F5] bg-[#00D9F5]/10 px-2.5 py-1 rounded-full border border-[#00D9F5]/30 shadow-[0_0_8px_rgba(0,217,245,0.15)] flex items-center gap-1.5 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00D9F5] animate-pulse" />
                    Coming Soon
                  </span>
                </motion.div>

                {/* WhatsApp if configured */}
                {siteConfig.whatsappUrl && (
                  <motion.a
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.15 }}
                    href={siteConfig.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3.5 rounded-lg bg-[#091321] hover:bg-[#087BFF]/10 border border-[rgba(100,160,220,0.18)] hover:border-[#00D9F5]/40 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-md bg-[#050B14] flex items-center justify-center text-[#087BFF]">
                        <MessageCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs text-[#A8B5C7] block">WhatsApp</span>
                        <span className="text-sm font-semibold text-[#F4F7FB]">Instant Messaging</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#A8B5C7] group-hover:text-[#00D9F5] group-hover:translate-x-1 transition-all" />
                  </motion.a>
                )}
              </div>
            </SpotlightCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
