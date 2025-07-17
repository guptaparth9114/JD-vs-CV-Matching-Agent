import React from "react";
import { MatchingResult, MatchingResponse } from "../types/matching";
import {
  User,
  Award,
  Target,
  Brain,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

interface MatchingResultsProps {
  results: MatchingResponse | null;
  loading: boolean;
}

const ScoreBar: React.FC<{ score: number; label: string; color: string }> = ({
  score,
  label,
  color,
}) => (
  <div className="mb-3">
    <div className="flex justify-between text-sm mb-1">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium">{score}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className={`h-2 rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${score}%` }}
      />
    </div>
  </div>
);

const CandidateCard: React.FC<{ result: MatchingResult; rank: number }> = ({
  result,
  rank,
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return "bg-yellow-500 text-white";
    if (rank === 2) return "bg-gray-400 text-white";
    if (rank === 3) return "bg-amber-600 text-white";
    return "bg-gray-200 text-gray-700";
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getRankBadgeColor(
              rank
            )}`}
          >
            #{rank}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <User className="h-5 w-5 mr-2 text-gray-500" />
              {result.fileName.replace(/\.[^/.]+$/, "")}
            </h3>
            <p className="text-sm text-gray-600">
              Overall Match: {result.overallScore}%
            </p>
          </div>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            result.overallScore >= 80
              ? "bg-green-100 text-green-800"
              : result.overallScore >= 60
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {result.overallScore >= 80
            ? "Excellent"
            : result.overallScore >= 60
            ? "Good"
            : "Poor"}{" "}
          Match
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <ScoreBar
          score={result.skillsScore}
          label="Skills Match"
          color={getScoreColor(result.skillsScore)}
        />
        <ScoreBar
          score={result.experienceScore}
          label="Experience"
          color={getScoreColor(result.experienceScore)}
        />
        <ScoreBar
          score={result.contextualScore}
          label="Context"
          color={getScoreColor(result.contextualScore)}
        />
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
          <Brain className="h-4 w-4 inline mr-2 text-gray-500" />
          {result.reasoning}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium text-green-700 mb-2 flex items-center">
            <CheckCircle className="h-4 w-4 mr-1" />
            Matched Skills ({result.matchedSkills.length})
          </h4>
          <div className="flex flex-wrap gap-1">
            {result.matchedSkills.slice(0, 6).map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
              >
                {skill}
              </span>
            ))}
            {result.matchedSkills.length > 6 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{result.matchedSkills.length - 6} more
              </span>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-red-700 mb-2 flex items-center">
            <XCircle className="h-4 w-4 mr-1" />
            Missing Skills ({result.missingSkills.length})
          </h4>
          <div className="flex flex-wrap gap-1">
            {result.missingSkills.slice(0, 6).map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full"
              >
                {skill}
              </span>
            ))}
            {result.missingSkills.length > 6 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{result.missingSkills.length - 6} more
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const MatchingResults: React.FC<MatchingResultsProps> = ({
  results,
  loading,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Processing Candidates...
        </h3>
        <p className="text-gray-600">
          Analyzing resumes and matching with job requirements
        </p>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center border-2 border-dashed border-gray-300">
        <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Ready to Match
        </h3>
        <p className="text-gray-600">
          Upload a job description and resumes to see matching results
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Header */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Award className="h-6 w-6 mr-2 text-blue-600" />
            Matching Results
          </h2>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-1" />
            Processed in {results.processingTime}ms
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {results.totalCandidates}
            </div>
            <div className="text-sm text-gray-600">Total Candidates</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {results.results.filter((r) => r.overallScore >= 70).length}
            </div>
            <div className="text-sm text-gray-600">Strong Matches</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {results.jobDescription.extractedSkills.length}
            </div>
            <div className="text-sm text-gray-600">Required Skills</div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">
            Job: {results.jobDescription.title}
          </h3>
          <div className="flex flex-wrap gap-1">
            {results.jobDescription.extractedSkills.map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Candidate Results */}
      <div className="space-y-4">
        {results.results.map((result, index) => (
          <CandidateCard
            key={result.resumeId}
            result={result}
            rank={index + 1}
          />
        ))}
      </div>
    </div>
  );
};
