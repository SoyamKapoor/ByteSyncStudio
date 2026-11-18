import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Calendar,
  Layers,
  Cpu,
  Terminal,
  HelpCircle,
  Mail,
  Instagram,
  Check,
  ArrowRight,
  Shield,
  Activity,
  X,
} from 'lucide-react';
import { siteConfig } from '../../config/site';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (route: string) => void;
}

interface CommandItem {
  id: string;
  category: string;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  shortcut?: string;
  action: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copiedNotice, setCopiedNotice] = useState<string | null>(null);
  const [diagnosticRun, setDiagnosticRun] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollTo = (id: string) => {
    onClose();
    if (onNavigate) onNavigate('home');
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNotice(label);
    setTimeout(() => {
      setCopiedNotice(null);
      onClose();
    }, 1200);
  };

  const runDiagnostic = () => {
    setDiagnosticRun(true);
    setTimeout(() => {
      setDiagnosticRun(false);
      onClose();
    }, 1800);
  };

  const commands: CommandItem[] = [
    {
      id: 'book-consultation',
      category: 'Primary Actions',
      title: 'Book a Technical Consultation',
      subtitle: 'Complimentary 60-min discovery & system review',
      icon: <Calendar className="w-4 h-4 text-[#00D9F5]" />,
      shortcut: '↵',
      action: () => scrollTo('consultation'),
    },
    {
      id: 'copy-email',
      category: 'Direct Actions',
      title: 'Copy Email Address',
      subtitle: siteConfig.email,
      icon: <Mail className="w-4 h-4 text-[#087BFF]" />,
      action: () => copyToClipboard(siteConfig.email, 'Email copied to clipboard!'),
    },
    {
      id: 'copy-instagram',
      category: 'Direct Actions',
      title: 'Copy Instagram Handle',
      subtitle: siteConfig.instagramHandle,
      icon: <Instagram className="w-4 h-4 text-[#00D9F5]" />,
      action: () => copyToClipboard(siteConfig.instagramHandle, 'Instagram handle copied!'),
    },
    {
      id: 'run-diagnostics',
      category: 'Developer Tools',
      title: 'Run System Health Diagnostic',
      subtitle: 'Simulate runtime latency & cluster status check',
      icon: <Activity className="w-4 h-4 text-[#00D9F5]" />,
      action: runDiagnostic,
    },
    {
      id: 'nav-services',
      category: 'Navigation',
      title: 'Core Engineering Capabilities',
      subtitle: 'AI, custom web, backend APIs, automation',
      icon: <Cpu className="w-4 h-4 text-[#087BFF]" />,
      action: () => scrollTo('services'),
    },
    {
      id: 'nav-solutions',
      category: 'Navigation',
      title: 'Industry Solutions',
      subtitle: 'Real estate, healthcare, startups, enterprise',
      icon: <Layers className="w-4 h-4 text-[#00D9F5]" />,
      action: () => scrollTo('solutions'),
    },
    {
      id: 'nav-work',
      category: 'Navigation',
      title: 'Selected Work & Technical Demonstrations',
      subtitle: 'Explore architecture & production prototypes',
      icon: <Terminal className="w-4 h-4 text-[#087BFF]" />,
      action: () => scrollTo('work'),
    },
    {
      id: 'nav-about',
      category: 'Navigation',
      title: 'Engineering Principles & About Us',
      subtitle: 'Practical technology & purposeful engineering',
      icon: <Shield className="w-4 h-4 text-[#00D9F5]" />,
      action: () => scrollTo('about'),
    },
    {
      id: 'nav-faq',
      category: 'Navigation',
      title: 'Frequently Asked Questions',
      subtitle: 'Timelines, security, pricing structure, NDAs',
      icon: <HelpCircle className="w-4 h-4 text-[#087BFF]" />,
      action: () => scrollTo('faq'),
    },
    {
      id: 'nav-contact',
      category: 'Navigation',
      title: 'Contact & Verified Channels',
      subtitle: 'Instagram, email, LinkedIn, direct inquiry',
      icon: <ArrowRight className="w-4 h-4 text-[#00D9F5]" />,
      action: () => scrollTo('contact'),
    },
  ];

  const filteredCommands = commands.filter((c) => {
    const q = query.toLowerCase();
    return c.title.toLowerCase().includes(q) || (c.subtitle && c.subtitle.toLowerCase().includes(q));
  });

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setCopiedNotice(null);
      setDiagnosticRun(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Keyboard navigation inside palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredCommands.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 sm:px-6">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#050B14]/80 backdrop-blur-md"
          />

          {/* Command Palette Modal Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl bg-[#091321] border border-[rgba(100,160,220,0.25)] rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[80vh]"
          >
            {/* Top Search Input Bar */}
            <div className="flex items-center px-4 py-3.5 border-b border-[rgba(100,160,220,0.15)] bg-[#0D1928]/90">
              <Search className="w-5 h-5 text-[#00D9F5] shrink-0 mr-3" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Type a command, query, or jump to section..."
                className="w-full bg-transparent text-[#F4F7FB] text-sm placeholder-[#A8B5C7]/60 focus:outline-none font-sans"
              />
              <button
                onClick={onClose}
                className="p-1 text-[#A8B5C7] hover:text-[#F4F7FB] rounded-md transition-colors ml-2"
                aria-label="Close command palette"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Diagnostic Alert if triggered */}
            {diagnosticRun && (
              <div className="p-3 bg-[#00D9F5]/10 border-b border-[#00D9F5]/30 text-xs font-mono text-[#00D9F5] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00D9F5] animate-ping" />
                <span>[CLUSTER STATUS: 100% HEALTHY] · LATENCY: 14ms · TYPESCRIPT: DETERMINISTIC STRICT</span>
              </div>
            )}

            {/* Copied Notification */}
            {copiedNotice && (
              <div className="p-3 bg-[#087BFF]/15 border-b border-[#087BFF]/30 text-xs font-mono text-[#F4F7FB] flex items-center gap-2">
                <Check className="w-4 h-4 text-[#00D9F5]" />
                <span>{copiedNotice}</span>
              </div>
            )}

            {/* Commands List */}
            <div className="overflow-y-auto p-2 space-y-1 divide-y divide-white/5 scrollbar-thin">
              {filteredCommands.length === 0 ? (
                <div className="p-8 text-center text-sm text-[#A8B5C7] font-mono">
                  No matching commands found for "{query}".
                </div>
              ) : (
                filteredCommands.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      onClick={item.action}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-[#087BFF]/15 border border-[#00D9F5]/30 text-[#F4F7FB]'
                          : 'text-[#A8B5C7] hover:bg-[#0D1928] border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            isSelected ? 'bg-[#050B14] shadow-sm' : 'bg-[#050B14]/60'
                          }`}
                        >
                          {item.icon}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-[#F4F7FB]">{item.title}</div>
                          {item.subtitle && (
                            <div className="text-xs text-[#A8B5C7]/70 font-mono">{item.subtitle}</div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#A8B5C7]/50 hidden sm:inline-block">
                          {item.category}
                        </span>
                        {item.shortcut && (
                          <kbd className="px-2 py-0.5 text-[10px] font-mono text-[#00D9F5] bg-[#050B14] border border-[rgba(100,160,220,0.25)] rounded">
                            {item.shortcut}
                          </kbd>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom Keyboard Legend */}
            <div className="px-4 py-2.5 bg-[#050B14] border-t border-[rgba(100,160,220,0.15)] flex items-center justify-between text-[11px] font-mono text-[#A8B5C7]/70">
              <div className="flex items-center gap-4">
                <span>
                  <kbd className="px-1.5 py-0.5 rounded bg-[#0D1928] border border-white/10 text-[#F4F7FB]">↑</kbd>{' '}
                  <kbd className="px-1.5 py-0.5 rounded bg-[#0D1928] border border-white/10 text-[#F4F7FB]">↓</kbd>{' '}
                  Navigate
                </span>
                <span>
                  <kbd className="px-1.5 py-0.5 rounded bg-[#0D1928] border border-white/10 text-[#F4F7FB]">↵</kbd>{' '}
                  Select
                </span>
                <span>
                  <kbd className="px-1.5 py-0.5 rounded bg-[#0D1928] border border-white/10 text-[#F4F7FB]">ESC</kbd>{' '}
                  Close
                </span>
              </div>
              <span className="text-[#00D9F5]">ByteSync Studio CLI</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

