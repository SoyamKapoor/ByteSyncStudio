export type IndustryType =
  | 'Real Estate'
  | 'Healthcare & Clinics'
  | 'Technology / Startup'
  | 'E-commerce'
  | 'Professional Services'
  | 'Other';

export type ServiceType =
  | 'AI & Machine Learning'
  | 'Custom Web Development'
  | 'Backend Systems & APIs'
  | 'Business Automation'
  | 'MLOps & AI Engineering'
  | 'AI Integration'
  | 'Not Sure Yet';

export type ConsultationType = 'Free Discovery Call' | 'Paid Technical Consultation';

export type BookingStatus =
  | 'pending_review'
  | 'awaiting_payment'
  | 'confirmed'
  | 'reschedule_requested'
  | 'completed'
  | 'cancelled';

export type PaymentStatus =
  | 'not_required'
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded';

export interface ConsultationBooking {
  id: string;
  fullName: string;
  email: string;
  companyName?: string;
  industry: IndustryType;
  service: ServiceType;
  projectDescription: string;
  projectBudget?: string;
  consultationType: ConsultationType;
  preferredDate?: string;
  preferredTime?: string;
  confirmedAt?: string;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  category: ServiceType;
  description: string;
  offerings: string[];
  iconName: string;
}

export interface IndustryItem {
  id: string;
  title: string;
  description: string;
  solutions: string[];
  securityNote?: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  category: 'AI & Machine Learning' | 'Web Development' | 'Backend Systems' | 'Automation' | 'Other';
  shortDescription: string;
  problemStatement: string;
  solution: string;
  technologies: string[];
  imageUrl?: string;
  projectUrl?: string;
  isClientProject?: boolean;
  projectBadge?: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  role: string;
  organization: string;
  feedback: string;
  projectReference?: string;
  hasPermission: boolean;
  verified: boolean;
}

export interface SiteConfig {
  name: string;
  legalName: string;
  taglinePrimary: string;
  taglineSecondary: string;
  description: string;
  instagramHandle: string;
  instagramUrl: string;
  email: string;
  linkedinUrl: string;
  whatsappUrl?: string;
  logoPath: string;
  paidConsultationConfig: {
    enabled: boolean;
    price?: number;
    currency?: string;
    durationMinutes?: number;
  };
  portfolioConfig: {
    fullPortfolioUrl?: string;
  };
}
