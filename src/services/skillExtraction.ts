// Skill extraction and NLP processing utilities
export class SkillExtractor {
  private static readonly COMMON_SKILLS = [
    // Programming Languages
    "JavaScript",
    "TypeScript",
    "Python",
    "Java",
    "C++",
    "C#",
    "Go",
    "Rust",
    "PHP",
    "Ruby",

    // Frontend Technologies
    "React",
    "Vue.js",
    "Angular",
    "HTML5",
    "CSS3",
    "Sass",
    "Less",
    "Webpack",
    "Vite",

    // Backend Technologies
    "Node.js",
    "Express",
    "Django",
    "Flask",
    "Spring Boot",
    "ASP.NET",
    "Laravel",

    // Databases
    "PostgreSQL",
    "MySQL",
    "MongoDB",
    "Redis",
    "Elasticsearch",
    "SQLite",

    // Cloud & DevOps
    "AWS",
    "Azure",
    "GCP",
    "Docker",
    "Kubernetes",
    "Jenkins",
    "GitHub Actions",
    "CI/CD",

    // Tools & Methodologies
    "Git",
    "Agile",
    "Scrum",
    "REST API",
    "GraphQL",
    "Microservices",
    "TDD",
    "Unit Testing",

    // Soft Skills
    "Leadership",
    "Team Management",
    "Communication",
    "Problem Solving",
    "Project Management",
  ];

  static extractSkills(text: string): string[] {
    const normalizedText = text.toLowerCase();
    const foundSkills: string[] = [];

    this.COMMON_SKILLS.forEach((skill) => {
      const skillLower = skill.toLowerCase();
      if (normalizedText.includes(skillLower)) {
        foundSkills.push(skill);
      }
    });

    return [...new Set(foundSkills)]; // Remove duplicates
  }

  static extractResponsibilities(text: string): string[] {
    const responsibilities: string[] = [];
    const lines = text.split("\n");

    for (const line of lines) {
      const trimmed = line.trim();
      // Look for bullet points or numbered lists
      if (trimmed.match(/^[•\-\*\d+\.]/)) {
        const cleaned = trimmed.replace(/^[•\-\*\d+\.\s]+/, "").trim();
        if (cleaned.length > 10) {
          // Filter out very short items
          responsibilities.push(cleaned);
        }
      }
    }

    return responsibilities;
  }

  static extractExperience(text: string): string[] {
    const experience: string[] = [];
    const experiencePatterns = [
      /(\d+)\+?\s*years?\s+(?:of\s+)?(?:experience|exp)/gi,
      /(\d+)\+?\s*yrs?\s+(?:of\s+)?(?:experience|exp)/gi,
      /experience[:\s]+([^.]+)/gi,
      /worked\s+(?:as|with|on)\s+([^.]+)/gi,
    ];

    experiencePatterns.forEach((pattern) => {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        if (match[1]) {
          experience.push(match[1].trim());
        }
      }
    });

    return [...new Set(experience)];
  }

  static extractKeywords(text: string): string[] {
    // Simple keyword extraction - in production, use more sophisticated NLP
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 3);

    const wordFreq: { [key: string]: number } = {};
    words.forEach((word) => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });

    // Return top keywords by frequency
    return Object.entries(wordFreq)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)
      .map(([word]) => word);
  }
}
