export type JobPost = {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  location: string;
  type: string;
  remote: boolean;
  salaryRange: string;
  skills: string[];
  description: string;
  status: string;
  createdAt: string;
};

export type ApplicationItem = {
  id: string;
  jobId: string;
  userId: string;
  candidateName: string;
  email: string;
  resumeText: string;
  coverLetter: string;
  status: string;
  createdAt: string;
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
};
