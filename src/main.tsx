import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BriefcaseBusiness, Building2, Bot, Gauge, Search, ShieldCheck, Sparkles, UserRound } from 'lucide-react';
import { api } from './api';
import type { ApplicationItem, JobPost } from './types';
import './styles.css';

type Tab = 'seeker' | 'employer' | 'admin' | 'docs';

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="badge">{children}</span>;
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <section className={`card ${className}`}>{children}</section>;
}

function App() {
  const [tab, setTab] = useState<Tab>('seeker');
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [analytics, setAnalytics] = useState<Record<string, unknown>>({});

  async function refresh() {
    const [jobData, appData, analyticsData] = await Promise.all([api.jobs(), api.applications(), api.analytics()]);
    setJobs(jobData);
    setApplications(appData);
    setAnalytics(analyticsData);
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div>
      <Hero />
      <nav className="tabs">
        <button className={tab === 'seeker' ? 'active' : ''} onClick={() => setTab('seeker')}><UserRound size={18}/> Job Seeker</button>
        <button className={tab === 'employer' ? 'active' : ''} onClick={() => setTab('employer')}><Building2 size={18}/> Employer</button>
        <button className={tab === 'admin' ? 'active' : ''} onClick={() => setTab('admin')}><ShieldCheck size={18}/> Admin</button>
        <button className={tab === 'docs' ? 'active' : ''} onClick={() => setTab('docs')}><Bot size={18}/> AI Docs</button>
      </nav>
      <main className="container">
        {tab === 'seeker' && <JobSeekerPortal jobs={jobs} applications={applications} refresh={refresh} />}
        {tab === 'employer' && <EmployerPortal jobs={jobs} applications={applications} refresh={refresh} />}
        {tab === 'admin' && <AdminPortal jobs={jobs} applications={applications} analytics={analytics} />}
        {tab === 'docs' && <Docs />}
      </main>
    </div>
  );
}

function Hero() {
  return (
    <header className="hero">
      <div className="hero-content">
        <Badge>Globalco Software Engineer Assessment</Badge>
        <h1>AI-Powered Job Portal</h1>
        <p>Spring Boot 4 microservice-style backend, React 19 frontend, smart search, AI recommendations, employer tools, admin monitoring, CI/CD, and Vercel-ready deployment.</p>
        <div className="hero-grid">
          <span><BriefcaseBusiness/> Job Board</span>
          <span><Sparkles/> Gemini-ready AI</span>
          <span><Gauge/> Analytics</span>
          <span><ShieldCheck/> Admin Portal</span>
        </div>
      </div>
    </header>
  );
}

function JobSeekerPortal({ jobs, applications, refresh }: { jobs: JobPost[]; applications: ApplicationItem[]; refresh: () => Promise<void> }) {
  const [keyword, setKeyword] = useState('');
  const [skills, setSkills] = useState('Java, Spring Boot, React');
  const [recommendations, setRecommendations] = useState<Array<Record<string, unknown>>>([]);
  const [coverLetter, setCoverLetter] = useState('');

  const filtered = useMemo(() => jobs.filter((job) => {
    const text = `${job.title} ${job.companyName} ${job.location} ${job.skills.join(' ')}`.toLowerCase();
    return text.includes(keyword.toLowerCase());
  }), [jobs, keyword]);

  async function apply(job: JobPost) {
    await api.apply({
      jobId: job.id,
      userId: 'demo-user',
      candidateName: 'Santanu Singha',
      email: 'santanu@example.com',
      resumeText: 'Java Spring Boot developer with React, TypeScript, Docker, GitHub Actions, and AI-assisted development exposure.',
      coverLetter: coverLetter || 'I am excited to apply for this role.'
    });
    await refresh();
    alert('Application submitted successfully');
  }

  async function generateCover(job: JobPost) {
    const result = await api.ai('cover-letter', {
      candidateName: 'Santanu Singha', title: job.title, company: job.companyName, skills: ['Java', 'Spring Boot', 'React'], profileSummary: 'Full-stack Java developer.'
    });
    setCoverLetter(String(result.output));
  }

  async function loadRecommendations() {
    setRecommendations(await api.recommendations(skills));
  }

  return (
    <div className="grid two">
      <Card>
        <div className="section-title"><Search/><div><h2>Smart Job Search</h2><p>Search by role, company, location, or skill.</p></div></div>
        <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Search Java, React, Hyderabad..." />
        <div className="job-list">
          {filtered.map((job) => (
            <article className="job-card" key={job.id}>
              <div className="job-header"><div><h3>{job.title}</h3><p>{job.companyName} · {job.location} · {job.type}</p></div><Badge>{job.remote ? 'Remote' : 'Onsite'}</Badge></div>
              <p>{job.description}</p>
              <div className="skills">{job.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
              <strong>{job.salaryRange}</strong>
              <div className="actions"><button onClick={() => generateCover(job)}>AI Cover Letter</button><button className="primary" onClick={() => apply(job)}>Apply</button></div>
            </article>
          ))}
        </div>
      </Card>

      <div className="stack">
        <Card>
          <div className="section-title"><Sparkles/><div><h2>AI Recommendations</h2><p>Rank jobs from your current skill set.</p></div></div>
          <input
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            aria-label="Skills for recommendations"
            placeholder="e.g. Java, Spring Boot, React"
            title="Skills for recommendations"
          />
          <button className="primary full" onClick={loadRecommendations}>Generate Recommendations</button>
          <div className="mini-list">{recommendations.map((item, idx) => {
            const job = item.job as JobPost;
            return <div key={idx} className="mini-row"><strong>{job?.title}</strong><span>{String(item.score)}% match</span></div>;
          })}</div>
        </Card>

        <Card>
          <h2>Resume Builder</h2>
          <textarea defaultValue={'Summary: Java Spring Boot developer with React and TypeScript.\nSkills: Java, Spring Boot, REST APIs, SQL, React, Docker, GitHub Actions.'}/>
          <div className="tip">Skill gap plan: Add Kafka, Redis, cloud deployment, and monitoring projects.</div>
        </Card>

        <Card>
          <h2>Application Tracking</h2>
          <div className="mini-list">{applications.map((app) => <div className="mini-row" key={app.id}><strong>{app.candidateName}</strong><span>{app.status}</span></div>)}</div>
        </Card>

        {coverLetter && <Card><h2>Generated Cover Letter</h2><pre>{coverLetter}</pre></Card>}
      </div>
    </div>
  );
}

function EmployerPortal({ jobs, applications, refresh }: { jobs: JobPost[]; applications: ApplicationItem[]; refresh: () => Promise<void> }) {
  const [title, setTitle] = useState('Software Engineer Generalist');
  const [skills, setSkills] = useState('Java, Spring Boot, React, TypeScript');
  const [aiText, setAiText] = useState('');

  async function createJob() {
    await api.createJob({
      companyId: 'globalco',
      companyName: 'Globalco',
      title,
      location: 'Hyderabad',
      type: 'Full Time',
      remote: false,
      salaryRange: '₹35,000 - ₹40,000/month',
      skills: skills.split(',').map((s) => s.trim()),
      description: aiText || 'Build scalable, reliable software systems for global clients.'
    });
    await refresh();
    alert('Job posted');
  }

  async function generateDescription() {
    const result = await api.ai('job-description', { title, company: 'Globalco', skills: skills.split(','), responsibilities: 'Build scalable job portal and client software features.' });
    setAiText(String(result.output));
  }

  return (
    <div className="grid two">
      <Card>
        <div className="section-title"><Building2/><div><h2>Employer Job Posting</h2><p>Post roles and generate descriptions using AI.</p></div></div>
        <label htmlFor="job-title">Job title</label>
        <input id="job-title" value={title} onChange={(e) => setTitle(e.target.value)} aria-label="Job title" title="Job title" />
        <label htmlFor="job-skills">Skills</label>
        <input id="job-skills" value={skills} onChange={(e) => setSkills(e.target.value)} aria-label="Required skills" title="Required skills" />
        <div className="actions"><button onClick={generateDescription}>Generate JD</button><button className="primary" onClick={createJob}>Post Job</button></div>
        <textarea value={aiText} onChange={(e) => setAiText(e.target.value)} placeholder="AI-generated job description will appear here" />
      </Card>
      <div className="stack">
        <Card><h2>Candidate Management</h2>{applications.map((app) => <div className="candidate" key={app.id}><strong>{app.candidateName}</strong><p>{app.email}</p><Badge>{app.status}</Badge></div>)}</Card>
        <Card><h2>Job Inventory</h2><div className="mini-list">{jobs.map((job) => <div className="mini-row" key={job.id}><strong>{job.title}</strong><span>{job.status}</span></div>)}</div></Card>
      </div>
    </div>
  );
}

function AdminPortal({ jobs, applications, analytics }: { jobs: JobPost[]; applications: ApplicationItem[]; analytics: Record<string, unknown> }) {
  return (
    <div className="stack">
      <div className="grid four">
        <Metric label="Total Jobs" value={String(analytics.totalJobs ?? jobs.length)} />
        <Metric label="Remote Jobs" value={String(analytics.remoteJobs ?? jobs.filter((j) => j.remote).length)} />
        <Metric label="Applications" value={String(applications.length)} />
        <Metric label="Services" value="8 UP" />
      </div>
      <Card>
        <div className="section-title"><Gauge/><div><h2>Platform Monitoring</h2><p>Admin overview for users, employers, jobs, applications, and event-driven activity.</p></div></div>
        <div className="timeline">
          <p>USER_REGISTERED · demo-user</p>
          <p>JOB_POSTED · Globalco Software Engineer</p>
          <p>APPLICATION_SUBMITTED · Santanu Singha</p>
          <p>AI_CONTENT_GENERATED · cover letter</p>
        </div>
      </Card>
      <Card>
        <h2>Subscription and Payment Management</h2>
        <p>Enterprise-ready placeholder for paid employer plans, invoices, credits, and payment status.</p>
      </Card>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <Card className="metric"><span>{label}</span><strong>{value}</strong></Card>;
}

function Docs() {
  return (
    <div className="grid two">
      <Card><h2>AI Documentation Included</h2><p>The GitHub repository contains AI_DOCUMENTATION.md, DESIGN.md, CHOICES.md, PROMPTS.md, and SUBMISSION.md.</p><ul><li>Feature documentation</li><li>AI prompts used</li><li>Architecture decisions</li><li>Deployment steps</li></ul></Card>
      <Card><h2>CI/CD and Vercel</h2><p>GitHub Actions builds backend and frontend, then deploys the Vite React app to Vercel using repository secrets.</p><pre>VERCEL_TOKEN\nVERCEL_ORG_ID\nVERCEL_PROJECT_ID</pre></Card>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
