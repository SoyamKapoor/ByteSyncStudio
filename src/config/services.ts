import { ServiceItem, IndustryItem } from '../types';

export const servicesData: ServiceItem[] = [
  {
    id: 'ai-machine-learning',
    title: 'AI & Machine Learning',
    category: 'AI & Machine Learning',
    description:
      'Intelligent solutions that help businesses analyze information, automate complex tasks, and improve digital experiences.',
    offerings: [
      'Custom AI integrations',
      'Machine learning solutions',
      'AI-powered assistants',
      'Intelligent document processing',
      'Predictive analytics',
    ],
    iconName: 'Cpu',
  },
  {
    id: 'custom-web-backend',
    title: 'Custom Web & Backend Systems',
    category: 'Custom Web Development',
    description:
      'Reliable digital platforms and backend infrastructure designed around your business requirements.',
    offerings: [
      'Business websites',
      'Web applications',
      'Backend development',
      'API development & integrations',
      'Database design',
      'Internal portals',
    ],
    iconName: 'Server',
  },
  {
    id: 'business-automation',
    title: 'Business Process Automation',
    category: 'Business Automation',
    description:
      'Reduce repetitive work by connecting systems and creating efficient business workflows.',
    offerings: [
      'Workflow automation',
      'Lead management',
      'Appointment request workflows',
      'Email automation',
      'Third-party software integrations',
    ],
    iconName: 'GitBranch',
  },
  {
    id: 'mlops-ai-engineering',
    title: 'MLOps & AI Engineering',
    category: 'MLOps & AI Engineering',
    description:
      'Engineering support for deploying, monitoring, and maintaining machine learning systems.',
    offerings: [
      'Model deployment',
      'Automated training pipelines',
      'Model monitoring',
      'CI/CD workflows',
      'AI infrastructure support',
    ],
    iconName: 'Activity',
  },
];

export const industriesData: IndustryItem[] = [
  {
    id: 'real-estate',
    title: 'Real Estate',
    description:
      'Streamline property inquiry pipelines, client intake, and data flows for agencies and brokers.',
    solutions: [
      'Property listing websites',
      'Lead capture systems',
      'Inquiry management workflows',
      'AI-assisted lead qualification',
    ],
  },
  {
    id: 'healthcare-clinics',
    title: 'Healthcare & Clinics',
    description:
      'Modernize clinical workflows and patient scheduling with strict privacy-first architecture.',
    solutions: [
      'Clinic websites',
      'Appointment request systems',
      'Administrative workflow automation',
      'Secure digital information workflows',
    ],
    securityNote: 'Architected with dedicated access controls and encryption for sensitive clinic data.',
  },
  {
    id: 'startups-growing-businesses',
    title: 'Startups & Growing Businesses',
    description:
      'Rapidly build scalable MVPs, robust backend foundations, and intelligent product features.',
    solutions: [
      'MVP development',
      'Custom web applications',
      'AI integrations',
      'Backend systems and APIs',
    ],
  },
  {
    id: 'established-businesses',
    title: 'Established Businesses',
    description:
      'Modernize legacy manual operations with integrated dashboards and streamlined automations.',
    solutions: [
      'Internal dashboards',
      'Business process automation',
      'Software integrations',
      'Custom reporting systems',
    ],
  },
];
