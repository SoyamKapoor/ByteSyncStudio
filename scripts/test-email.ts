#!/usr/bin/env tsx
import dotenv from 'dotenv';
import {
  verifySmtpConnection,
  sendEmail,
  isEmailServiceConfigured,
  getGmailUser,
  getGmailAppPassword,
  getEmailFrom,
} from '../src/lib/email/mailer.js';

dotenv.config();

async function run() {
  console.log('\n======================================================');
  console.log('   ByteSync Studio — Gmail SMTP Diagnostics & Tester   ');
  console.log('======================================================\n');

  const user = getGmailUser();
  const pass = getGmailAppPassword();
  const from = getEmailFrom();

  console.log(`[Config Check]`);
  console.log(`- GMAIL_USER:             ${user || '❌ (not set)'}`);
  console.log(`- GMAIL_APP_PASSWORD:     ${pass ? `✓ (configured, ${pass.length} chars)` : '❌ (not set)'}`);
  console.log(`- EMAIL_FROM:             ${from}`);
  console.log(`- Is Configured:          ${isEmailServiceConfigured() ? '✓ Yes' : '❌ No (Mock Mode active)'}\n`);

  // 1. Run transporter.verify() check
  console.log('[Step 1] Verifying connection to smtp.gmail.com:465...');
  const verificationResult = await verifySmtpConnection();

  if (!verificationResult.success) {
    console.error(`\n❌ SMTP Verification Failed:`);
    console.error(`   ${verificationResult.message}\n`);
    console.log('📋 Next Steps to enable Gmail SMTP:');
    console.log('   1. Sign in to your Google Account (e.g. contact.bytesyncstudio@gmail.com).');
    console.log('   2. Go to: https://myaccount.google.com/security');
    console.log('   3. Ensure "2-Step Verification" is turned ON.');
    console.log('   4. Go to: https://myaccount.google.com/apppasswords');
    console.log('   5. Create an App name (e.g. "ByteSync Studio") and generate the 16-character password.');
    console.log('   6. In .env, set:');
    console.log('      GMAIL_USER=your-email@gmail.com');
    console.log('      GMAIL_APP_PASSWORD=your16charpassword');
    console.log('   7. Run this script again: npm run test:email <outside-email@example.com>\n');
    process.exit(1);
  }

  console.log(`✓ ${verificationResult.message}\n`);

  // 2. Send test email to outside recipient
  const targetRecipient = process.argv[2];

  if (!targetRecipient) {
    console.log('ℹ️ No recipient specified for outbound test email.');
    console.log('   To send a live test email to an outside recipient, run:');
    console.log('   npm run test:email your-client-email@example.com\n');
    process.exit(0);
  }

  console.log(`[Step 2] Sending live test email to outside customer: ${targetRecipient}...`);

  const testHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #050B14; color: #F4F7FB; padding: 24px; margin: 0; }
        .card { max-width: 560px; margin: 0 auto; background: #0D1928; border: 1px solid rgba(100, 160, 220, 0.3); border-radius: 12px; padding: 28px; }
        .brand { font-size: 20px; font-weight: 800; color: #00D9F5; margin-bottom: 4px; }
        .tagline { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #A8B5C7; margin-bottom: 20px; }
        .badge { display: inline-block; padding: 4px 10px; background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 6px; color: #34D399; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-bottom: 16px; }
        .title { font-size: 18px; font-weight: 700; color: #F4F7FB; margin-bottom: 12px; }
        .box { background: #091321; border-left: 3px solid #00D9F5; padding: 14px 16px; border-radius: 4px; font-size: 14px; line-height: 1.6; color: #E2E8F0; margin: 16px 0; }
        .footer { font-size: 12px; color: #7E92A9; margin-top: 24px; border-top: 1px solid rgba(100, 160, 220, 0.15); padding-top: 16px; text-align: center; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="brand">ByteSync Studio</div>
        <div class="tagline">Intelligent Systems · Built to Scale</div>
        <span class="badge">✓ Live SMTP Test Successful</span>
        <div class="title">Gmail SMTP Delivery Verified</div>
        <div class="box">
          This test confirmation confirms that the ByteSync Studio transactional email pipeline is operating directly via Gmail SMTP (<code>smtp.gmail.com:465</code>).
          <br><br>
          Confirmation emails can now reach any outside client address directly without unverified domain restrictions!
        </div>
        <p style="font-size: 13px; color: #A8B5C7;">
          Dispatched from: <code>${from}</code><br>
          Delivered to: <code>${targetRecipient}</code><br>
          Timestamp: ${new Date().toISOString()}
        </p>
        <div class="footer">
          ByteSync Studio · Executive Consultation Division
        </div>
      </div>
    </body>
    </html>
  `;

  const result = await sendEmail({
    to: targetRecipient,
    subject: `Live Test: Gmail SMTP Operational — ByteSync Studio`,
    html: testHtml,
    text: `ByteSync Studio Gmail SMTP Test - Successfully delivered to ${targetRecipient}`,
  });

  if (result.success) {
    console.log(`\n🎉 Success! Test email dispatched to ${targetRecipient}`);
    console.log(`   Message ID: ${result.messageId}\n`);
  } else {
    console.error(`\n❌ Failed to dispatch test email:`);
    console.error(`   Error: ${result.error}\n`);
    process.exit(1);
  }
}

run().catch((err) => {
  console.error('[Unhandled Error]', err);
  process.exit(1);
});
