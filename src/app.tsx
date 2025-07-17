import { useState } from "react";
import { FileUpload } from "./components/FileUpload";
import { JobDescriptionForm } from "./components/JobDescriptionForm";
import { MatchingResults } from "./components/MatchingResults";
import { JobDescription, Resume, MatchingResponse } from "./types/matching";
import { MockMatchingService } from "./services/mockMatching";
import { Search, Users, Zap, Target } from "lucide-react";

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
    setMatchingResults(null); // Clear previous results
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
    // Load sample job description
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

    // Load sample resumes
    const sampleResumes = MockMatchingService.generateSampleResumes();
    setResumes(sampleResumes);

    // Auto-match after loading sample data
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Search className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  JD vs CV Matching Agent
                </h1>
                <p className="text-sm text-gray-600">
                  AI-powered candidate ranking system
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={loadSampleData}
                className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Load Sample Data
              </button>
              <button
                onClick={clearAll}
                className="px-4 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Features Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 mb-8 text-white">
          <h2 className="text-2xl font-bold mb-4">
            Intelligent Resume Matching
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <Zap className="h-8 w-8 text-yellow-300" />
              <div>
                <h3 className="font-semibold">AI-Powered Analysis</h3>
                <p className="text-sm opacity-90">
                  Advanced NLP and skill extraction
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Target className="h-8 w-8 text-green-300" />
              <div>
                <h3 className="font-semibold">Contextual Matching</h3>
                <p className="text-sm opacity-90">Beyond keyword matching</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-blue-300" />
              <div>
                <h3 className="font-semibold">Ranked Results</h3>
                <p className="text-sm opacity-90">
                  Detailed scoring and insights
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Job Description Form */}
          <div>
            <JobDescriptionForm
              onJobDescriptionSaved={handleJobDescriptionSaved}
            />
          </div>

          {/* Resume Upload */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Users className="h-6 w-6 mr-2 text-blue-600" />
                Upload Resumes
              </h2>
              <FileUpload
                onFilesSelected={handleFilesSelected}
                acceptedTypes=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                multiple={true}
                title="Drop resume files here"
                description="Upload multiple PDF or DOCX files to analyze"
                maxFiles={10}
              />

              {resumes.length > 0 && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">
                    {resumes.length} resume{resumes.length !== 1 ? "s" : ""}{" "}
                    uploaded
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {resumes.map((resume, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {resume.fileName}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Match Button */}
        {jobDescription && resumes.length > 0 && !matchingResults && (
          <div className="text-center mb-8">
            <button
              onClick={handleMatch}
              disabled={loading}
              className="px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Analyzing Candidates...
                </>
              ) : (
                <>
                  <Target className="h-5 w-5 mr-2" />
                  Match Candidates
                </>
              )}
            </button>
          </div>
        )}

        {/* Results */}
        <MatchingResults results={matchingResults} loading={loading} />
      </main>
    </div>
  );
}

export default App;
