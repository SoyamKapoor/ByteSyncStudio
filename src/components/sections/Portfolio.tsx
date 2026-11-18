import React, { useState } from 'react';
import { portfolioProjects } from '../../config/portfolio';
import { siteConfig } from '../../config/site';
import { ExternalLink, Terminal, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SpotlightCard } from '../ui/SpotlightCard';

export const Portfolio: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'AI & Machine Learning', 'Backend Systems', 'Automation'];

  const filteredProjects =
    selectedCategory === 'All'
      ? portfolioProjects
      : portfolioProjects.filter((p) => p.category === selectedCategory);

  return (
    <section id="work" className="py-24 relative bg-[#091321]/30 border-t border-[rgba(100,160,220,0.18)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
        >
          <div className="max-w-2xl">
            <div className="text-xs font-mono font-medium tracking-widest text-[#00D9F5] uppercase mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D9F5]" />
              <span>Technical Demonstrations & Architecture</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F4F7FB] leading-tight">
              Selected Work & Technical Projects
            </h2>
            <p className="mt-3 text-base text-[#A8B5C7]">
              Explore projects that demonstrate our approach to solving technical problems.
            </p>
          </div>

          {/* Interactive Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#0D1928] border border-[rgba(100,160,220,0.2)] rounded-lg self-start md:self-auto overflow-x-auto shadow-inner">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`relative px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-[#087BFF] text-white shadow-sm'
                    : 'text-[#A8B5C7] hover:text-[#F4F7FB]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Projects List with AnimatePresence & SpotlightCard */}
        {filteredProjects.length === 0 ? (
          <div className="rounded-xl bg-[#0D1928]/50 border border-[rgba(100,160,220,0.2)] p-12 text-center">
            <Terminal className="w-10 h-10 text-[#00D9F5] mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#F4F7FB] mb-2">No Projects in this Category</h3>
            <p className="text-sm text-[#A8B5C7]">Select another category or view all projects.</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, idx) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="h-full"
                >
                  <SpotlightCard className="h-full rounded-xl bg-[#0D1928] border border-[rgba(100,160,220,0.18)] p-6 flex flex-col justify-between shadow-xl hover:shadow-2xl hover:shadow-[#087BFF]/10 transition-colors">
                    <div>
                      {/* Category & Status Indicator */}
                      <div className="flex items-center justify-between text-xs text-[#A8B5C7] pb-3 border-b border-[rgba(100,160,220,0.12)] mb-4">
                        <span className="text-[#00D9F5] font-mono text-[11px]">{project.category}</span>
                        <span className="text-[11px] font-mono text-[#A8B5C7] bg-[#091321] px-2 py-0.5 rounded border border-[rgba(100,160,220,0.15)]">
                          {project.projectBadge}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-[#F4F7FB] mb-3 leading-snug group-hover:text-[#00D9F5] transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-xs text-[#A8B5C7] leading-relaxed mb-5">
                        {project.shortDescription}
                      </p>

                      {/* Problem & Solution Architecture */}
                      <div className="space-y-3 bg-[#091321] rounded-lg p-3.5 border border-[rgba(100,160,220,0.12)] mb-5">
                        <div>
                          <span className="text-[11px] font-mono text-[#00D9F5] uppercase block mb-1">
                            Challenge
                          </span>
                          <p className="text-xs text-[#A8B5C7]">{project.problemStatement}</p>
                        </div>
                        <div className="pt-2 border-t border-white/5">
                          <span className="text-[11px] font-mono text-[#087BFF] uppercase block mb-1">
                            Engineered Solution
                          </span>
                          <p className="text-xs text-[#F4F7FB]">{project.solution}</p>
                        </div>
                      </div>

                      {/* Technologies Used */}
                      <div className="text-xs text-[#A8B5C7]">
                        <span className="font-mono text-[10px] uppercase text-[#A8B5C7]/70 block mb-1.5">
                          Stack
                        </span>
                        <div className="flex flex-wrap gap-x-2 gap-y-1 font-mono text-[11px] text-[#00D9F5]">
                          {project.technologies.map((t, i) => (
                            <span key={t}>
                              {t}
                              {i < project.technologies.length - 1 && <span className="text-[#A8B5C7]/40"> ·</span>}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Optional Project URL */}
                    {project.projectUrl && (
                      <div className="pt-5 mt-5 border-t border-[rgba(100,160,220,0.12)]">
                        <a
                          href={project.projectUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-[#00D9F5] hover:underline flex items-center gap-1.5 group/link"
                        >
                          <span>View Prototype Details</span>
                          <ArrowUpRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                        </a>
                      </div>
                    )}
                  </SpotlightCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Configurable "View Full Portfolio" Section */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 pt-8 border-t border-[rgba(100,160,220,0.15)] flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <p className="text-xs text-[#A8B5C7]">
            Full client case study disclosures are subject to mutual Non-Disclosure Agreements (NDAs).
          </p>

          {siteConfig.portfolioConfig.fullPortfolioUrl ? (
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href={siteConfig.portfolioConfig.fullPortfolioUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 text-xs font-semibold text-[#F4F7FB] bg-[#0D1928] hover:bg-[#087BFF] border border-[rgba(100,160,220,0.3)] rounded-lg transition-colors flex items-center gap-1.5"
            >
              <span>View Full Portfolio</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </motion.a>
          ) : (
            <div className="text-[11px] font-mono text-[#A8B5C7] bg-[#0D1928] px-3 py-1.5 rounded border border-[rgba(100,160,220,0.15)]">
              Comprehensive Portfolio Archive URL: Under Configuration
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};
