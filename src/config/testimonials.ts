import { Testimonial } from '../types';

/**
 * ByteSync Studio Testimonials Configuration
 * 
 * Strict Policy: Never fabricate testimonials or attribute fictional quotes.
 * If this list has no verified entries with confirmed permission, the UI automatically
 * hides testimonials and presents the Technical Credibility & Engineering Standards section.
 */
export const testimonialsData: Testimonial[] = [
  // Leave empty until real, verified client testimonials with written permission are provided
];

export const technicalCredibilityHighlights = [
  {
    title: 'Deterministic Code Quality',
    description:
      'TypeScript end-to-end with strict typing, runtime schema validation via Zod, and automated linting pipelines.',
    metric: '100% Typed',
  },
  {
    title: 'Privacy & Data Segregation',
    description:
      'Zero unauthorized data leaks with PostgreSQL Row-Level Security (RLS) and encrypted transport.',
    metric: 'RLS Enforced',
  },
  {
    title: 'Fault-Tolerant Architectures',
    description:
      'Idempotent webhook receivers, resilient retry queues, and graceful degraded modes for external APIs.',
    metric: 'Resilient Design',
  },
  {
    title: 'Scalable Cloud Infrastructure',
    description:
      'Containerized microservices and edge-optimized serverless routes designed for high concurrent throughput.',
    metric: 'Cloud Native',
  },
];
