import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export interface FormQuestion {
  id: string;
  type: 'text' | 'email' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date';
  question: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
}

export interface GeneratedForm {
  title: string;
  description: string;
  questions: FormQuestion[];
  settings: {
    theme: string;
    submitButtonText: string;
    thankYouMessage: string;
  };
}

export interface AIAnalysis {
  insights: string[];
  recommendations: string[];
  completionRate: number;
  dropOffPoints: string[];
  optimizations: string[];
}

// AI Service for FormPulse
// Handles AI-powered form generation, question suggestions, and content analysis

interface AIFormRequest {
  type: 'text' | 'image' | 'pdf' | 'url' | 'story';
  content: string;
  formType?: 'survey' | 'quiz' | 'feedback' | 'registration' | 'assessment';
  tone?: 'professional' | 'casual' | 'friendly' | 'formal';
  length?: 'short' | 'medium' | 'long';
  language?: string;
}

interface AIFormResponse {
  title: string;
  description: string;
  questions: AIGeneratedQuestion[];
  settings: {
    estimatedTime: number;
    difficulty?: 'easy' | 'medium' | 'hard';
    category: string;
  };
}

interface AIGeneratedQuestion {
  id: string;
  type: 'text' | 'email' | 'textarea' | 'radio' | 'checkbox' | 'select' | 'number' | 'date' | 'rating' | 'file';
  question: string;
  description?: string;
  required: boolean;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  aiSuggestions?: {
    alternatives: string[];
    reasoning: string;
    improvementTips: string[];
  };
}

interface AISuggestion {
  type: 'question_improvement' | 'new_question' | 'form_optimization' | 'completion_boost';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  implementation: string;
  expectedImprovement?: string;
}

interface AIAnalysisRequest {
  formId: string;
  responses: any[];
  analysisType: 'sentiment' | 'patterns' | 'insights' | 'recommendations';
}

interface AIAnalysisResponse {
  summary: string;
  insights: AIInsight[];
  recommendations: AISuggestion[];
  sentiment?: {
    positive: number;
    neutral: number;
    negative: number;
    overall: 'positive' | 'neutral' | 'negative';
  };
  patterns?: {
    commonThemes: string[];
    outliers: string[];
    trends: string[];
  };
}

interface AIInsight {
  category: string;
  finding: string;
  confidence: number;
  dataPoints: number;
  async generateFormFromText(content: string, formType: string): Promise<GeneratedForm> {
    try {
      const prompt = `Create a form based on: ${content}. Type: ${formType}. Return JSON with title, description, questions array, and settings.`;
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse AI response and return structured form
      return this.parseFormResponse(text, formType);
    } catch (error) {
      console.error('Error generating form:', error);
      return this.getFallbackForm(formType);
    }
  }

  private parseFormResponse(text: string, formType: string): GeneratedForm {
    try {
      const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleanText);
    } catch {
      return this.getFallbackForm(formType);
    }
  }

  private getFallbackForm(formType: string): GeneratedForm {
    return {
      title: `${formType} Form`,
      description: 'AI-generated form based on your content',
      questions: [
        {
          id: '1',
          type: 'text',
          question: 'What is your name?',
          required: true,
          placeholder: 'Enter your full name'
        },
        {
          id: '2',
          type: 'email',
          question: 'What is your email address?',
          required: true,
          placeholder: 'Enter your email'
        }
      ],
      settings: {
        theme: 'modern',
        submitButtonText: 'Submit',
        thankYouMessage: 'Thank you for your submission!'
      }
    };
  }

  async generateQuestionsFromImage(imageData: string, questionCount: number = 5): Promise<FormQuestion[]> {
    try {
      const prompt = `
        Analyze this image and create ${questionCount} relevant form questions based on what you see.
        
        Return a JSON array of questions with this structure:
        [
          {
            "id": "unique_id",
            "type": "text|email|number|textarea|select|radio|checkbox",
            "question": "Question text",
            "required": true|false,
            "options": ["option1", "option2"] (if applicable),
            "placeholder": "placeholder text"
          }
        ]
        
        Make questions relevant to the image content. Only return valid JSON array.
      `;

      const result = await this.model.generateContent([
        prompt,
        {
          inlineData: {
            data: imageData,
            mimeType: "image/jpeg"
          }
        }
      ]);

      const response = await result.response;
      const text = response.text();
      const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleanText);
    } catch (error) {
      console.error('Error generating questions from image:', error);
      throw new Error('Failed to analyze image with AI');
    }
  }

  async generateBloomsQuiz(content: string, taxonomyLevel: string, questionCount: number = 5): Promise<FormQuestion[]> {
    try {
      const prompt = `
        Create a quiz based on Bloom's Taxonomy level: ${taxonomyLevel}
        
        Content: ${content}
        Number of questions: ${questionCount}
        
        Bloom's Taxonomy levels:
        - Remember: Recall facts and basic concepts
        - Understand: Explain ideas or concepts
        - Apply: Use information in new situations
        - Analyze: Draw connections among ideas
        - Evaluate: Justify a stand or decision
        - Create: Produce new or original work
        
        Generate questions appropriate for the ${taxonomyLevel} level.
        
        Return JSON array:
        [
          {
            "id": "unique_id",
            "type": "radio|checkbox|textarea",
            "question": "Question text",
            "required": true,
            "options": ["A) option1", "B) option2", "C) option3", "D) option4"] (for multiple choice)
          }
        ]
        
        Only return valid JSON array.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleanText);
    } catch (error) {
      console.error('Error generating Bloom\'s quiz:', error);
      throw new Error('Failed to generate Bloom\'s quiz with AI');
    }
  }

  async analyzeFormPerformance(formData: any, responseData: any[]): Promise<AIAnalysis> {
    try {
      const prompt = `
        Analyze this form performance data and provide insights:
        
        Form Data: ${JSON.stringify(formData)}
        Response Data: ${JSON.stringify(responseData.slice(0, 10))} (sample)
        Total Responses: ${responseData.length}
        
        Provide analysis in this JSON format:
        {
          "insights": ["insight1", "insight2", "insight3"],
          "recommendations": ["recommendation1", "recommendation2"],
          "completionRate": 85.5,
          "dropOffPoints": ["question_id_1", "question_id_2"],
          "optimizations": ["optimization1", "optimization2"]
        }
        
        Focus on completion rates, question effectiveness, and user experience improvements.
        Only return valid JSON.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleanText);
    } catch (error) {
      console.error('Error analyzing form performance:', error);
      throw new Error('Failed to analyze form performance with AI');
    }
  }

  async extractContentFromUrl(url: string): Promise<string> {
    try {
      const prompt = `
        I want to create a form based on content from this URL: ${url}
        
        Please provide a summary of what kind of content would typically be found at this URL
        and suggest what type of form would be appropriate.
        
        Return a brief description that can be used to generate form questions.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error extracting content from URL:', error);
      throw new Error('Failed to extract content from URL');
    }
  }

  async generateSimilarQuiz(referenceContent: string, difficulty: string = 'medium'): Promise<FormQuestion[]> {
    try {
      const prompt = `
        Create a quiz similar in style and difficulty to this reference content:
        
        Reference: ${referenceContent}
        Difficulty: ${difficulty}
        
        Generate 5-8 questions that match the style, format, and difficulty level.
        
        Return JSON array:
        [
          {
            "id": "unique_id",
            "type": "radio|checkbox|textarea|text",
            "question": "Question text",
            "required": true,
            "options": ["option1", "option2", "option3", "option4"] (if applicable)
          }
        ]
        
        Only return valid JSON array.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleanText);
    } catch (error) {
      console.error('Error generating similar quiz:', error);
      throw new Error('Failed to generate similar quiz with AI');
    }
  }

  async optimizeFormQuestions(questions: FormQuestion[], performanceData?: any): Promise<FormQuestion[]> {
    try {
      const prompt = `
        Optimize these form questions for better user experience and completion rates:
        
        Current Questions: ${JSON.stringify(questions)}
        Performance Data: ${performanceData ? JSON.stringify(performanceData) : 'No performance data available'}
        
        Improve question clarity, reduce friction, and enhance user experience.
        
        Return optimized questions in the same JSON format:
        [
          {
            "id": "unique_id",
            "type": "question_type",
            "question": "Improved question text",
            "required": true|false,
            "options": ["option1", "option2"] (if applicable),
            "placeholder": "helpful placeholder"
          }
        ]
        
        Only return valid JSON array.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleanText);
    } catch (error) {
      console.error('Error optimizing form questions:', error);
      throw new Error('Failed to optimize form questions with AI');
    }
  }
}

export const geminiService = new GeminiService(); 