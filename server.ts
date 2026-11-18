import express, { Request, Response } from 'express';
import http from 'http';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { consultationSchema } from './src/lib/validation/consultation.js';
import { ConsultationBooking } from './src/types/index.js';
import {
  sendConsultationNotificationEmails,
  sendAppointmentConfirmationEmail,
  verifySmtpConnection,
} from './src/lib/email/mailer.js';
import { getServerSupabaseClient } from './src/lib/supabase/server.js';

dotenv.config();

// =============================================================
// PRE-LIVE PRODUCTION SECURITY GUARDRAILS
// =============================================================
if (process.env.NODE_ENV === 'production') {
  if (!process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD === 'bytesync2026') {
    console.error(
      '❌ [FATAL PRE-LIVE SECURITY ERROR]: ADMIN_PASSWORD must be explicitly configured in production environment variables and cannot use the default placeholder. Server startup halted.'
    );
    process.exit(1);
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security: Disable Express fingerprinting
app.disable('x-powered-by');

// Security: Restrict JSON payload size to prevent body-parser Denial-of-Service
app.use(express.json({ limit: '50kb' }));

// =============================================================
// MANDATORY SECURITY HEADERS & HTTPS REDIRECTION
// =============================================================
app.use((req: Request, res: Response, next) => {
  // Prevent MIME-type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // Prevent Clickjacking (framing)
  res.setHeader('X-Frame-Options', 'DENY');
  // Legacy XSS Auditor protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  // Privacy-preserving referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  // Restrict sensitive browser APIs
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');

  // Content Security Policy (CSP)
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co ws: wss:",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "base-uri 'self'",
    "object-src 'none'",
  ].join('; ');
  res.setHeader('Content-Security-Policy', csp);

  // Production HSTS & HTTPS Enforcement
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');

    const proto = req.headers['x-forwarded-proto'];
    if (proto && proto !== 'https') {
      return res.redirect(301, `https://${req.headers.host}${req.url}`);
    }
  }

  next();
});

// =============================================================
// SLIDING-WINDOW IN-MEMORY RATE LIMITING
// =============================================================
interface RateLimitRecord {
  count: number;
  resetTime: number;
}

function createRateLimiter(options: { windowMs: number; max: number; message: string }) {
  const store = new Map<string, RateLimitRecord>();

  // Cleanup expired rate records every 60 seconds
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of store.entries()) {
      if (now > record.resetTime) {
        store.delete(key);
      }
    }
  }, 60000).unref();

  return (req: Request, res: Response, next: () => void) => {
    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
      req.socket.remoteAddress ||
      'unknown';
    const now = Date.now();
    const record = store.get(ip);

    if (!record || now > record.resetTime) {
      store.set(ip, { count: 1, resetTime: now + options.windowMs });
      return next();
    }

    if (record.count >= options.max) {
      const retryAfterSeconds = Math.ceil((record.resetTime - now) / 1000);
      res.setHeader('Retry-After', retryAfterSeconds);
      return res.status(429).json({
        success: false,
        error: options.message,
        retryAfter: retryAfterSeconds,
      });
    }

    record.count++;
    next();
  };
}

const consultationRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 5, // max 5 submissions per 15 min per IP to prevent spam & email bombing
  message: 'Too many consultation requests from this network. Please wait 15 minutes before submitting again.',
});

const adminLoginRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 5, // max 5 failed attempts per 15 min per IP to prevent brute-force attacks
  message: 'Too many login attempts. Access temporarily locked for 15 minutes.',
});

// Timing-safe string comparison to prevent side-channel timing attacks
function timingSafeCompare(a: string, b: string): boolean {
  const hashA = crypto.createHash('sha256').update(a).digest();
  const hashB = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

// In-memory active administrator sessions registry with expiration and role checking
interface AdminSession {
  token: string;
  email: string;
  role: 'administrator';
  createdAt: number;
  expiresAt: number;
}
const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours session lifetime
const activeAdminSessions = new Map<string, AdminSession>();

// Local in-memory persistent store fallback if Supabase is unconfigured
const localBookings: ConsultationBooking[] = [
  {
    id: 'a0000000-0000-4000-8000-000000000101',
    fullName: 'Alexander Vance',
    email: 'a.vance@vancerealty.com',
    companyName: 'Vance Luxury Properties',
    industry: 'Real Estate',
    service: 'AI & Machine Learning',
    projectDescription:
      'We require an automated inquiry triage and lead scoring pipeline to qualify prospective high-net-worth buyers from multiple real estate listing portals.',
    projectBudget: '$15,000 - $50,000',
    consultationType: 'Free Discovery Call',
    preferredDate: '2026-10-28',
    preferredTime: '2:00 PM EST',
    bookingStatus: 'pending_review',
    paymentStatus: 'not_required',
    internalNotes: 'Qualified lead. Follow up with case study on real estate portal intake.',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'a0000000-0000-4000-8000-000000000102',
    fullName: 'Dr. Sarah Chen, MD',
    email: 'dr.chen@auroraclinic.org',
    companyName: 'Aurora Specialty Clinic',
    industry: 'Healthcare & Clinics',
    service: 'Custom Web Development',
    projectDescription:
      'Looking to modernize patient intake scheduling with encrypted symptom forms and automated calendar synchronization for three specialized practitioners.',
    projectBudget: '$5,000 - $15,000',
    consultationType: 'Free Discovery Call',
    preferredDate: '2026-10-30',
    preferredTime: '10:30 AM EST',
    bookingStatus: 'confirmed',
    confirmedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    paymentStatus: 'not_required',
    internalNotes: 'Confirmed video link dispatched via Google Meet.',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
];

// Helper to generate RFC-compliant UUID for PostgreSQL UUID primary key compatibility
function generateId(): string {
  return crypto.randomUUID();
}

// -------------------------------------------------------------
// API: Consultation Submission (Public endpoint with rate limiting)
// -------------------------------------------------------------
app.post('/api/consultations', consultationRateLimiter, async (req: Request, res: Response) => {
  try {
    const parseResult = consultationSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: parseResult.error.flatten().fieldErrors,
      });
    }

    const data = parseResult.data;

    // Check honeypot spam filter
    if (data.website_hp && data.website_hp.length > 0) {
      return res.status(400).json({ success: false, error: 'Spam detected' });
    }

    const booking: ConsultationBooking = {
      id: generateId(),
      fullName: data.fullName,
      email: data.email,
      companyName: data.companyName || undefined,
      industry: data.industry,
      service: data.service,
      projectDescription: data.projectDescription,
      projectBudget: data.projectBudget || undefined,
      consultationType: data.consultationType,
      preferredDate: data.preferredDate || undefined,
      preferredTime: data.preferredTime || undefined,
      bookingStatus: 'pending_review',
      paymentStatus: 'not_required',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 1. Try Supabase if configured
    const supabase = getServerSupabaseClient();
    if (supabase) {
      const { error: dbError } = await supabase.from('consultations').insert({
        id: booking.id,
        full_name: booking.fullName,
        email: booking.email,
        company_name: booking.companyName,
        industry: booking.industry,
        service: booking.service,
        project_description: booking.projectDescription,
        project_budget: booking.projectBudget,
        consultation_type: booking.consultationType,
        preferred_date: booking.preferredDate,
        preferred_time: booking.preferredTime,
        booking_status: booking.bookingStatus,
        payment_status: booking.paymentStatus,
        created_at: booking.createdAt,
        updated_at: booking.updatedAt,
      });

      if (dbError) {
        console.error('[Supabase Insert Error]', dbError);
        // Fallback to local store so booking is never lost
        localBookings.unshift(booking);
      } else {
        console.log('[Supabase Insert Success] Booking saved to PostgreSQL:', booking.id);
      }
    } else {
      localBookings.unshift(booking);
    }

    // 2. Dispatch transactional emails safely
    try {
      await sendConsultationNotificationEmails(booking);
    } catch (emailErr) {
      console.warn('[Email Notification Dispatch Warning]', emailErr);
    }

    return res.status(201).json({
      success: true,
      bookingId: booking.id,
      booking,
      message: 'Consultation request received successfully.',
    });
  } catch (err) {
    console.error('[Consultation API Error]', err);
    return res.status(500).json({
      success: false,
      error: 'An internal error occurred processing your consultation request.',
    });
  }
});

// -------------------------------------------------------------
// API: Admin Authentication & Management
// -------------------------------------------------------------
async function verifyAdminAuth(req: Request, res: Response, next: () => void) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Missing or malformed authentication token',
    });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Missing session token',
    });
  }

  // 1. Check in-memory cryptographically issued session tokens
  const session = activeAdminSessions.get(token);
  if (session) {
    if (Date.now() > session.expiresAt) {
      activeAdminSessions.delete(token);
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Session has expired. Please log in again.',
      });
    }

    // Role-based authorization verification
    if (session.role !== 'administrator') {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: Insufficient administrative privileges.',
      });
    }

    (req as any).adminUser = { email: session.email, role: session.role };
    return next();
  }

  // 2. Check Supabase Auth JWT token if configured
  const supabase = getServerSupabaseClient();
  if (supabase) {
    try {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (error || !user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized: Invalid or expired administrator credentials.',
        });
      }

      // Explicit Administrator Authorization Enforcement:
      // Authenticated non-administrators MUST NOT access admin functionality
      const adminEmail = process.env.ADMIN_USERNAME || 'admin@bytesyncstudio.com';
      const isConfiguredAdmin = user.email && user.email.toLowerCase() === adminEmail.toLowerCase();
      const hasAdminAppRole =
        user.app_metadata?.role === 'admin' ||
        user.app_metadata?.role === 'administrator';

      let isDbAdmin = false;
      if (!isConfiguredAdmin && !hasAdminAppRole) {
        const { data: adminRecord } = await supabase
          .from('admin_users')
          .select('id, role')
          .eq('id', user.id)
          .single();
        if (adminRecord && (adminRecord.role === 'admin' || adminRecord.role === 'superadmin')) {
          isDbAdmin = true;
        }
      }

      if (!isConfiguredAdmin && !hasAdminAppRole && !isDbAdmin) {
        return res.status(403).json({
          success: false,
          error: 'Forbidden: Authenticated account does not possess administrator privileges.',
        });
      }

      (req as any).adminUser = { email: user.email || adminEmail, role: 'administrator' };
      return next();
    } catch (err) {
      console.error('[Supabase Auth Verification Error]', err);
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Could not verify authorization credentials.',
      });
    }
  }

  return res.status(401).json({
    success: false,
    error: 'Unauthorized: Invalid or expired session. Please log in.',
  });
}

// GET /api/admin/verify (Protected server-side verification check)
app.get('/api/admin/verify', verifyAdminAuth, (req: Request, res: Response) => {
  const adminUser = (req as any).adminUser || {
    email: process.env.ADMIN_USERNAME || 'admin@bytesyncstudio.com',
    role: 'administrator',
  };
  return res.json({
    success: true,
    authenticated: true,
    user: adminUser,
  });
});

app.post('/api/admin/login', adminLoginRateLimiter, (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ success: false, error: 'Email and password are required.' });
  }

  // Load configured administrator credentials from server environment
  const expectedUser = (process.env.ADMIN_USERNAME || 'admin@bytesyncstudio.com').trim().toLowerCase();
  const expectedPass = process.env.ADMIN_PASSWORD || 'bytesync2026';

  const userMatches = timingSafeCompare(username.trim().toLowerCase(), expectedUser);
  const passMatches = timingSafeCompare(password, expectedPass);

  if (userMatches && passMatches) {
    // Generate an unguessable cryptographic session token
    const token = 'bs_' + crypto.randomBytes(32).toString('hex');
    const session: AdminSession = {
      token,
      email: username.trim(),
      role: 'administrator',
      createdAt: Date.now(),
      expiresAt: Date.now() + SESSION_TTL_MS,
    };
    activeAdminSessions.set(token, session);

    return res.json({
      success: true,
      token,
      user: { email: session.email, role: session.role },
      expiresAt: session.expiresAt,
    });
  }

  return res.status(401).json({ success: false, error: 'Invalid administrator credentials.' });
});

app.post('/api/admin/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    activeAdminSessions.delete(token);
  }
  return res.json({ success: true, message: 'Administrator session terminated.' });
});

// GET /api/admin/consultations (Protected)
app.get('/api/admin/consultations', verifyAdminAuth, async (req: Request, res: Response) => {
  const { search, status, industry, service } = req.query;

  const supabase = getServerSupabaseClient();
  let bookings = [...localBookings];

  if (supabase) {
    const { data, error } = await supabase
      .from('consultations')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      bookings = data.map((d) => ({
        id: d.id,
        fullName: d.full_name,
        email: d.email,
        companyName: d.company_name,
        industry: d.industry,
        service: d.service,
        projectDescription: d.project_description,
        projectBudget: d.project_budget,
        consultationType: d.consultation_type,
        preferredDate: d.preferred_date,
        preferredTime: d.preferred_time,
        confirmedAt: d.confirmed_at,
        bookingStatus: d.booking_status,
        paymentStatus: d.payment_status,
        internalNotes: d.internal_notes,
        createdAt: d.created_at,
        updatedAt: d.updated_at,
      }));
    }
  }

  // Apply filters
  let filtered = bookings;
  if (status && status !== 'all') {
    filtered = filtered.filter((b) => b.bookingStatus === status);
  }
  if (industry && industry !== 'all') {
    filtered = filtered.filter((b) => b.industry === industry);
  }
  if (service && service !== 'all') {
    filtered = filtered.filter((b) => b.service === service);
  }
  if (search && typeof search === 'string' && search.trim().length > 0) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (b) =>
        b.fullName.toLowerCase().includes(q) ||
        b.email.toLowerCase().includes(q) ||
        (b.companyName && b.companyName.toLowerCase().includes(q)) ||
        b.id.toLowerCase().includes(q)
    );
  }

  return res.json({ success: true, count: filtered.length, data: filtered });
});

// PATCH /api/admin/consultations/:id (Protected)
app.patch('/api/admin/consultations/:id', verifyAdminAuth, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { bookingStatus, paymentStatus, internalNotes, confirmedAt, sendConfirmation = true } = req.body;

  let targetBooking: ConsultationBooking | undefined = localBookings.find((b) => b.id === id);

  const supabase = getServerSupabaseClient();
  if (supabase) {
    if (!targetBooking) {
      const { data } = await supabase.from('consultations').select('*').eq('id', id).single();
      if (data) {
        targetBooking = {
          id: data.id,
          fullName: data.full_name,
          email: data.email,
          companyName: data.company_name,
          industry: data.industry,
          service: data.service,
          projectDescription: data.project_description,
          projectBudget: data.project_budget,
          consultationType: data.consultation_type,
          preferredDate: data.preferred_date,
          preferredTime: data.preferred_time,
          confirmedAt: data.confirmed_at,
          bookingStatus: data.booking_status,
          paymentStatus: data.payment_status,
          internalNotes: data.internal_notes,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
      }
    }

    await supabase
      .from('consultations')
      .update({
        ...(bookingStatus && { booking_status: bookingStatus }),
        ...(paymentStatus && { payment_status: paymentStatus }),
        ...(internalNotes !== undefined && { internal_notes: internalNotes }),
        ...(confirmedAt !== undefined && { confirmed_at: confirmedAt }),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);
  }

  const localIndex = localBookings.findIndex((b) => b.id === id);
  if (localIndex !== -1) {
    localBookings[localIndex] = {
      ...localBookings[localIndex],
      ...(bookingStatus && { bookingStatus }),
      ...(paymentStatus && { paymentStatus }),
      ...(internalNotes !== undefined && { internalNotes }),
      ...(confirmedAt !== undefined && { confirmedAt }),
      updatedAt: new Date().toISOString(),
    };
    targetBooking = localBookings[localIndex];
  } else if (targetBooking) {
    targetBooking = {
      ...targetBooking,
      ...(bookingStatus && { bookingStatus }),
      ...(paymentStatus && { paymentStatus }),
      ...(internalNotes !== undefined && { internalNotes }),
      ...(confirmedAt !== undefined && { confirmedAt }),
      updatedAt: new Date().toISOString(),
    };
  }

  let emailDispatched = false;
  let emailError: string | undefined;
  let emailWarning: string | undefined;

  // Send confirmation email when appointment is confirmed
  if (targetBooking && bookingStatus === 'confirmed' && sendConfirmation !== false) {
    try {
      const emailResult = await sendAppointmentConfirmationEmail(targetBooking, internalNotes);
      emailDispatched = emailResult.success;
      emailError = emailResult.error;
      emailWarning = emailResult.warning;
    } catch (err) {
      console.error('[Appointment Confirmation Email Dispatch Error]', err);
      emailError = String(err);
    }
  }

  return res.json({
    success: true,
    data: targetBooking,
    emailDispatched,
    emailError,
    emailWarning,
    message: emailDispatched
      ? emailWarning
        ? `Appointment confirmed. ${emailWarning}`
        : `Appointment confirmed. Confirmation email sent to ${targetBooking?.email}`
      : 'Consultation record updated.',
  });
});

// POST /api/admin/consultations/:id/send-confirmation (Protected)
app.post(
  '/api/admin/consultations/:id/send-confirmation',
  verifyAdminAuth,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { meetingNotes } = req.body;

    let targetBooking: ConsultationBooking | undefined = localBookings.find((b) => b.id === id);

    const supabase = getServerSupabaseClient();
    if (!targetBooking && supabase) {
      const { data } = await supabase.from('consultations').select('*').eq('id', id).single();
      if (data) {
        targetBooking = {
          id: data.id,
          fullName: data.full_name,
          email: data.email,
          companyName: data.company_name,
          industry: data.industry,
          service: data.service,
          projectDescription: data.project_description,
          projectBudget: data.project_budget,
          consultationType: data.consultation_type,
          preferredDate: data.preferred_date,
          preferredTime: data.preferred_time,
          confirmedAt: data.confirmed_at,
          bookingStatus: data.booking_status,
          paymentStatus: data.payment_status,
          internalNotes: data.internal_notes,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
      }
    }

    if (!targetBooking) {
      return res.status(404).json({ success: false, error: 'Consultation booking not found.' });
    }

    try {
      const notesToSend = meetingNotes !== undefined ? meetingNotes : targetBooking.internalNotes;
      const result = await sendAppointmentConfirmationEmail(targetBooking, notesToSend);

      return res.json({
        success: result.success,
        error: result.error,
        warning: result.warning,
        message: result.success
          ? result.warning || `Confirmation email dispatched to ${targetBooking.email}`
          : result.error || 'Failed to dispatch confirmation email',
      });
    } catch (err) {
      console.error('[Send Confirmation Error]', err);
      return res.status(500).json({ success: false, error: String(err) });
    }
  }
);

// -------------------------------------------------------------
// Vite Server Mounting in Dev or Static files in Prod
// -------------------------------------------------------------
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

async function startServer() {
  const httpServer = http.createServer(app);

  if (process.env.NODE_ENV !== 'production') {
    const isHmrDisabled = process.env.DISABLE_HMR === 'true';
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: !isHmrDisabled,
        ws: isHmrDisabled ? false : { server: httpServer },
        watch: isHmrDisabled ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`ByteSync Studio server listening on port ${PORT}`);
    // Non-blocking SMTP connection verification check on startup
    verifySmtpConnection()
      .then((smtpStatus) => {
        if (smtpStatus.success) {
          console.log(smtpStatus.message);
        } else {
          console.warn(`[Gmail SMTP] Note: ${smtpStatus.message}`);
        }
      })
      .catch((err) => {
        console.warn('[Gmail SMTP] Verification check warning:', err);
      });
  });
}

startServer();
