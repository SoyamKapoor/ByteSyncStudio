import React, { useState } from 'react';
import { BrandLogo } from '../ui/BrandLogo';
import { ShieldCheck, Lock, Mail, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (token: string, user: any) => void;
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToSite }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const apiUrl = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
      const endpoint = apiUrl ? `${apiUrl}/api/admin/login` : '/api/admin/login';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error(
          'Admin authentication requires the backend server. Configure VITE_API_URL or run the backend service.'
        );
      }

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid administrator credentials');
      }

      onLoginSuccess(data.token, data.user);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <BrandLogo size="lg" className="justify-center mb-4" />
          <h1 className="text-2xl font-bold text-[#F4F7FB]">Administrator Access</h1>
          <p className="text-xs text-[#A8B5C7] mt-1 font-mono">
            ByteSync Studio Management Console
          </p>
        </div>

        <div className="rounded-2xl bg-[#0D1928] border border-[rgba(100,160,220,0.25)] p-8 shadow-2xl">
          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-950/40 border border-red-500/30 flex items-center gap-2.5 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-[#F4F7FB] mb-2">
                Administrator Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="admin@bytesyncstudio.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#091321] border border-[rgba(100,160,220,0.2)] text-sm text-[#F4F7FB] placeholder-[#A8B5C7]/30 focus:outline-none focus:border-[#00D9F5] focus:ring-1 focus:ring-[#00D9F5]"
                />
                <Mail className="w-4 h-4 text-[#A8B5C7] absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#F4F7FB] mb-2">
                Security Passkey
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter administrator passkey"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#091321] border border-[rgba(100,160,220,0.2)] text-sm text-[#F4F7FB] placeholder-[#A8B5C7]/30 focus:outline-none focus:border-[#00D9F5] focus:ring-1 focus:ring-[#00D9F5]"
                />
                <Lock className="w-4 h-4 text-[#A8B5C7] absolute left-3.5 top-3" />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-gradient-to-r from-[#087BFF] to-[#0098f5] hover:to-[#00D9F5] rounded-lg transition-all duration-200 shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Authenticate Console</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-[rgba(100,160,220,0.12)] text-center">
            <button
              onClick={onBackToSite}
              className="text-xs text-[#A8B5C7] hover:text-[#00D9F5] transition-colors"
            >
              ← Back to Public Website
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
