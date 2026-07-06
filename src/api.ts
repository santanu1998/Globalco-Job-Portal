import { demoApplications, demoJobs } from './data';
import type { ApiResponse, ApplicationItem, JobPost } from './types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

async function request<T>(path: string, options?: RequestInit, fallback?: T): Promise<T> {
  if (!API_BASE && fallback !== undefined) return fallback;
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) }
    });
    const json = (await response.json()) as ApiResponse<T>;
    return json.data;
  } catch (error) {
    if (fallback !== undefined) return fallback;
    throw error;
  }
}

export const api = {
  jobs: (query = '') => request<JobPost[]>(`/api/jobs${query}`, undefined, demoJobs),
  analytics: () => request<Record<string, unknown>>('/api/jobs/analytics', undefined, {
    totalJobs: demoJobs.length,
    remoteJobs: demoJobs.filter((j) => j.remote).length,
    onsiteJobs: demoJobs.filter((j) => !j.remote).length,
    jobsByLocation: { Hyderabad: 1, Bengaluru: 1, Remote: 1 }
  }),
  recommendations: (skills: string) => request<Array<Record<string, unknown>>>(`/api/jobs/recommendations?skills=${encodeURIComponent(skills)}&location=Hyderabad`, undefined,
    demoJobs.map((job, index) => ({ job, score: 95 - index * 15, reason: 'Skill and location fit' }))
  ),
  applications: () => request<ApplicationItem[]>('/api/applications/user/demo-user', undefined, demoApplications),
  createJob: (payload: Partial<JobPost>) => request<JobPost>('/api/jobs', { method: 'POST', body: JSON.stringify(payload) }, {
    ...demoJobs[0],
    id: crypto.randomUUID(),
    ...payload
  } as JobPost),
  apply: (payload: Partial<ApplicationItem>) => request<ApplicationItem>('/api/applications', { method: 'POST', body: JSON.stringify(payload) }, {
    ...demoApplications[0],
    id: crypto.randomUUID(),
    ...payload
  } as ApplicationItem),
  ai: (path: string, payload: unknown) => request<Record<string, string | boolean>>(`/api/ai/${path}`, { method: 'POST', body: JSON.stringify(payload) }, {
    output: 'AI DEMO OUTPUT\n\nGenerated professional content for your job portal workflow. Configure VITE_API_BASE_URL and GEMINI_API_KEY to use the live Spring Boot AI service.',
    geminiConfigured: false
  })
};
