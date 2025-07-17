# JD vs CV Matching Agent System

A comprehensive AI-powered resume matching system that ranks candidates against job descriptions using advanced NLP and skill extraction algorithms.

## 🚀 Features

- **Intelligent Matching**: Multi-factor scoring algorithm with skills, experience, and contextual analysis
- **File Upload**: Support for PDF and DOCX resume uploads with drag-and-drop interface
- **Real-time Processing**: Instant candidate ranking with detailed score breakdowns
- **Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS
- **Sample Data**: Pre-loaded examples to test the system immediately

## 📋 Prerequisites

- Node.js 18+ and npm
- Modern web browser

## 🛠️ Installation

1. **Clone or download this project**
2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to the provided local URL

## 🎯 How to Use

1. **Load Sample Data**: Click "Load Sample Data" to see the system in action
2. **Or Create Your Own**:
   - Enter job description details in the left panel
   - Upload resume files (PDF/DOCX) in the right panel
   - Click "Match Candidates" to see results

## 🏗️ Architecture

### Frontend Components

- `App.tsx` - Main application component
- `JobDescriptionForm.tsx` - Job description input form
- `FileUpload.tsx` - Resume upload component with progress tracking
- `MatchingResults.tsx` - Results display with candidate rankings

### Backend Services

- `textExtraction.ts` - PDF/DOCX text extraction utilities
- `skillExtraction.ts` - NLP-based skill and keyword extraction
- `matchingEngine.ts` - Core matching algorithm and scoring
- `mockMatchingService.ts` - Service layer for processing

### Types

- `matching.ts` - TypeScript interfaces for all data structures

## 🔧 Extending the System

### Real PDF/DOCX Processing

Replace the mock text extraction in `textExtraction.ts` with real libraries:

```bash
npm install pdf-parse mammoth
```

### OpenAI Integration

Add OpenAI for better skill extraction:

```bash
npm install openai
```

### Database Integration

Connect to Supabase or other databases for persistence:

```bash
npm install @supabase/supabase-js
```

## 📊 Scoring Algorithm

The system uses a weighted scoring approach:

- **Skills Match (50%)**: Percentage of required skills found in resume
- **Experience Score (30%)**: Relevance of background and experience level
- **Contextual Score (20%)**: Semantic similarity using keyword analysis

## 🎨 UI Features

- Responsive design for all screen sizes
- Drag-and-drop file uploads
- Real-time progress indicators
- Detailed candidate cards with score breakdowns
- Color-coded skill matching (matched/missing)
- AI-generated reasoning for each match

## 📝 Sample Data

The system includes realistic sample data:

- Senior Full Stack Developer job description
- 4 candidate profiles with varying skill levels
- Demonstrates different matching scenarios

## 🚀 Production Deployment

For production use:

1. Replace mock services with real implementations
2. Add proper error handling and validation
3. Implement user authentication
4. Add database persistence
5. Set up proper file storage (AWS S3, etc.)

## 🤝 Contributing

This is a demonstration system. For production use, consider:

- Real PDF/DOCX parsing libraries
- Advanced NLP models (spaCy, Transformers)
- Vector embeddings for semantic similarity
- Proper security and file validation
- Scalable backend architecture
