import { SiteConfig } from '../types';

const basePath =
  typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL
    ? import.meta.env.BASE_URL.replace(/\/+$/, '')
    : '';

export const siteConfig: SiteConfig = {
  name: 'ByteSync Studio',
  legalName: 'ByteSync Studio',
  taglinePrimary: 'Your business. Digitally transformed.',
  taglineSecondary: 'Intelligent systems. Built to scale.',
  description:
    'ByteSync Studio is an AI engineering and digital transformation agency that helps businesses modernize their operations through AI solutions, machine learning, custom web and backend systems, software integrations, and business automation.',
  instagramHandle: '@bytesync_studio',
  instagramUrl: 'https://instagram.com/bytesync_studio',
  // Configurable contact details
  email: 'contact.bytesyncstudio@gmail.com',
  linkedinUrl: 'https://www.linkedin.com/company/bytesync-studio',
  whatsappUrl: '', // Optional: configure when phone/whatsapp is provisioned
  logoPath: `${basePath}/images/bytesync_logo.png`,
  
  // Paid consultation configuration: kept disabled until official pricing & payment provider are configured
  paidConsultationConfig: {
    enabled: false,
    price: undefined,
    currency: 'USD',
    durationMinutes: 60,
  },
  
  // Portfolio configuration: Leave undefined until actual portfolio URL is provided
  portfolioConfig: {
    fullPortfolioUrl: undefined,
  },
};
