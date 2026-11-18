import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { consultationSchema, ConsultationFormData } from '../../lib/validation/consultation';
import { siteConfig } from '../../config/site';
import { ConsultationBooking, IndustryType, ServiceType, ConsultationType } from '../../types';
import { BookingConfirmation } from './BookingConfirmation';
import { Loader2, Send, AlertCircle, ShieldCheck } from 'lucide-react';
import { getSupabaseClient } from '../../lib/supabase/client';

interface ConsultationFormProps {
  initialService?: ServiceType;
  initialIndustry?: IndustryType;
}

export const ConsultationForm: React.FC<ConsultationFormProps> = ({
  initialService,
  initialIndustry,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [createdBooking, setCreatedBooking] = useState<ConsultationBooking | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<ConsultationFormData>({
    defaultValues: {
      fullName: '',
      email: '',
      companyName: '',
      industry: initialIndustry || 'Technology / Startup',
      service: initialService || 'AI & Machine Learning',
      projectDescription: '',
      projectBudget: '',
      consultationType: 'Free Discovery Call',
      preferredDate: '',
      preferredTime: '',
      website_hp: '',
    },
  });

  const selectedConsultationType = watch('consultationType');

  // Synchronize incoming props when user clicks service or industry cards
  useEffect(() => {
    if (initialService) setValue('service', initialService);
  }, [initialService, setValue]);

  useEffect(() => {
    if (initialIndustry) setValue('industry', initialIndustry);
  }, [initialIndustry, setValue]);

  const onSubmit = async (data: ConsultationFormData) => {
    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      // Validate schema in browser
      const validation = consultationSchema.safeParse(data);
      if (!validation.success) {
        setSubmissionError(validation.error.issues[0]?.message || 'Validation error');
        setIsSubmitting(false);
        return;
      }

      const apiUrl = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
      const endpoint = apiUrl ? `${apiUrl}/api/consultations` : '/api/consultations';

      let bookingResult: any = null;
      let apiFailed = false;

      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const result = await res.json();
          if (res.ok && result.success) {
            bookingResult = result.booking;
          } else {
            throw new Error(result.error || 'Failed to submit consultation request.');
          }
        } else {
          // Non-JSON response (e.g. 404 HTML on static hosting)
          apiFailed = true;
        }
      } catch (fetchErr: any) {
        apiFailed = true;
      }

      // Direct Client-Side Supabase fallback if backend server is not available
      if (apiFailed && !bookingResult) {
        const supabase = getSupabaseClient();
        if (supabase) {
          const id = crypto.randomUUID();
          const { data: dbBooking, error: dbError } = await supabase
            .from('consultations')
            .insert({
              id,
              full_name: data.fullName,
              email: data.email,
              company_name: data.companyName || null,
              industry: data.industry,
              service: data.service,
              project_description: data.projectDescription,
              project_budget: data.projectBudget,
              consultation_type: data.consultationType,
              preferred_date: data.preferredDate,
              preferred_time: data.preferredTime,
              booking_status: 'pending_review',
              payment_status: 'not_required',
            })
            .select()
            .single();

          if (dbError) {
            throw new Error(dbError.message || 'Database submission failed.');
          }

          bookingResult = {
            id: dbBooking.id,
            fullName: dbBooking.full_name,
            email: dbBooking.email,
            companyName: dbBooking.company_name,
            industry: dbBooking.industry,
            service: dbBooking.service,
            projectDescription: dbBooking.project_description,
            projectBudget: dbBooking.project_budget,
            consultationType: dbBooking.consultation_type,
            preferredDate: dbBooking.preferred_date,
            preferredTime: dbBooking.preferred_time,
            bookingStatus: dbBooking.booking_status,
            createdAt: dbBooking.created_at,
          };
        } else {
          throw new Error(
            'Online booking service is currently in static preview mode. Please email us directly at contact.bytesyncstudio@gmail.com to schedule your consultation!'
          );
        }
      }

      setCreatedBooking(bookingResult);
    } catch (err: any) {
      console.error('[Booking Submission Error]', err);
      setSubmissionError(
        err.message || 'Network error occurred. Please check your connection and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (createdBooking) {
    return (
      <BookingConfirmation
        booking={createdBooking}
        onReset={() => {
          setCreatedBooking(null);
          reset();
        }}
      />
    );
  }

  return (
    <div className="rounded-2xl bg-[#0D1928] border border-[rgba(100,160,220,0.22)] p-8 sm:p-10 shadow-2xl backdrop-blur-sm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Spam Honeypot (hidden from real users) */}
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          style={{ display: 'none' }}
          {...register('website_hp')}
        />

        {submissionError && (
          <div className="p-4 rounded-lg bg-red-950/40 border border-red-500/30 flex items-start gap-3 text-red-200 text-xs">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{submissionError}</span>
          </div>
        )}

        {/* Row 1: Full Name & Work Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-medium text-[#F4F7FB] mb-2">
              Full Name <span className="text-[#00D9F5]">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Elena Rostova"
              className="w-full px-4 py-2.5 rounded-lg bg-[#091321] border border-[rgba(100,160,220,0.2)] text-sm text-[#F4F7FB] placeholder-[#A8B5C7]/40 focus:outline-none focus:border-[#00D9F5] focus:ring-1 focus:ring-[#00D9F5] transition-colors"
              {...register('fullName', { required: 'Please enter your name' })}
            />
            {errors.fullName && (
              <span className="text-red-400 text-xs mt-1 block">{errors.fullName.message}</span>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-[#F4F7FB] mb-2">
              Work Email <span className="text-[#00D9F5]">*</span>
            </label>
            <input
              type="email"
              placeholder="elena@company.com"
              className="w-full px-4 py-2.5 rounded-lg bg-[#091321] border border-[rgba(100,160,220,0.2)] text-sm text-[#F4F7FB] placeholder-[#A8B5C7]/40 focus:outline-none focus:border-[#00D9F5] focus:ring-1 focus:ring-[#00D9F5] transition-colors"
              {...register('email', { required: 'Please enter your work email' })}
            />
            {errors.email && (
              <span className="text-red-400 text-xs mt-1 block">{errors.email.message}</span>
            )}
          </div>
        </div>

        {/* Row 2: Company Name & Industry */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-medium text-[#F4F7FB] mb-2">
              Company / Practice Name <span className="text-[#A8B5C7]/60">(Optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Apex Health Systems"
              className="w-full px-4 py-2.5 rounded-lg bg-[#091321] border border-[rgba(100,160,220,0.2)] text-sm text-[#F4F7FB] placeholder-[#A8B5C7]/40 focus:outline-none focus:border-[#00D9F5] focus:ring-1 focus:ring-[#00D9F5] transition-colors"
              {...register('companyName')}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#F4F7FB] mb-2">
              Industry <span className="text-[#00D9F5]">*</span>
            </label>
            <select
              className="w-full px-4 py-2.5 rounded-lg bg-[#091321] border border-[rgba(100,160,220,0.2)] text-sm text-[#F4F7FB] focus:outline-none focus:border-[#00D9F5] focus:ring-1 focus:ring-[#00D9F5] transition-colors"
              {...register('industry')}
            >
              <option value="Real Estate">Real Estate</option>
              <option value="Healthcare & Clinics">Healthcare & Clinics</option>
              <option value="Technology / Startup">Technology / Startup</option>
              <option value="E-commerce">E-commerce</option>
              <option value="Professional Services">Professional Services</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Row 3: Requested Service & Consultation Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-medium text-[#F4F7FB] mb-2">
              Service Required <span className="text-[#00D9F5]">*</span>
            </label>
            <select
              className="w-full px-4 py-2.5 rounded-lg bg-[#091321] border border-[rgba(100,160,220,0.2)] text-sm text-[#F4F7FB] focus:outline-none focus:border-[#00D9F5] focus:ring-1 focus:ring-[#00D9F5] transition-colors"
              {...register('service')}
            >
              <option value="AI & Machine Learning">AI & Machine Learning</option>
              <option value="Custom Web Development">Custom Web Development</option>
              <option value="Backend Systems & APIs">Backend Systems & APIs</option>
              <option value="Business Automation">Business Automation</option>
              <option value="MLOps & AI Engineering">MLOps & AI Engineering</option>
              <option value="AI Integration">AI Integration</option>
              <option value="Not Sure Yet">Not Sure Yet</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#F4F7FB] mb-2">
              Consultation Format <span className="text-[#00D9F5]">*</span>
            </label>
            <select
              className="w-full px-4 py-2.5 rounded-lg bg-[#091321] border border-[rgba(100,160,220,0.2)] text-sm text-[#F4F7FB] focus:outline-none focus:border-[#00D9F5] focus:ring-1 focus:ring-[#00D9F5] transition-colors"
              {...register('consultationType')}
            >
              <option value="Free Discovery Call">Free Discovery Call (Recommended · 30 min)</option>
              <option value="Paid Technical Consultation">
                Paid Technical Consultation (In-Depth Architecture)
              </option>
            </select>
          </div>
        </div>

        {/* Notice for paid consultation if chosen but unconfigured */}
        {selectedConsultationType === 'Paid Technical Consultation' && (
          <div className="p-3.5 rounded-lg bg-[#091321] border border-[#00D9F5]/30 text-xs text-[#A8B5C7]">
            <p className="text-[#00D9F5] font-semibold mb-1">Notice on Paid Technical Engagements</p>
            <p>
              ByteSync Studio currently conducts comprehensive discovery and architecture assessments
              complimentarily prior to formal project scoping. No payment is required to submit your
              requirements today.
            </p>
          </div>
        )}

        {/* Row 4: Project Budget, Preferred Date & Preferred Time */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-medium text-[#F4F7FB] mb-2">
              Project Budget <span className="text-[#00D9F5]">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. $10,000 - $25,000"
              className="w-full px-4 py-2.5 rounded-lg bg-[#091321] border border-[rgba(100,160,220,0.2)] text-sm text-[#F4F7FB] placeholder-[#A8B5C7]/40 focus:outline-none focus:border-[#00D9F5] focus:ring-1 focus:ring-[#00D9F5] transition-colors"
              {...register('projectBudget', {
                required: 'Please enter your project budget',
              })}
            />
            {errors.projectBudget && (
              <span className="text-red-400 text-xs mt-1 block">
                {errors.projectBudget.message}
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-[#F4F7FB] mb-2">
              Preferred Date <span className="text-[#00D9F5]">*</span>
            </label>
            <input
              type="date"
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2.5 rounded-lg bg-[#091321] border border-[rgba(100,160,220,0.2)] text-sm text-[#F4F7FB] focus:outline-none focus:border-[#00D9F5] focus:ring-1 focus:ring-[#00D9F5] transition-colors"
              {...register('preferredDate', {
                required: 'Please select a preferred date',
              })}
            />
            {errors.preferredDate ? (
              <span className="text-red-400 text-xs mt-1 block">
                {errors.preferredDate.message}
              </span>
            ) : (
              <span className="text-[11px] text-[#A8B5C7]/60 mt-1 block">
                Mon – Fri discovery sessions recommended
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-[#F4F7FB] mb-2">
              Preferred Time Window <span className="text-[#00D9F5]">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. 2:00 PM EST"
              className="w-full px-4 py-2.5 rounded-lg bg-[#091321] border border-[rgba(100,160,220,0.2)] text-sm text-[#F4F7FB] placeholder-[#A8B5C7]/40 focus:outline-none focus:border-[#00D9F5] focus:ring-1 focus:ring-[#00D9F5] transition-colors"
              {...register('preferredTime', {
                required: 'Please enter a preferred time window',
              })}
            />
            {errors.preferredTime ? (
              <span className="text-red-400 text-xs mt-1 block">
                {errors.preferredTime.message}
              </span>
            ) : (
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {[
                  '10:00 AM - 1:00 PM EST',
                  '2:00 PM - 5:00 PM EST',
                  '5:00 PM - 8:00 PM EST',
                ].map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setValue('preferredTime', slot, { shouldValidate: true })}
                    className="text-[10px] font-mono text-[#00D9F5]/80 hover:text-[#00D9F5] bg-[#091321] hover:bg-[#087BFF]/20 border border-[rgba(100,160,220,0.2)] hover:border-[#00D9F5]/40 px-2 py-0.5 rounded transition-colors"
                  >
                    {slot.replace(' - ', '–').replace(' EST', '')}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Row 5: Project Description */}
        <div>
          <label className="block text-xs font-medium text-[#F4F7FB] mb-2">
            Project Description & Requirements <span className="text-[#00D9F5]">*</span>
          </label>
          <textarea
            rows={4}
            placeholder="Tell us about your business, current workflows, specific pain points, or what software/AI capabilities you are looking to engineer..."
            className="w-full px-4 py-3 rounded-lg bg-[#091321] border border-[rgba(100,160,220,0.2)] text-sm text-[#F4F7FB] placeholder-[#A8B5C7]/40 focus:outline-none focus:border-[#00D9F5] focus:ring-1 focus:ring-[#00D9F5] transition-colors"
            {...register('projectDescription', {
              required: 'Please describe your project or operational requirements',
              minLength: {
                value: 20,
                message: 'Please provide at least 20 characters of detail',
              },
            })}
          />
          {errors.projectDescription && (
            <span className="text-red-400 text-xs mt-1 block">
              {errors.projectDescription.message}
            </span>
          )}
        </div>

        {/* Submit Button & Assurance */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-[#A8B5C7]">
            <ShieldCheck className="w-4 h-4 text-[#00D9F5] shrink-0" />
            <span>Strict privacy. No unsolicited emails or data sharing.</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#087BFF] to-[#0098f5] hover:to-[#00D9F5] rounded-lg transition-all duration-200 shadow-lg shadow-[#087BFF]/25 hover:shadow-xl hover:shadow-[#00D9F5]/30 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9F5]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Transmitting Request...</span>
              </>
            ) : (
              <>
                <span>Submit Consultation Request</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
