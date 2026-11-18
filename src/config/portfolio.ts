import { PortfolioProject } from '../types';

/**
 * ByteSync Studio Technical Demonstration & Case Study Repository
 * 
 * Note: As instructed, client engagements are only added when verified.
 * The entries below represent in-house technical demonstrations and architecture prototypes.
 */
export const portfolioProjects: PortfolioProject[] = [
  {
    id: 'demo-doc-pipeline',
    title: 'Intelligent Document & Contract Extraction Pipeline',
    category: 'AI & Machine Learning',
    shortDescription:
      'High-throughput document ingestion engine extracting structured key-value entities from unstructured PDFs with schema validation.',
    problemStatement:
      'Manual data entry of legal, medical, and vendor documentation consumes dozens of staff hours weekly and introduces transcription error rates.',
    solution:
      'Constructed an asynchronous extraction pipeline combining OCR, layout-aware transformer parsing, and strict Zod validation before database sync.',
    technologies: ['Python', 'FastAPI', 'PostgreSQL', 'LangChain', 'Docker', 'Redis'],
    projectBadge: 'In-House Technical Prototype',
    isClientProject: false,
  },
  {
    id: 'demo-clinic-triage',
    title: 'Clinic Intake & Appointment Scheduling Workflow',
    category: 'Automation',
    shortDescription:
      'Automated patient intake system with encrypted preliminary symptom triage and bi-directional calendar integration.',
    problemStatement:
      'Front-desk staff overwhelmed with high call volumes and manual calendar scheduling, leading to delayed patient bookings.',
    solution:
      'Built a multi-step digital intake portal with automated calendar conflict resolution, SMS/email confirmations, and clinic staff notification rules.',
    technologies: ['Next.js', 'TypeScript', 'Node.js', 'Supabase', 'Twilio API', 'Resend'],
    projectBadge: 'Reference Architecture',
    isClientProject: false,
  },
  {
    id: 'demo-realestate-leads',
    title: 'Real Estate Multi-Channel Lead Qualification Engine',
    category: 'Backend Systems',
    shortDescription:
      'Unified CRM pipeline connecting portal inquiries, classifying urgency, and dispatching instant broker alerts.',
    problemStatement:
      'Property inquiries arriving via multiple external portals often went unanswered for hours, resulting in low lead conversion rates.',
    solution:
      'Designed a unified webhook receiver and lead scoring microservice that filters spam, assesses buyer criteria, and pushes warm leads to agent mobile apps.',
    technologies: ['TypeScript', 'Express', 'PostgreSQL', 'Webhooks', 'Tailwind CSS'],
    projectBadge: 'Technical Demonstration',
    isClientProject: false,
  },
];
