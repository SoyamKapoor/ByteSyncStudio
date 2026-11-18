/**
 * Payment Integration Architecture for ByteSync Studio
 * 
 * Supports modular payment gateways (e.g. Stripe, LemonSqueezy, Razorpay)
 * for Paid Technical Consultations.
 * 
 * Current Status: Unconfigured (Disabled by default per prompt specification).
 * Free Discovery Calls remain 100% active and unblocked.
 */

export interface PaymentCheckoutSession {
  sessionId: string;
  checkoutUrl: string;
}

const paymentProvider = process.env.PAYMENT_PROVIDER || '';
const paymentSecretKey = process.env.PAYMENT_SECRET_KEY || '';

export const isPaymentConfigured = Boolean(
  paymentProvider && 
  paymentSecretKey && 
  !paymentSecretKey.includes('placeholder')
);

export async function createCheckoutSession(params: {
  bookingId: string;
  customerEmail: string;
  customerName: string;
  amountCents: number;
  currency: string;
}): Promise<PaymentCheckoutSession | null> {
  if (!isPaymentConfigured) {
    console.warn(
      `[Payment Gateway: Not Configured] Cannot initialize paid checkout session for Booking #${params.bookingId}. Please configure PAYMENT_PROVIDER and PAYMENT_SECRET_KEY in environment.`
    );
    return null;
  }

  // When Stripe is configured, create a real session
  throw new Error('Payment provider is not yet activated. Free Discovery Calls are enabled.');
}
