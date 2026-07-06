import type { ApplicationItem, JobPost } from './types';

export const demoJobs: JobPost[] = [
  {
    id: 'globalco-se',
    companyId: 'globalco',
    companyName: 'Globalco',
    title: 'Software Engineer Generalist',
    location: 'Hyderabad',
    type: 'Full Time',
    remote: false,
    salaryRange: '₹35,000 - ₹40,000/month',
    skills: ['Java', 'Spring Boot', 'React', 'TypeScript', 'Git', 'Docker'],
    description: 'Build scalable systems for Globalco global clients in an onsite night-shift environment.',
    status: 'OPEN',
    createdAt: new Date().toISOString()
  },
  {
    id: 'java-backend',
    companyId: 'fintechx',
    companyName: 'FinTechX',
    title: 'Java Backend Developer',
    location: 'Bengaluru',
    type: 'Full Time',
    remote: true,
    salaryRange: '₹6 LPA - ₹10 LPA',
    skills: ['Java', 'Spring Boot', 'PostgreSQL', 'Kafka', 'Redis'],
    description: 'Develop REST APIs and event-driven backend services for fintech workflows.',
    status: 'OPEN',
    createdAt: new Date().toISOString()
  },
  {
    id: 'fullstack-react-java',
    companyId: 'cloudops',
    companyName: 'CloudOps Labs',
    title: 'Full Stack Developer',
    location: 'Remote',
    type: 'Contract',
    remote: true,
    salaryRange: '₹50,000 - ₹80,000/month',
    skills: ['React', 'TypeScript', 'Java', 'AWS', 'Docker'],
    description: 'Own end-to-end features from frontend UX to backend APIs.',
    status: 'OPEN',
    createdAt: new Date().toISOString()
  }
];

export const demoApplications: ApplicationItem[] = [
  {
    id: 'app-1',
    jobId: 'globalco-se',
    userId: 'demo-user',
    candidateName: 'Santanu Singha',
    email: 'santanu@example.com',
    resumeText: 'Java Spring Boot developer with React and Docker exposure.',
    coverLetter: 'I am excited to apply for this role.',
    status: 'REVIEWING',
    createdAt: new Date().toISOString()
  }
];
