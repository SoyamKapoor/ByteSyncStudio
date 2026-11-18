import nodemailer, { Transporter } from 'nodemailer';
import { ConsultationBooking } from '../../types/index.js';
import dotenv from 'dotenv';

export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
  warning?: string;
  sentTo?: string;
}

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  from?: string;
}

const reloadEnv = () => {
  try {
    dotenv.config({ override: true });
  } catch (e) {
    // ignore
  }
};

export const getGmailUser = (): string => {
  reloadEnv();
  return process.env.GMAIL_USER || process.env.BUSINESS_NOTIFICATION_EMAIL || '';
};

export const getGmailAppPassword = (): string => {
  reloadEnv();
  // Strip spaces if user copied "abcd efgh ijkl mnop" format from Google
  const pass = process.env.GMAIL_APP_PASSWORD || '';
  return pass.replace(/\s+/g, '');
};

export const getEmailFrom = (): string => {
  reloadEnv();
  const user = getGmailUser();
  if (process.env.EMAIL_FROM && !process.env.EMAIL_FROM.includes('resend.dev')) {
    return process.env.EMAIL_FROM;
  }
  return user ? `ByteSync Studio <${user}>` : 'ByteSync Studio <contact.bytesyncstudio@gmail.com>';
};

export const getBusinessEmail = (): string => {
  reloadEnv();
  return process.env.BUSINESS_NOTIFICATION_EMAIL || getGmailUser() || 'contact.bytesyncstudio@gmail.com';
};

/**
 * Checks whether Gmail SMTP is configured with non-placeholder credentials
 */
export const isEmailServiceConfigured = (): boolean => {
  const user = getGmailUser();
  const pass = getGmailAppPassword();
  const isPlaceholder =
    !pass ||
    pass.toLowerCase().includes('placeholder') ||
    pass.toLowerCase().includes('your_16') ||
    pass.toLowerCase().includes('your-16') ||
    pass.toLowerCase().includes('app_password') ||
    pass.toLowerCase().includes('password_here');

  return Boolean(
    user &&
      pass &&
      !isPlaceholder &&
      user.includes('@') &&
      !user.includes('your-email') &&
      pass.trim().length >= 16
  );
};

/**
 * Creates and returns a Nodemailer transporter configured for Gmail SMTP
 */
export const getTransporter = (): Transporter | null => {
  if (!isEmailServiceConfigured()) {
    return null;
  }

  const user = getGmailUser();
  const pass = getGmailAppPassword();
  const port = Number(process.env.SMTP_PORT || 465);
  const secure = process.env.SMTP_SECURE !== undefined ? process.env.SMTP_SECURE === 'true' : port === 465;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port,
    secure, // true for port 465, false for 587
    auth: {
      user,
      pass,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
};

/**
 * Verifies the Gmail SMTP connection via transporter.verify()
 */
export async function verifySmtpConnection(): Promise<{ success: boolean; message: string }> {
  if (!isEmailServiceConfigured()) {
    const user = getGmailUser();
    const pass = getGmailAppPassword();
    return {
      success: false,
      message: `Gmail SMTP is not configured. (GMAIL_USER="${user || 'NOT SET'}", GMAIL_APP_PASSWORD="${pass ? '[HIDDEN - LENGTH ' + pass.length + ']' : 'NOT SET'}"). System will operate in mock email mode.`,
    };
  }

  const transporter = getTransporter();
  if (!transporter) {
    return {
      success: false,
      message: 'Failed to initialize Nodemailer Gmail transporter.',
    };
  }

  try {
    await transporter.verify();
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = process.env.SMTP_PORT || '465';
    const successMsg = `[Gmail SMTP] Connection verified successfully with ${host}:${port} as ${getGmailUser()}`;
    return {
      success: true,
      message: successMsg,
    };
  } catch (error: any) {
    const errorMsg = error?.message || String(error);
    return {
      success: false,
      message: `Gmail SMTP verification failed: ${errorMsg}`,
    };
  }
}

/**
 * Core reusable sendEmail helper function
 * Sends an email using Nodemailer with Gmail SMTP
 */
export async function sendEmail(options: SendEmailOptions): Promise<EmailSendResult> {
  const recipients = Array.isArray(options.to) ? options.to.join(', ') : options.to;

  if (!isEmailServiceConfigured()) {
    console.log(
      `[Email Service: Mock Mode] Email would be sent to: ${recipients} | Subject: "${options.subject}"`
    );
    return {
      success: true,
      messageId: `mock-msg-${Date.now()}`,
      sentTo: recipients,
    };
  }

  const transporter = getTransporter();
  if (!transporter) {
    const errorMsg = 'SMTP Transporter unavailable. Please check GMAIL_USER and GMAIL_APP_PASSWORD in .env';
    console.error(`[Email Error] ${errorMsg}`);
    return {
      success: false,
      error: errorMsg,
      sentTo: recipients,
    };
  }

  const from = options.from || getEmailFrom();
  const replyTo = options.replyTo || getBusinessEmail();

  try {
    const info = await transporter.sendMail({
      from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo,
    });

    console.log(`[Email Success] Email sent to ${recipients}. Message ID: ${info.messageId}`);
    return {
      success: true,
      messageId: info.messageId,
      sentTo: recipients,
    };
  } catch (error: any) {
    const errorMsg = error?.message || String(error);
    console.error(`[Email Error] Failed to send email to ${recipients}:`, errorMsg);
    return {
      success: false,
      error: errorMsg,
      sentTo: recipients,
    };
  }
}

/**
 * Sanitizes and escapes untrusted strings for safe interpolation into HTML email templates.
 * Neutralizes HTML injection, attribute injection, and script execution across email clients.
 */
export function escapeHtml(value: string | undefined | null): string {
  if (!value) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Builds Google Calendar render intent link
 */
function buildGoogleCalendarLink(booking: ConsultationBooking): string {
  const title = encodeURIComponent(`ByteSync Studio Consultation · ${booking.service}`);
  const details = encodeURIComponent(
    `Technical consultation with ByteSync Studio.\nReference: #${booking.id}\nService: ${booking.service}\nScheduled Slot: ${booking.preferredTime || 'TBD'}`
  );
  const dateFormatted = (booking.preferredDate || '').replace(/-/g, '');
  const dates = dateFormatted ? `&dates=${dateFormatted}/${dateFormatted}` : '';
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}${dates}`;
}

/**
 * Generates the HTML body for the customer's consultation acknowledgement email
 */
function buildCustomerAcknowledgementHtml(
  booking: ConsultationBooking,
  businessEmail: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #050B14; color: #F4F7FB; padding: 24px; margin: 0; }
        .container { max-width: 600px; margin: 0 auto; background: #0D1928; border: 1px solid rgba(100, 160, 220, 0.25); border-radius: 12px; padding: 32px; box-shadow: 0 12px 36px rgba(0,0,0,0.4); }
        .header { border-bottom: 1px solid rgba(100, 160, 220, 0.2); padding-bottom: 20px; margin-bottom: 24px; }
        .brand { font-size: 22px; font-weight: 800; color: #00D9F5; letter-spacing: -0.5px; }
        .tagline { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #A8B5C7; margin-top: 4px; }
        .title { font-size: 19px; font-weight: 700; color: #F4F7FB; margin-top: 18px; margin-bottom: 8px; }
        .badge-pending { display: inline-block; padding: 4px 10px; background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.4); border-radius: 6px; color: #FBBF24; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 16px; }
        .notice-box { background: rgba(8, 123, 255, 0.08); border-left: 3px solid #00D9F5; padding: 14px 18px; margin: 20px 0; border-radius: 4px; font-size: 14px; line-height: 1.6; color: #E2E8F0; }
        .details { background: #091321; border: 1px solid rgba(100, 160, 220, 0.15); border-radius: 8px; padding: 18px 20px; margin: 22px 0; font-size: 13.5px; }
        .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid rgba(100, 160, 220, 0.06); padding-bottom: 8px; }
        .detail-row:last-child { margin-bottom: 0; border-bottom: none; padding-bottom: 0; }
        .detail-label { color: #A8B5C7; }
        .detail-value { color: #F4F7FB; font-weight: 600; text-align: right; }
        .footer { font-size: 12px; color: #7E92A9; margin-top: 32px; border-top: 1px solid rgba(100, 160, 220, 0.15); padding-top: 18px; text-align: center; line-height: 1.6; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="brand">ByteSync Studio</div>
          <div class="tagline">Intelligent Systems · Built to Scale</div>
        </div>
        
        <span class="badge-pending">Status: Under Review</span>
        <div class="title">Consultation Request Received</div>
        <p style="font-size: 14.5px; color: #E2E8F0; line-height: 1.6;">Dear ${escapeHtml(booking.fullName)},</p>
        <div class="notice-box">
          Thank you for reaching out. We have logged your consultation inquiry. Our engineering leadership is reviewing your architecture and project requirements and will contact you shortly to confirm the scheduled session.
        </div>
        
        <div class="details">
          <div class="detail-row"><span class="detail-label">Reference ID:</span> <span class="detail-value" style="color: #00D9F5; font-family: monospace;">#${escapeHtml(booking.id)}</span></div>
          <div class="detail-row"><span class="detail-label">Client Email:</span> <span class="detail-value">${escapeHtml(booking.email)}</span></div>
          <div class="detail-row"><span class="detail-label">Requested Service:</span> <span class="detail-value">${escapeHtml(booking.service)}</span></div>
          <div class="detail-row"><span class="detail-label">Industry:</span> <span class="detail-value">${escapeHtml(booking.industry)}</span></div>
          <div class="detail-row"><span class="detail-label">Session Type:</span> <span class="detail-value">${escapeHtml(booking.consultationType)}</span></div>
          ${booking.preferredDate ? `<div class="detail-row"><span class="detail-label">Requested Date:</span> <span class="detail-value">${escapeHtml(booking.preferredDate)}</span></div>` : ''}
          ${booking.preferredTime ? `<div class="detail-row"><span class="detail-label">Requested Time:</span> <span class="detail-value">${escapeHtml(booking.preferredTime)}</span></div>` : ''}
        </div>

        <p style="font-size: 13.5px; color: #A8B5C7; line-height: 1.6;">
          Need to share preparatory documentation, wireframes, or API specifications beforehand? Simply reply directly to this email.
        </p>

        <div class="footer">
          ByteSync Studio · Executive Consultation Division<br>
          Direct contact: ${escapeHtml(businessEmail)}
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generates the HTML body for the client's confirmed appointment email
 */
function buildAppointmentConfirmationHtml(
  booking: ConsultationBooking,
  businessEmail: string,
  meetingNotes?: string
): string {
  const calendarLink = buildGoogleCalendarLink(booking);
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #050B14; color: #F4F7FB; padding: 24px; margin: 0; }
        .container { max-width: 600px; margin: 0 auto; background: #0D1928; border: 1px solid rgba(100, 160, 220, 0.25); border-radius: 12px; padding: 32px; box-shadow: 0 12px 36px rgba(0,0,0,0.4); }
        .header { border-bottom: 1px solid rgba(100, 160, 220, 0.2); padding-bottom: 20px; margin-bottom: 24px; }
        .brand { font-size: 22px; font-weight: 800; color: #00D9F5; letter-spacing: -0.5px; }
        .tagline { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #A8B5C7; margin-top: 4px; }
        .badge-confirmed { display: inline-block; padding: 5px 12px; background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 6px; color: #34D399; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; }
        .title { font-size: 20px; font-weight: 700; color: #F4F7FB; margin-top: 12px; margin-bottom: 8px; }
        .hero-box { background: rgba(16, 185, 129, 0.08); border-left: 3px solid #10B981; padding: 16px 18px; margin: 20px 0; border-radius: 4px; font-size: 14.5px; line-height: 1.6; color: #E2E8F0; }
        .details { background: #091321; border: 1px solid rgba(100, 160, 220, 0.15); border-radius: 8px; padding: 18px 20px; margin: 22px 0; font-size: 13.5px; }
        .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid rgba(100, 160, 220, 0.06); padding-bottom: 8px; }
        .detail-row:last-child { margin-bottom: 0; border-bottom: none; padding-bottom: 0; }
        .detail-label { color: #A8B5C7; }
        .detail-value { color: #F4F7FB; font-weight: 600; text-align: right; }
        .notes-box { background: #06101D; border: 1px solid rgba(0, 217, 245, 0.3); border-radius: 8px; padding: 18px 20px; margin: 22px 0; }
        .notes-title { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #00D9F5; margin-bottom: 8px; }
        .notes-content { font-size: 13.5px; line-height: 1.6; color: #F4F7FB; white-space: pre-wrap; word-break: break-word; }
        .btn-calendar { display: inline-block; background: linear-gradient(135deg, #087BFF, #00D9F5); color: #FFFFFF !important; font-size: 13px; font-weight: 600; text-decoration: none; padding: 12px 24px; border-radius: 6px; text-align: center; margin: 16px 0; }
        .footer { font-size: 12px; color: #7E92A9; margin-top: 32px; border-top: 1px solid rgba(100, 160, 220, 0.15); padding-top: 18px; text-align: center; line-height: 1.6; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="brand">ByteSync Studio</div>
          <div class="tagline">Intelligent Systems · Built to Scale</div>
        </div>

        <span class="badge-confirmed">✓ Appointment Confirmed</span>
        <div class="title">Your Technical Consultation is Confirmed</div>
        <p style="font-size: 14.5px; color: #E2E8F0; line-height: 1.6;">Dear ${escapeHtml(booking.fullName)},</p>
        <div class="hero-box">
          We are pleased to inform you that your consultation session has been approved and confirmed on our engineering schedule.
        </div>

        <div class="details">
          <div class="detail-row"><span class="detail-label">Reference ID:</span> <span class="detail-value" style="color: #00D9F5; font-family: monospace;">#${escapeHtml(booking.id)}</span></div>
          <div class="detail-row"><span class="detail-label">Client Email:</span> <span class="detail-value">${escapeHtml(booking.email)}</span></div>
          <div class="detail-row"><span class="detail-label">Confirmed Service:</span> <span class="detail-value">${escapeHtml(booking.service)}</span></div>
          <div class="detail-row"><span class="detail-label">Target Industry:</span> <span class="detail-value">${escapeHtml(booking.industry)}</span></div>
          <div class="detail-row"><span class="detail-label">Scheduled Date:</span> <span class="detail-value" style="color: #34D399;">${escapeHtml(booking.preferredDate || 'As coordinated')}</span></div>
          <div class="detail-row"><span class="detail-label">Scheduled Time Window:</span> <span class="detail-value" style="color: #34D399;">${escapeHtml(booking.preferredTime || 'As coordinated')}</span></div>
          <div class="detail-row"><span class="detail-label">Consultation Format:</span> <span class="detail-value">${escapeHtml(booking.consultationType)}</span></div>
        </div>

        ${
          meetingNotes
            ? `
        <div class="notes-box">
          <div class="notes-title">Meeting Access & Instructions</div>
          <div class="notes-content">${escapeHtml(meetingNotes)}</div>
        </div>
        `
            : ''
        }

        <div style="text-align: center; margin: 24px 0;">
          <a href="${calendarLink}" target="_blank" class="btn-calendar">
            📅 Add to Google Calendar
          </a>
        </div>

        <p style="font-size: 13.5px; color: #A8B5C7; line-height: 1.6;">
          If you have any questions, need to invite additional team members, or need to reschedule, reply directly to this email and an engineering lead will assist you.
        </p>

        <div class="footer">
          ByteSync Studio · Executive Consultation Division<br>
          Intelligent systems. Built to scale.
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Builds HTML for internal lead alert notification
 */
function buildAdminLeadAlertHtml(booking: ConsultationBooking): string {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 24px; color: #1e293b; background: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px;">
        <span style="display:inline-block;padding:4px 10px;background:#eff6ff;border:1px solid #bfdbfe;color:#2563eb;border-radius:6px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;">New Lead Alert</span>
        <h2 style="color: #087bff; margin-top: 10px; margin-bottom: 16px;">New Consultation Request Received</h2>
        <p><strong>Reference ID:</strong> #${escapeHtml(booking.id)}</p>
        <p><strong>Client Name:</strong> ${escapeHtml(booking.fullName)}</p>
        <p><strong>Client Email:</strong> <a href="mailto:${encodeURIComponent(booking.email)}">${escapeHtml(booking.email)}</a></p>
        <p><strong>Company:</strong> ${escapeHtml(booking.companyName || 'Not specified')}</p>
        <p><strong>Service:</strong> ${escapeHtml(booking.service)}</p>
        <p><strong>Industry:</strong> ${escapeHtml(booking.industry)}</p>
        <p><strong>Type:</strong> ${escapeHtml(booking.consultationType)}</p>
        <p><strong>Project Budget:</strong> ${escapeHtml(booking.projectBudget || 'Not specified')}</p>
        <p><strong>Preferred Slot:</strong> ${escapeHtml(booking.preferredDate || 'Flexible')} ${escapeHtml(booking.preferredTime || '')}</p>
        <p><strong>Project Description:</strong></p>
        <div style="background:#f1f5f9;padding:14px;border-left:4px solid #087bff;border-radius:4px;white-space:pre-wrap;margin-bottom:20px;">${escapeHtml(booking.projectDescription)}</div>
        <p style="margin-top: 24px; font-size: 13px; color: #64748b; border-top:1px solid #e2e8f0; padding-top:14px;">
          Review, approve, and confirm this consultation in the Executive Dashboard: <strong><a href="/admin">ByteSync Admin</a></strong>
        </p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Builds HTML for internal confirmation record notification
 */
function buildAdminConfirmationRecordHtml(
  booking: ConsultationBooking,
  meetingNotes?: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 24px; color: #1e293b; background: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px;">
        <span style="display:inline-block;padding:4px 10px;background:#ecfdf5;border:1px solid #a7f3d0;color:#059669;border-radius:6px;font-size:12px;font-weight:700;text-transform:uppercase;">Confirmed Appointment Record</span>
        <h2 style="color: #0f172a; margin-top: 12px; margin-bottom: 8px;">Consultation Confirmed: ${escapeHtml(booking.fullName)}</h2>
        <p style="color: #475569;">The appointment confirmation was dispatched to the client at <strong>${escapeHtml(booking.email)}</strong>.</p>
        
        <div style="background:#f1f5f9;border-left:4px solid #10b981;border-radius:4px;padding:14px;margin:18px 0;font-size:14px;line-height:1.6;">
          <p style="margin:4px 0;"><strong>Reference ID:</strong> #${escapeHtml(booking.id)}</p>
          <p style="margin:4px 0;"><strong>Client Name:</strong> ${escapeHtml(booking.fullName)}</p>
          <p style="margin:4px 0;"><strong>Client Email:</strong> <a href="mailto:${encodeURIComponent(booking.email)}">${escapeHtml(booking.email)}</a></p>
          <p style="margin:4px 0;"><strong>Service:</strong> ${escapeHtml(booking.service)}</p>
          <p style="margin:4px 0;"><strong>Industry:</strong> ${escapeHtml(booking.industry)}</p>
          <p style="margin:4px 0;"><strong>Scheduled Date:</strong> ${escapeHtml(booking.preferredDate || 'As coordinated')}</p>
          <p style="margin:4px 0;"><strong>Scheduled Time Window:</strong> ${escapeHtml(booking.preferredTime || 'As coordinated')}</p>
          <p style="margin:4px 0;"><strong>Format:</strong> ${escapeHtml(booking.consultationType)}</p>
          ${
            meetingNotes
              ? `<p style="margin:8px 0 4px 0;"><strong>Meeting Notes Sent:</strong><br><span style="white-space:pre-wrap;color:#334155;background:#ffffff;padding:8px 12px;display:block;border-radius:4px;border:1px solid #e2e8f0;margin-top:4px;">${escapeHtml(meetingNotes)}</span></p>`
              : ''
          }
        </div>

        <p style="font-size: 13px; color: #64748b; margin-top: 24px; border-top:1px solid #e2e8f0; padding-top:14px;">
          View this session in the Executive Console: <a href="/admin">ByteSync Admin Dashboard</a>
        </p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Sends initial notification emails upon booking submission:
 * - Customer receives confirmation of receipt directly at booking.email
 * - Internal business email receives the [New Lead Alert]
 */
export async function sendConsultationNotificationEmails(
  booking: ConsultationBooking
): Promise<{ customerEmailResult: EmailSendResult; adminEmailResult: EmailSendResult }> {
  const businessEmail = getBusinessEmail();
  const customerSubject = `Consultation Request Received [Ref: #${booking.id.slice(0, 8)}] — ByteSync Studio`;

  // 1. Dispatch directly to the customer's email address
  const customerEmailResult = await sendEmail({
    to: booking.email,
    subject: customerSubject,
    html: buildCustomerAcknowledgementHtml(booking, businessEmail),
  });

  // 2. Dispatch inquiry notification to internal business lead inbox
  let adminEmailResult: EmailSendResult = { success: true };
  if (businessEmail) {
    adminEmailResult = await sendEmail({
      to: businessEmail,
      subject: `[New Lead Alert] ${booking.fullName} — ${booking.service}`,
      html: buildAdminLeadAlertHtml(booking),
    });
  }

  return {
    customerEmailResult,
    adminEmailResult,
  };
}

/**
 * Sends Appointment Confirmation Email:
 * - Directly delivered to the booking person (booking.email)
 * - Also dispatches a confirmation copy to the internal business inbox (businessEmail) so both parties have the record
 */
export async function sendAppointmentConfirmationEmail(
  booking: ConsultationBooking,
  meetingNotes?: string
): Promise<EmailSendResult> {
  const businessEmail = getBusinessEmail();
  const confirmationSubject = `Appointment Confirmed: Discovery Consultation — ByteSync Studio [Ref: #${booking.id.slice(0, 8)}]`;

  // 1. Send confirmation directly to customer's email
  const clientResult = await sendEmail({
    to: booking.email,
    subject: confirmationSubject,
    html: buildAppointmentConfirmationHtml(booking, businessEmail, meetingNotes),
  });

  // 2. Also send confirmed appointment record to businessEmail so administrator retains record
  if (businessEmail && businessEmail.toLowerCase() !== booking.email.toLowerCase()) {
    try {
      await sendEmail({
        to: businessEmail,
        subject: `[Confirmed Appointment Record] ${booking.fullName} — ${booking.service} [Ref: #${booking.id.slice(0, 8)}]`,
        html: buildAdminConfirmationRecordHtml(booking, meetingNotes),
      });
    } catch (adminErr) {
      console.warn('[Admin Confirmation Copy Warning]', adminErr);
    }
  }

  return clientResult;
}
