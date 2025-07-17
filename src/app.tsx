import { useState } from "react";
import { FileUpload } from "./components/FileUpload";
import { JobDescriptionForm } from "./components/JobDescriptionForm";
import { MatchingResults } from "./components/MatchingResults";
import { JobDescription, Resume, MatchingResponse } from "./types/matching";
import { MockMatchingService } from "./services/mockMatching";
import { Search, Users, Zap, Target } from "lucide-react";
import "./index.css"; // make sure this is imported

function App() {
  const [jobDescription, setJobDescription] = useState<JobDescription | null>(
    null
  );
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [matchingResults, setMatchingResults] =
    useState<MatchingResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleJobDescriptionSaved = (jd: JobDescription) => {
    setJobDescription(jd);
    setMatchingResults(null);
  };

  const handleFilesSelected = async (files: File[]) => {
    setLoading(true);
    try {
      const processedResumes = await Promise.all(
        files.map((file) => MockMatchingService.processResume(file))
      );
      setResumes((prev) => [...prev, ...processedResumes]);
    } catch (error) {
      console.error("Error processing resumes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMatch = async () => {
    if (!jobDescription || resumes.length === 0) return;

    setLoading(true);
    try {
      const results = await MockMatchingService.matchCandidates(
        jobDescription,
        resumes
      );
      setMatchingResults(results);
    } catch (error) {
      console.error("Error matching candidates:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadSampleData = async () => {
    const sampleJD: JobDescription = {
      id: "sample-jd",
      title: "Senior Full Stack Developer",
      company: "Tech Innovations Inc.",
      content: `Senior Full Stack Developer

We are looking for an experienced Full Stack Developer to join our growing team.

Requirements:
• 5+ years of experience in full-stack development
• Proficiency in React, Node.js, and TypeScript
• Experience with cloud platforms (AWS, Azure, or GCP)
• Strong knowledge of databases (PostgreSQL, MongoDB)
• Experience with Docker and Kubernetes
• Familiarity with CI/CD pipelines
• Knowledge of microservices architecture
• Experience with Agile/Scrum methodologies

Responsibilities:
• Design and develop scalable web applications
• Collaborate with cross-functional teams
• Implement best practices for code quality and testing
• Mentor junior developers
• Participate in architectural decisions`,
      extractedSkills: [],
      extractedResponsibilities: [],
      createdAt: new Date().toISOString(),
    };

    setJobDescription(sampleJD);

    const sampleResumes = MockMatchingService.generateSampleResumes();
    setResumes(sampleResumes);

    setLoading(true);
    try {
      const results = await MockMatchingService.matchCandidates(
        sampleJD,
        sampleResumes
      );
      setMatchingResults(results);
    } catch (error) {
      console.error("Error matching candidates:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setJobDescription(null);
    setResumes([]);
    setMatchingResults(null);
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div className="header-left">
            <div className="icon-wrapper">
              <Search className="icon" />
            </div>
            <div>
              <h1 className="app-title">JD vs CV Matching Agent</h1>
              <p className="app-subtitle">
                AI-powered candidate ranking system
              </p>
            </div>
          </div>
          <div className="header-right">
            <button onClick={loadSampleData} className="btn green">
              Load Sample Data
            </button>
            <button onClick={clearAll} className="btn gray">
              Clear All
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <section className="features-banner">
          <h2 className="banner-title">Intelligent Resume Matching</h2>
          <div className="features-grid">
            <div className="feature-item">
              <Zap className="feature-icon yellow" />
              <div>
                <h3>AI-Powered Analysis</h3>
                <p>Advanced NLP and skill extraction</p>
              </div>
            </div>
            <div className="feature-item">
              <Target className="feature-icon green" />
              <div>
                <h3>Contextual Matching</h3>
                <p>Beyond keyword matching</p>
              </div>
            </div>
            <div className="feature-item">
              <Users className="feature-icon blue" />
              <div>
                <h3>Ranked Results</h3>
                <p>Detailed scoring and insights</p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid">
          <div>
            <JobDescriptionForm
              onJobDescriptionSaved={handleJobDescriptionSaved}
            />
          </div>
          <div className="resume-upload">
            <h2 className="section-title">
              <Users className="icon blue" />
              Upload Resumes
            </h2>
            <FileUpload
              onFilesSelected={handleFilesSelected}
              acceptedTypes=".pdf,.docx"
              multiple={true}
              title="Drop resume files here"
              description="Upload multiple PDF or DOCX files to analyze"
              maxFiles={10}
            />

            {resumes.length > 0 && (
              <div className="resume-info">
                <p>
                  {resumes.length} resume{resumes.length !== 1 ? "s" : ""}{" "}
                  uploaded
                </p>
                <div className="resume-tags">
                  {resumes.map((resume, index) => (
                    <span key={index} className="resume-tag">
                      {resume.fileName}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {jobDescription && resumes.length > 0 && !matchingResults && (
          <div className="match-btn-wrapper">
            <button
              onClick={handleMatch}
              disabled={loading}
              className="btn match-btn"
            >
              {loading ? (
                <>
                  <div className="spinner" />
                  Analyzing Candidates...
                </>
              ) : (
                <>
                  <Target className="icon" />
                  Match Candidates
                </>
              )}
            </button>
          </div>
        )}

        <MatchingResults results={matchingResults} loading={loading} />
      </main>
    </div>
  );
}

export default App;
