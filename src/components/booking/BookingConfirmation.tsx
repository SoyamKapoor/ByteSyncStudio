import React, { useState } from 'react';
import { CheckCircle2, Calendar, Mail, FileText, ArrowRight, Copy, Check, ExternalLink } from 'lucide-react';
import { ConsultationBooking } from '../../types';

interface BookingConfirmationProps {
  booking: ConsultationBooking;
  onReset: () => void;
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({ booking, onReset }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(booking.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Build Google Calendar intent link if date is present
  const getGoogleCalendarUrl = () => {
    const title = encodeURIComponent(`ByteSync Studio Consultation · ${booking.service}`);
    const details = encodeURIComponent(
      `Discovery session with ByteSync Studio.\nReference: #${booking.id}\nService: ${booking.service}\nPreferred Window: ${booking.preferredTime || 'TBD'}`
    );
    // Format date YYYYMMDD
    const dateFormatted = (booking.preferredDate || '').replace(/-/g, '');
    const dates = dateFormatted ? `${dateFormatted}/${dateFormatted}` : '';
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}${dates ? `&dates=${dates}` : ''}`;
  };

  return (
    <div className="rounded-2xl bg-[#0D1928] border border-[rgba(100,160,220,0.25)] p-8 md:p-10 shadow-2xl animate-in fade-in duration-300">
      {/* Icon and Title */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-[#087BFF]/15 border border-[#00D9F5]/40 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-6 h-6 text-[#00D9F5]" />
        </div>
        <div>
          <span className="text-xs font-mono uppercase text-[#00D9F5] tracking-widest block">
            Submission Successful
          </span>
          <h3 className="text-2xl font-bold text-[#F4F7FB]">Consultation Request Received</h3>
        </div>
      </div>

      {/* Mandatory Distinction: Received Request vs Confirmed Appointment */}
      <div className="p-4 rounded-lg bg-[#091321] border border-[#087BFF]/30 text-sm text-[#F4F7FB] leading-relaxed mb-8">
        <p className="font-medium text-[#00D9F5] mb-1">Status: Pending Technical Review</p>
        <p className="text-[#A8B5C7] text-xs">
          Your consultation request has been received. Our engineering team will review your details
          and contact you at <strong className="text-[#F4F7FB]">{booking.email}</strong> to confirm
          the appointment and technical agenda.
        </p>
      </div>

      {/* Booking Summary Details */}
      <div className="space-y-4 bg-[#050B14]/60 rounded-xl p-6 border border-[rgba(100,160,220,0.12)] mb-8">
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <span className="text-xs font-mono uppercase tracking-wider text-[#A8B5C7]/70">
            Submission Summary
          </span>
          <button
            onClick={handleCopyId}
            className="flex items-center gap-1.5 text-xs font-mono text-[#00D9F5] hover:text-[#00D9F5]/80 bg-[#091321] px-2.5 py-1 rounded border border-[rgba(100,160,220,0.2)] transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy ID</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-[#A8B5C7] block">Booking Reference:</span>
            <span className="font-mono text-[#00D9F5] font-semibold text-sm">#{booking.id}</span>
          </div>

          <div>
            <span className="text-[#A8B5C7] block">Consultation Type:</span>
            <span className="text-[#F4F7FB] font-medium">{booking.consultationType}</span>
          </div>

          <div>
            <span className="text-[#A8B5C7] block">Requested Service:</span>
            <span className="text-[#F4F7FB] font-medium">{booking.service}</span>
          </div>

          <div>
            <span className="text-[#A8B5C7] block">Target Industry:</span>
            <span className="text-[#F4F7FB] font-medium">{booking.industry}</span>
          </div>

          {booking.preferredDate && (
            <div>
              <span className="text-[#A8B5C7] block">Preferred Date:</span>
              <span className="text-[#F4F7FB] font-medium">
                {booking.preferredDate} {booking.preferredTime ? `· ${booking.preferredTime}` : ''}
              </span>
            </div>
          )}

          {booking.projectBudget && (
            <div>
              <span className="text-[#A8B5C7] block">Project Budget:</span>
              <span className="text-[#F4F7FB] font-medium">{booking.projectBudget}</span>
            </div>
          )}
        </div>

        {/* Calendar Quick Add Button */}
        {booking.preferredDate && (
          <div className="pt-3 border-t border-white/5 flex items-center justify-end">
            <a
              href={getGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#F4F7FB] hover:text-[#00D9F5] bg-[#091321] hover:bg-[#0D1928] border border-[rgba(100,160,220,0.25)] hover:border-[#00D9F5]/40 px-3.5 py-1.5 rounded-lg transition-colors"
            >
              <Calendar className="w-3.5 h-3.5 text-[#00D9F5]" />
              <span>Add to Google Calendar</span>
              <ExternalLink className="w-3 h-3 text-[#A8B5C7]" />
            </a>
          </div>
        )}
      </div>

      {/* Next steps and reset button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[rgba(100,160,220,0.15)]">
        <p className="text-xs text-[#A8B5C7]">
          An acknowledgement email has been dispatched with these details.
        </p>
        <button
          onClick={onReset}
          className="px-5 py-2.5 text-xs font-semibold text-[#F4F7FB] bg-[#091321] hover:bg-[#087BFF] border border-[rgba(100,160,220,0.3)] rounded-lg transition-colors whitespace-nowrap"
        >
          Submit Another Request
        </button>
      </div>
    </div>
  );
};
