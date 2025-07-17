import { JobDescription, Resume, MatchingResult } from "../types/matching";
import { SkillExtractor } from "./skillExtraction";

export class MatchingEngine {
  static calculateSkillsScore(
    jdSkills: string[],
    resumeSkills: string[]
  ): number {
    if (jdSkills.length === 0) return 0;

    const matchedSkills = jdSkills.filter((skill) =>
      resumeSkills.some(
        (rSkill) =>
          rSkill.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(rSkill.toLowerCase())
      )
    );

    return (matchedSkills.length / jdSkills.length) * 100;
  }

  static calculateExperienceScore(
    jdContent: string,
    resumeExperience: string[]
  ): number {
    // Simple experience matching based on keywords
    const jdKeywords = SkillExtractor.extractKeywords(jdContent);
    let matchCount = 0;

    resumeExperience.forEach((exp) => {
      const expKeywords = SkillExtractor.extractKeywords(exp);
      const matches = expKeywords.filter((keyword) =>
        jdKeywords.includes(keyword)
      );
      matchCount += matches.length;
    });

    return Math.min((matchCount / Math.max(jdKeywords.length, 1)) * 100, 100);
  }

  static calculateContextualScore(
    jdContent: string,
    resumeContent: string
  ): number {
    // Simple contextual similarity using keyword overlap
    const jdKeywords = new Set(SkillExtractor.extractKeywords(jdContent));
    const resumeKeywords = new Set(
      SkillExtractor.extractKeywords(resumeContent)
    );

    const intersection = new Set(
      [...jdKeywords].filter((x) => resumeKeywords.has(x))
    );
    const union = new Set([...jdKeywords, ...resumeKeywords]);

    return union.size > 0 ? (intersection.size / union.size) * 100 : 0;
  }

  static findMatchedSkills(
    jdSkills: string[],
    resumeSkills: string[]
  ): string[] {
    return jdSkills.filter((skill) =>
      resumeSkills.some(
        (rSkill) =>
          rSkill.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(rSkill.toLowerCase())
      )
    );
  }

  static findMissingSkills(
    jdSkills: string[],
    resumeSkills: string[]
  ): string[] {
    return jdSkills.filter(
      (skill) =>
        !resumeSkills.some(
          (rSkill) =>
            rSkill.toLowerCase().includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(rSkill.toLowerCase())
        )
    );
  }

  static generateReasoning(result: MatchingResult): string {
    const { overallScore, matchedSkills, missingSkills } = result;

    if (overallScore >= 80) {
      return `Excellent match! Candidate has ${matchedSkills.length} matching skills and strong relevant experience.`;
    } else if (overallScore >= 60) {
      return `Good match with ${
        matchedSkills.length
      } matching skills. Missing: ${missingSkills.slice(0, 3).join(", ")}.`;
    } else if (overallScore >= 40) {
      return `Moderate match. Has some relevant skills but missing key requirements: ${missingSkills
        .slice(0, 3)
        .join(", ")}.`;
    } else {
      return `Low match. Candidate lacks most required skills: ${missingSkills
        .slice(0, 5)
        .join(", ")}.`;
    }
  }

  static matchResumes(
    jobDescription: JobDescription,
    resumes: Resume[]
  ): MatchingResult[] {
    const results: MatchingResult[] = [];

    resumes.forEach((resume) => {
      const skillsScore = this.calculateSkillsScore(
        jobDescription.extractedSkills,
        resume.extractedSkills
      );

      const experienceScore = this.calculateExperienceScore(
        jobDescription.content,
        resume.extractedExperience
      );

      const contextualScore = this.calculateContextualScore(
        jobDescription.content,
        resume.content
      );

      // Weighted overall score
      const overallScore =
        skillsScore * 0.5 + experienceScore * 0.3 + contextualScore * 0.2;

      const matchedSkills = this.findMatchedSkills(
        jobDescription.extractedSkills,
        resume.extractedSkills
      );

      const missingSkills = this.findMissingSkills(
        jobDescription.extractedSkills,
        resume.extractedSkills
      );

      const result: MatchingResult = {
        resumeId: resume.id,
        fileName: resume.fileName,
        overallScore: Math.round(overallScore),
        skillsScore: Math.round(skillsScore),
        experienceScore: Math.round(experienceScore),
        contextualScore: Math.round(contextualScore),
        matchedSkills,
        missingSkills,
        extractedSkills: resume.extractedSkills,
        extractedExperience: resume.extractedExperience,
        reasoning: "",
      };

      result.reasoning = this.generateReasoning(result);
      results.push(result);
    });

    // Sort by overall score (descending)
    return results.sort((a, b) => b.overallScore - a.overallScore);
  }
}
