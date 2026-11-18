/**
 * Compatibility re-export module.
 * The email dispatch layer has been migrated from Resend to Nodemailer with Gmail SMTP.
 * All logic is centralized in ./mailer.ts.
 */
export * from './mailer.js';
