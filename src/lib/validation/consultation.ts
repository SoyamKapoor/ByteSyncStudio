import { z } from 'zod';

export const consultationSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Please enter your full name')
    .max(100, 'Name cannot exceed 100 characters'),
  email: z
    .string()
    .email('Please enter a valid work email address')
    .max(120, 'Email cannot exceed 120 characters'),
  companyName: z.string().max(100).optional().or(z.literal('')),
  industry: z.enum([
    'Real Estate',
    'Healthcare & Clinics',
    'Technology / Startup',
    'E-commerce',
    'Professional Services',
    'Other',
  ] as const),
  service: z.enum([
    'AI & Machine Learning',
    'Custom Web Development',
    'Backend Systems & APIs',
    'Business Automation',
    'MLOps & AI Engineering',
    'AI Integration',
    'Not Sure Yet',
  ] as const),
  projectDescription: z
    .string()
    .min(20, 'Please describe your project or operational challenge (at least 20 characters)')
    .max(2000, 'Description cannot exceed 2000 characters'),
  projectBudget: z
    .string()
    .trim()
    .min(1, 'Please enter your project budget')
    .max(100, 'Budget description cannot exceed 100 characters'),
  consultationType: z.enum(['Free Discovery Call', 'Paid Technical Consultation']),
  preferredDate: z
    .string()
    .trim()
    .min(1, 'Please select your preferred date'),
  preferredTime: z
    .string()
    .trim()
    .min(1, 'Please enter your preferred time window')
    .max(100, 'Time window cannot exceed 100 characters'),
  // Spam honeypot
  website_hp: z.string().max(0, 'Spam detected').optional().or(z.literal('')),
});

export type ConsultationFormData = z.infer<typeof consultationSchema>;
