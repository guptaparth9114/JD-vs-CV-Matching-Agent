import { JobDescription, Resume, MatchingResponse } from "../types/matching";
import { SkillExtractor } from "./skillExtraction";
import { MatchingEngine } from "./matchingEngine";
import { TextExtractor } from "./textExtraction";

export class MockMatchingService {
  static async processJobDescription(
    jd: JobDescription
  ): Promise<JobDescription> {
    // Extract skills and responsibilities from job description
    const extractedSkills = SkillExtractor.extractSkills(jd.content);
    const extractedResponsibilities = SkillExtractor.extractResponsibilities(
      jd.content
    );

    return {
      ...jd,
      extractedSkills,
      extractedResponsibilities,
    };
  }

  static async processResume(file: File): Promise<Resume> {
    const buffer = await file.arrayBuffer();
    const content = await TextExtractor.extractText(
      Buffer.from(buffer),
      file.type
    );

    const extractedSkills = SkillExtractor.extractSkills(content);
    const extractedExperience = SkillExtractor.extractExperience(content);
    const extractedKeywords = SkillExtractor.extractKeywords(content);

    return {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      fileName: file.name,
      content,
      extractedSkills,
      extractedExperience,
      extractedKeywords,
      uploadedAt: new Date().toISOString(),
    };
  }

  static async matchCandidates(
    jobDescription: JobDescription,
    resumes: Resume[]
  ): Promise<MatchingResponse> {
    const startTime = Date.now();

    // Process job description
    const processedJD = await this.processJobDescription(jobDescription);

    // Match resumes against job description
    const results = MatchingEngine.matchResumes(processedJD, resumes);

    const processingTime = Date.now() - startTime;

    return {
      jobDescription: processedJD,
      results,
      totalCandidates: resumes.length,
      processingTime,
    };
  }

  // Generate sample resumes for demo purposes
  static generateSampleResumes(): Resume[] {
    const sampleResumes = [
      {
        id: "1",
        fileName: "john_doe_senior_dev.pdf",
        content: `
          JOHN DOE
          Senior Software Engineer
          
          EXPERIENCE:
          • 6+ years of full-stack development experience
          • Expert in React, Node.js, TypeScript, Python
          • Extensive experience with AWS, Docker, Kubernetes
          • Led team of 5 developers on microservices platform
          • Implemented CI/CD pipelines using GitHub Actions and Jenkins
          • Built scalable applications serving 1M+ users
          
          SKILLS:
          JavaScript, TypeScript, React, Node.js, Python, AWS, Docker, 
          Kubernetes, PostgreSQL, MongoDB, Redis, GraphQL, Git, Agile, Scrum,
          Microservices, TDD, Jest, Cypress
          
          EDUCATION:
          Master of Computer Science - Stanford University
        `,
        extractedSkills: [
          "JavaScript",
          "TypeScript",
          "React",
          "Node.js",
          "Python",
          "AWS",
          "Docker",
          "Kubernetes",
          "PostgreSQL",
          "MongoDB",
          "Redis",
          "GraphQL",
          "Git",
          "Agile",
          "Scrum",
          "Microservices",
          "TDD",
        ],
        extractedExperience: [
          "6+ years of full-stack development",
          "Led team of 5 developers",
          "Built scalable applications serving 1M+ users",
        ],
        extractedKeywords: [
          "senior",
          "full-stack",
          "microservices",
          "scalable",
          "team",
          "leadership",
        ],
        uploadedAt: new Date().toISOString(),
      },
      {
        id: "2",
        fileName: "jane_smith_frontend.pdf",
        content: `
          JANE SMITH
          Frontend Developer
          
          EXPERIENCE:
          • 4 years of frontend development experience
          • Proficient in React, Vue.js, HTML5, CSS3, JavaScript
          • Experience with responsive design and mobile-first approach
          • Built 15+ production web applications
          • Collaborated with UX/UI designers and backend teams
          • Some exposure to Node.js and basic backend concepts
          
          SKILLS:
          HTML5, CSS3, JavaScript, React, Vue.js, Sass, Webpack, 
          Git, Figma, Adobe Creative Suite, Responsive Design, Node.js
          
          EDUCATION:
          Bachelor of Web Design - Art Institute
        `,
        extractedSkills: [
          "HTML5",
          "CSS3",
          "JavaScript",
          "React",
          "Vue.js",
          "Sass",
          "Webpack",
          "Git",
          "Node.js",
        ],
        extractedExperience: [
          "4 years of frontend development",
          "Built 15+ production web applications",
          "Collaborated with UX/UI designers",
        ],
        extractedKeywords: [
          "frontend",
          "responsive",
          "mobile-first",
          "production",
          "collaboration",
        ],
        uploadedAt: new Date().toISOString(),
      },
      {
        id: "3",
        fileName: "mike_johnson_backend.pdf",
        content: `
          MIKE JOHNSON
          Backend Developer
          
          EXPERIENCE:
          • 5 years of backend development experience
          • Expert in Node.js, Python, Java, and Go
          • Strong experience with PostgreSQL, MongoDB, Redis
          • Built RESTful APIs and microservices architecture
          • Experience with AWS, Docker, and basic Kubernetes
          • Implemented automated testing and CI/CD pipelines
          
          SKILLS:
          Node.js, Python, Java, Go, PostgreSQL, MongoDB, Redis,
          REST API, GraphQL, AWS, Docker, Kubernetes, Git, Agile,
          Microservices, Unit Testing, Integration Testing
          
          EDUCATION:
          Bachelor of Computer Science - UC Berkeley
        `,
        extractedSkills: [
          "Node.js",
          "Python",
          "Java",
          "Go",
          "PostgreSQL",
          "MongoDB",
          "Redis",
          "REST API",
          "GraphQL",
          "AWS",
          "Docker",
          "Kubernetes",
          "Git",
          "Agile",
          "Microservices",
        ],
        extractedExperience: [
          "5 years of backend development",
          "Built RESTful APIs and microservices",
          "Implemented automated testing and CI/CD",
        ],
        extractedKeywords: [
          "backend",
          "apis",
          "microservices",
          "testing",
          "automation",
        ],
        uploadedAt: new Date().toISOString(),
      },
      {
        id: "4",
        fileName: "sarah_wilson_junior.pdf",
        content: `
          SARAH WILSON
          Junior Developer
          
          EXPERIENCE:
          • 1.5 years of web development experience
          • Learning React and JavaScript fundamentals
          • Basic knowledge of HTML5, CSS3
          • Completed several personal projects
          • Eager to learn backend technologies
          • Some exposure to Git and version control
          
          SKILLS:
          HTML5, CSS3, JavaScript, React (learning), Git,
          Responsive Design, Basic Node.js
          
          EDUCATION:
          Bootcamp Graduate - General Assembly
          Bachelor of Arts - Liberal Arts College
        `,
        extractedSkills: [
          "HTML5",
          "CSS3",
          "JavaScript",
          "React",
          "Git",
          "Node.js",
        ],
        extractedExperience: [
          "1.5 years of web development",
          "Completed several personal projects",
        ],
        extractedKeywords: [
          "junior",
          "learning",
          "personal",
          "projects",
          "bootcamp",
        ],
        uploadedAt: new Date().toISOString(),
      },
    ];

    return sampleResumes;
  }
}
