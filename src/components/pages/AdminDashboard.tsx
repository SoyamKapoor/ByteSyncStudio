import React, { useState, useEffect } from 'react';
import { BrandLogo } from '../ui/BrandLogo';
import { ConsultationBooking, BookingStatus, PaymentStatus } from '../../types';
import {
  Search,
  Filter,
  RefreshCw,
  LogOut,
  ExternalLink,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  Save,
  Calendar,
  Building,
  Mail,
  User,
  X,
  Download,
  AlertCircle,
  Send,
  Loader2,
  Check,
} from 'lucide-react';

interface AdminDashboardProps {
  token: string;
  onLogout: () => void;
  onBackToSite: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  token,
  onLogout,
  onBackToSite,
}) => {
  const [bookings, setBookings] = useState<ConsultationBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<ConsultationBooking | null>(null);
  const [editingNotes, setEditingNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  const apiUrl = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (industryFilter !== 'all') params.set('industry', industryFilter);
      if (serviceFilter !== 'all') params.set('service', serviceFilter);

      const res = await fetch(`${apiUrl}/api/admin/consultations?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401 || res.status === 403) {
        onLogout();
        return;
      }
      const data = await res.json();
      if (data.success) {
        setBookings(data.data);
      }
    } catch (err) {
      console.error('[Admin Fetch Error]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter, industryFilter, serviceFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBookings();
  };

  const handleSelectBooking = (b: ConsultationBooking) => {
    setSelectedBooking(b);
    setEditingNotes(b.internalNotes || '');
    setFeedback(null);
  };

  const handleUpdateStatus = async (
    bookingId: string,
    newStatus: BookingStatus,
    setConfirmedTimestamp = false
  ) => {
    setIsUpdating(true);
    setFeedback(null);
    try {
      const body: any = {
        bookingStatus: newStatus,
        internalNotes: editingNotes,
      };
      if (setConfirmedTimestamp) {
        body.confirmedAt = new Date().toISOString();
      }

      const res = await fetch(`${apiUrl}/api/admin/consultations/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (res.status === 401 || res.status === 403) {
        onLogout();
        return;
      }

      const data = await res.json();
      if (data.success) {
        const updated = data.data || { ...body };
        // update local state
        setBookings((prev) =>
          prev.map((item) => (item.id === bookingId ? { ...item, ...updated } : item))
        );
        if (selectedBooking && selectedBooking.id === bookingId) {
          setSelectedBooking((prev) => (prev ? { ...prev, ...updated } : null));
        }

        if (newStatus === 'confirmed') {
          if (data.emailDispatched) {
            if (data.emailWarning) {
              setFeedback({
                type: 'info',
                message: `✓ Confirmed! ${data.emailWarning}`,
              });
            } else {
              setFeedback({
                type: 'success',
                message: `✓ Appointment confirmed! Confirmation email dispatched directly to ${selectedBooking?.email}.`,
              });
            }
          } else if (data.emailError) {
            setFeedback({
              type: 'error',
              message: `Appointment confirmed, but email dispatch warning: ${data.emailError}`,
            });
          } else {
            setFeedback({
              type: 'success',
              message: `Appointment confirmed for ${selectedBooking?.fullName}.`,
            });
          }
        } else {
          setFeedback({
            type: 'success',
            message: `Status updated to ${newStatus.replace('_', ' ')}.`,
          });
        }
      } else {
        setFeedback({
          type: 'error',
          message: data.error || 'Failed to update consultation record.',
        });
      }
    } catch (err: any) {
      console.error('[Update Error]', err);
      setFeedback({
        type: 'error',
        message: err.message || 'Network error updating consultation.',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleResendConfirmation = async (bookingId: string) => {
    if (!selectedBooking) return;
    setIsSendingEmail(true);
    setFeedback(null);
    try {
      const res = await fetch(`${apiUrl}/api/admin/consultations/${bookingId}/send-confirmation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ meetingNotes: editingNotes }),
      });
      if (res.status === 401 || res.status === 403) {
        onLogout();
        return;
      }
      const data = await res.json();
      if (data.success) {
        if (data.warning) {
          setFeedback({
            type: 'info',
            message: `Confirmation sent: ${data.warning}`,
          });
        } else {
          setFeedback({
            type: 'success',
            message: `✓ Confirmation email successfully sent directly to ${selectedBooking.email}!`,
          });
        }
      } else {
        setFeedback({
          type: 'error',
          message: `Email sending issue: ${data.error || data.message || 'Unknown error'}`,
        });
      }
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: `Network error: ${err.message}`,
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${apiUrl}/api/admin/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (e) {
      console.warn('[Logout Error]', e);
    }
    onLogout();
  };

  const exportToCSV = () => {
    if (bookings.length === 0) return;
    const headers = [
      'ID',
      'Full Name',
      'Email',
      'Company',
      'Industry',
      'Service',
      'Consultation Type',
      'Project Budget',
      'Preferred Date',
      'Preferred Time',
      'Status',
      'Received At',
      'Description',
    ];

    // Mitigate CSV Formula Injection (CWE-1236)
    const sanitizeCsvCell = (value: string | undefined | null): string => {
      if (!value) return '""';
      const str = String(value).trim();
      // Neutralize formula triggers: =, +, -, @, \t, \r by prepending a literal single quote
      const safeStr = /^[=+\-@\t\r]/.test(str) ? `'${str}` : str;
      return `"${safeStr.replace(/"/g, '""')}"`;
    };

    const rows = bookings.map((b) => [
      sanitizeCsvCell(b.id),
      sanitizeCsvCell(b.fullName),
      sanitizeCsvCell(b.email),
      sanitizeCsvCell(b.companyName),
      sanitizeCsvCell(b.industry),
      sanitizeCsvCell(b.service),
      sanitizeCsvCell(b.consultationType),
      sanitizeCsvCell(b.projectBudget),
      sanitizeCsvCell(b.preferredDate),
      sanitizeCsvCell(b.preferredTime),
      sanitizeCsvCell(b.bookingStatus),
      sanitizeCsvCell(b.createdAt),
      sanitizeCsvCell(b.projectDescription),
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `bytesync_consultations_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed':
        return <span className="text-emerald-400 font-mono text-xs">Confirmed</span>;
      case 'pending_review':
        return <span className="text-amber-300 font-mono text-xs">Pending Review</span>;
      case 'completed':
        return <span className="text-blue-400 font-mono text-xs">Completed</span>;
      case 'cancelled':
        return <span className="text-red-400 font-mono text-xs">Cancelled</span>;
      default:
        return <span className="text-[#A8B5C7] font-mono text-xs">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#050B14] text-[#F4F7FB] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[rgba(100,160,220,0.18)] gap-4">
          <div className="flex items-center gap-4">
            <BrandLogo size="md" />
            <div className="hidden sm:block h-6 w-px bg-[rgba(100,160,220,0.2)]" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#00D9F5]">
              Executive Consultation Console
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBackToSite}
              className="px-3.5 py-1.5 text-xs text-[#A8B5C7] hover:text-[#F4F7FB] bg-[#091321] border border-[rgba(100,160,220,0.2)] rounded-lg transition-colors"
            >
              Public Site
            </button>
            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 text-xs text-red-400 hover:text-red-300 bg-red-950/30 border border-red-500/20 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-[#0D1928] p-5 rounded-xl border border-[rgba(100,160,220,0.18)]">
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="md:col-span-5 relative">
            <input
              type="text"
              placeholder="Search by name, email, company, or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg bg-[#091321] border border-[rgba(100,160,220,0.2)] text-[#F4F7FB] placeholder-[#A8B5C7]/50 focus:outline-none focus:border-[#00D9F5]"
            />
            <Search className="w-3.5 h-3.5 text-[#A8B5C7] absolute left-3 top-2.5" />
          </form>

          {/* Status Filter */}
          <div className="md:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-lg bg-[#091321] border border-[rgba(100,160,220,0.2)] text-[#F4F7FB] focus:outline-none focus:border-[#00D9F5]"
            >
              <option value="all">All Statuses</option>
              <option value="pending_review">Pending Review</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Industry Filter */}
          <div className="md:col-span-2">
            <select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-lg bg-[#091321] border border-[rgba(100,160,220,0.2)] text-[#F4F7FB] focus:outline-none focus:border-[#00D9F5]"
            >
              <option value="all">All Industries</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Healthcare & Clinics">Healthcare</option>
              <option value="Technology / Startup">Startups</option>
              <option value="E-commerce">E-commerce</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Actions: Refresh & Export */}
          <div className="md:col-span-3 flex items-center justify-end gap-2.5">
            <button
              onClick={exportToCSV}
              disabled={bookings.length === 0}
              className="px-3.5 py-2 text-xs text-[#A8B5C7] hover:text-[#F4F7FB] bg-[#091321] hover:bg-[#0D1928] border border-[rgba(100,160,220,0.25)] rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              title="Export filtered inquiries to CSV"
            >
              <Download className="w-3.5 h-3.5 text-[#00D9F5]" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={fetchBookings}
              className="px-3.5 py-2 text-xs text-[#00D9F5] bg-[#091321] hover:bg-[#087BFF]/20 border border-[#00D9F5]/30 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Consultations Data Table */}
        <div className="rounded-xl bg-[#0D1928] border border-[rgba(100,160,220,0.18)] overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-[rgba(100,160,220,0.12)] flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#F4F7FB]">Consultation Inquiries</h2>
            <span className="text-xs font-mono tabular-nums text-[#A8B5C7]">
              {bookings.length} {bookings.length === 1 ? 'Record' : 'Records'}
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-[#A8B5C7] font-mono">
              Querying consultation registry...
            </div>
          ) : bookings.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#A8B5C7]">
              No consultation records match the active criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[rgba(100,160,220,0.12)] bg-[#091321]/60 text-[#A8B5C7] uppercase font-mono text-[10px] tracking-wider">
                    <th className="py-3 px-4">Client</th>
                    <th className="py-3 px-4">Organization</th>
                    <th className="py-3 px-4">Service & Industry</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Preferred Slot</th>
                    <th className="py-3 px-4 text-right">Received</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(100,160,220,0.08)]">
                  {bookings.map((b) => (
                    <tr
                      key={b.id}
                      onClick={() => handleSelectBooking(b)}
                      className={`hover:bg-[#091321]/80 cursor-pointer transition-colors ${
                        selectedBooking?.id === b.id ? 'bg-[#087BFF]/10' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#F4F7FB]">{b.fullName}</div>
                        <div className="text-[11px] text-[#A8B5C7]">{b.email}</div>
                      </td>
                      <td className="py-3 px-4 text-[#F4F7FB]">
                        {b.companyName || <span className="text-[#A8B5C7]/50">—</span>}
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-[#00D9F5] font-medium">{b.service}</div>
                        <div className="text-[11px] text-[#A8B5C7]">{b.industry}</div>
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(b.bookingStatus)}</td>
                      <td className="py-3 px-4 font-mono text-[11px] text-[#A8B5C7]">
                        {b.preferredDate || 'Flexible'} {b.preferredTime ? `· ${b.preferredTime}` : ''}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-[11px] text-[#A8B5C7] tabular-nums">
                        {new Date(b.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectBooking(b);
                          }}
                          className="px-2.5 py-1 text-[11px] font-mono text-[#00D9F5] hover:bg-[#00D9F5]/10 rounded border border-[#00D9F5]/20"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Selected Booking Detail Modal / Panel */}
        {selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0D1928] border border-[rgba(100,160,220,0.3)] p-6 sm:p-8 shadow-2xl space-y-6">
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-[rgba(100,160,220,0.15)] pb-4">
                <div>
                  <div className="text-xs font-mono text-[#00D9F5] mb-1">
                    Booking #{selectedBooking.id}
                  </div>
                  <h3 className="text-xl font-bold text-[#F4F7FB]">
                    {selectedBooking.fullName}
                  </h3>
                  <div className="text-xs text-[#A8B5C7] flex items-center gap-2 mt-0.5">
                    <span>{selectedBooking.email}</span>
                    {selectedBooking.companyName && (
                      <>
                        <span>·</span>
                        <span>{selectedBooking.companyName}</span>
                      </>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedBooking(null)}
                  className="p-1.5 text-[#A8B5C7] hover:text-white rounded-lg hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Requirement Summary Grid */}
              <div className="grid grid-cols-2 gap-4 bg-[#091321] p-4 rounded-xl border border-[rgba(100,160,220,0.12)] text-xs">
                <div>
                  <span className="text-[#A8B5C7] block mb-0.5">Industry:</span>
                  <span className="text-[#F4F7FB] font-medium">{selectedBooking.industry}</span>
                </div>
                <div>
                  <span className="text-[#A8B5C7] block mb-0.5">Service:</span>
                  <span className="text-[#00D9F5] font-medium">{selectedBooking.service}</span>
                </div>
                <div>
                  <span className="text-[#A8B5C7] block mb-0.5">Consultation Type:</span>
                  <span className="text-[#F4F7FB] font-medium">{selectedBooking.consultationType}</span>
                </div>
                <div>
                  <span className="text-[#A8B5C7] block mb-0.5">Project Budget:</span>
                  <span className="text-[#F4F7FB] font-medium">
                    {selectedBooking.projectBudget || 'Not specified'}
                  </span>
                </div>
                <div>
                  <span className="text-[#A8B5C7] block mb-0.5">Preferred Slot:</span>
                  <span className="text-[#F4F7FB] font-medium">
                    {selectedBooking.preferredDate || 'Flexible'} {selectedBooking.preferredTime}
                  </span>
                </div>
                <div>
                  <span className="text-[#A8B5C7] block mb-0.5">Current Status:</span>
                  {getStatusBadge(selectedBooking.bookingStatus)}
                </div>
              </div>

              {/* Project Description */}
              <div>
                <label className="block text-xs font-mono uppercase text-[#A8B5C7] mb-2">
                  Client Description & Problem Statement
                </label>
                <div className="p-4 rounded-lg bg-[#050B14] border border-[rgba(100,160,220,0.15)] text-xs text-[#F4F7FB] leading-relaxed whitespace-pre-wrap">
                  {selectedBooking.projectDescription}
                </div>
              </div>

              {/* Internal Notes */}
              <div>
                <label className="block text-xs font-mono uppercase text-[#A8B5C7] mb-2">
                  Internal Architectural Notes & Meeting Link
                </label>
                <textarea
                  rows={3}
                  value={editingNotes}
                  onChange={(e) => setEditingNotes(e.target.value)}
                  placeholder="e.g. Google Meet link: https://meet.google.com/xyz-abcd-efg — Please bring your database architecture diagram..."
                  className="w-full p-3 rounded-lg bg-[#050B14] border border-[rgba(100,160,220,0.2)] text-xs text-[#F4F7FB] placeholder-[#A8B5C7]/40 focus:outline-none focus:border-[#00D9F5]"
                />
                <p className="text-[11px] text-[#A8B5C7]/70 mt-1.5">
                  💡 <strong>Automated Email:</strong> Any meeting links or preparation notes entered here will be formatted and included in the client's Confirmation Email.
                </p>
              </div>

              {/* Feedback Banner */}
              {feedback && (
                <div
                  className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
                    feedback.type === 'success'
                      ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                      : feedback.type === 'error'
                      ? 'bg-red-950/40 border-red-500/30 text-red-300'
                      : 'bg-blue-950/40 border-blue-500/30 text-blue-300'
                  }`}
                >
                  {feedback.type === 'success' ? (
                    <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  )}
                  <span>{feedback.message}</span>
                </div>
              )}

              {/* Management Actions */}
              <div className="pt-4 border-t border-[rgba(100,160,220,0.15)] flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  {selectedBooking.bookingStatus !== 'confirmed' ? (
                    <button
                      onClick={() => handleUpdateStatus(selectedBooking.id, 'confirmed', true)}
                      disabled={isUpdating}
                      className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                      {isUpdating ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <CheckCircle className="w-3.5 h-3.5" />
                      )}
                      <span>Confirm & Send Email</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleResendConfirmation(selectedBooking.id)}
                      disabled={isSendingEmail}
                      className="px-3.5 py-2 text-xs font-semibold text-[#00D9F5] hover:text-white bg-[#00D9F5]/10 hover:bg-[#00D9F5]/20 border border-[#00D9F5]/40 rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50"
                      title="Resend the confirmation email with updated notes or meeting link"
                    >
                      {isSendingEmail ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Mail className="w-3.5 h-3.5" />
                      )}
                      <span>Resend Confirmation Email</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleUpdateStatus(selectedBooking.id, 'completed')}
                    disabled={isUpdating}
                    className="px-3.5 py-2 text-xs font-semibold text-white bg-[#087BFF] hover:bg-[#00D9F5] rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <span>Mark Completed</span>
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(selectedBooking.id, 'cancelled')}
                    disabled={isUpdating}
                    className="px-3 py-2 text-xs text-red-400 hover:bg-red-950/40 border border-red-500/20 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>

                <button
                  onClick={() =>
                    handleUpdateStatus(selectedBooking.id, selectedBooking.bookingStatus)
                  }
                  disabled={isUpdating}
                  className="px-4 py-2 text-xs font-medium text-[#F4F7FB] bg-[#091321] hover:bg-white/10 border border-[rgba(100,160,220,0.3)] rounded-lg flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Notes</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
