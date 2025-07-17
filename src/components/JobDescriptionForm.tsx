import React, { useState } from "react";
import { Briefcase, Building2, Save } from "lucide-react";
import { JobDescription } from "../types/matching";

interface JobDescriptionFormProps {
  onJobDescriptionSaved: (jd: JobDescription) => void;
}

export const JobDescriptionForm: React.FC<JobDescriptionFormProps> = ({
  onJobDescriptionSaved,
}) => {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setLoading(true);

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const jobDescription: JobDescription = {
      id: Date.now().toString(),
      title: title.trim(),
      company: company.trim() || "Company",
      content: content.trim(),
      extractedSkills: [], // Will be populated by the matching service
      extractedResponsibilities: [],
      createdAt: new Date().toISOString(),
    };

    onJobDescriptionSaved(jobDescription);
    setLoading(false);
  };

  const sampleJD = `Senior Full Stack Developer

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
• Participate in architectural decisions

Nice to have:
• Experience with GraphQL
• Knowledge of machine learning concepts
• Previous startup experience`;

  const loadSample = () => {
    setTitle("Senior Full Stack Developer");
    setCompany("Tech Innovations Inc.");
    setContent(sampleJD);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <Briefcase className="h-6 w-6 mr-2 text-blue-600" />
          Job Description
        </h2>
        <button
          type="button"
          onClick={loadSample}
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          Load Sample JD
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Job Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Senior Software Engineer"
              required
            />
          </div>

          <div>
            <label
              htmlFor="company"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Company
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Tech Corp"
              />
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Job Description *
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
            placeholder="Paste the complete job description including requirements, responsibilities, and qualifications..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading || !title.trim() || !content.trim()}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Job Description
            </>
          )}
        </button>
      </form>
    </div>
  );
};
