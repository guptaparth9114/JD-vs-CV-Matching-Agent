export interface JobDescription {
  id: string;
  title: string;
  company: string;
  content: string;
  extractedSkills: string[];
  extractedResponsibilities: string[];
  createdAt: string;
}

export interface Resume {
  id: string;
  fileName: string;
  content: string;
  extractedSkills: string[];
  extractedExperience: string[];
  extractedKeywords: string[];
  uploadedAt: string;
}

export interface MatchingResult {
  resumeId: string;
  fileName: string;
  overallScore: number;
  skillsScore: number;
  experienceScore: number;
  contextualScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  extractedSkills: string[];
  extractedExperience: string[];
  reasoning: string;
}

export interface MatchingResponse {
  jobDescription: JobDescription;
  results: MatchingResult[];
  totalCandidates: number;
  processingTime: number;
}

export interface UploadProgress {
  fileName: string;
  status: "uploading" | "processing" | "completed" | "error";
  progress: number;
  error?: string;
}
