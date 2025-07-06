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

// Form question type for FormBuilder compatibility
export interface FormQuestion {
  id: string;
  type: 'short-answer' | 'paragraph' | 'multiple-choice' | 'checkboxes' | 'dropdown' | 'email' | 'number' | 'date' | 'time' | 'file-upload' | 'rating' | 'linear-scale';
  question: string;
  required: boolean;
  placeholder?: string;
  description?: string;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  gridRows?: string[];
  gridColumns?: string[];
  scaleMin?: number;
  scaleMax?: number;
  scaleMinLabel?: string;
  scaleMaxLabel?: string;
}

// Generated form type for FormBuilder compatibility
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
  actionable: boolean;
}

export const FORM_TEMPLATES = {
  'student-registration': {
    title: 'Student Registration Form',
    description: 'Collect student information for enrollment and class assignments',
    questions: [
      {
        id: 'name',
        type: 'short-answer',
        question: 'Full Name',
        required: true,
        placeholder: 'Enter your full name',
        description: 'Please enter your legal full name as it appears on official documents'
      },
      {
        id: 'email',
        type: 'email',
        question: 'Email Address',
        required: true,
        placeholder: 'Enter your email address',
        description: 'We will use this email for all communications'
      },
      {
        id: 'dob',
        type: 'date',
        question: 'Date of Birth',
        required: true,
        description: 'Must be at least 16 years old to register'
      },
      {
        id: 'grade',
        type: 'multiple-choice',
        question: 'Grade Level',
        required: true,
        options: ['Freshman', 'Sophomore', 'Junior', 'Senior']
      },
      {
        id: 'comments',
        type: 'paragraph',
        question: 'Additional Comments',
        required: false,
        placeholder: 'Any additional information you would like to share',
        description: 'Optional: Include any special requirements or notes'
      }
    ],
    settings: {
      theme: 'educational',
      submitButtonText: 'Submit Registration',
      thankYouMessage: 'Thank you for registering! We will review your information and contact you soon.'
    }
  }
};

class AIService {
  private apiKey: string;
  private baseUrl: string;
  private model: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY || '';
    this.baseUrl = import.meta.env.VITE_AI_API_URL || 'https://api.openai.com/v1';
    this.model = import.meta.env.VITE_AI_MODEL || 'gpt-3.5-turbo';
  }

  // Generate form from various inputs
  async generateForm(request: AIFormRequest): Promise<AIFormResponse> {
    try {
      if (!this.apiKey) {
        return this.generateMockForm(request);
      }

      const prompt = this.buildFormGenerationPrompt(request);
      const response = await this.callAI(prompt);
      
      return this.parseFormResponse(response);
    } catch (error) {
      console.error('AI form generation failed:', error);
      return this.generateMockForm(request);
    }
  }

  // Generate questions based on existing form context
  async suggestQuestions(formContext: {
    title: string;
    description?: string;
    existingQuestions: any[];
    formType?: string;
  }): Promise<AIGeneratedQuestion[]> {
    try {
      if (!this.apiKey) {
        return this.generateMockQuestions(formContext);
      }

      const prompt = this.buildQuestionSuggestionPrompt(formContext);
      const response = await this.callAI(prompt);
      
      return this.parseQuestionsResponse(response);
    } catch (error) {
      console.error('AI question suggestion failed:', error);
      return this.generateMockQuestions(formContext);
    }
  }

  // Improve existing questions
  async improveQuestion(question: string, context?: string): Promise<{
    improvedQuestion: string;
    suggestions: string[];
    reasoning: string;
  }> {
    try {
      if (!this.apiKey) {
        return this.generateMockImprovement(question);
      }

      const prompt = this.buildQuestionImprovementPrompt(question, context);
      const response = await this.callAI(prompt);
      
      return this.parseImprovementResponse(response);
    } catch (error) {
      console.error('AI question improvement failed:', error);
      return this.generateMockImprovement(question);
    }
  }

  // Analyze form responses for insights
  async analyzeResponses(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
    try {
      if (!this.apiKey) {
        return this.generateMockAnalysis(request);
      }

      const prompt = this.buildAnalysisPrompt(request);
      const response = await this.callAI(prompt);
      
      return this.parseAnalysisResponse(response);
    } catch (error) {
      console.error('AI analysis failed:', error);
      return this.generateMockAnalysis(request);
    }
  }

  // Get form optimization suggestions
  async getOptimizationSuggestions(formData: {
    questions: any[];
    analytics: any;
    responses?: any[];
  }): Promise<AISuggestion[]> {
    try {
      if (!this.apiKey) {
        return this.generateMockOptimizations(formData);
      }

      const prompt = this.buildOptimizationPrompt(formData);
      const response = await this.callAI(prompt);
      
      return this.parseOptimizationResponse(response);
    } catch (error) {
      console.error('AI optimization failed:', error);
      return this.generateMockOptimizations(formData);
    }
  }

  // Generate Bloom's Taxonomy based quiz
  async generateBloomsQuiz(content: string, options: {
    taxonomyLevel: string;
    difficulty: string;
    questionCount: number;
  }): Promise<GeneratedForm> {
    try {
      if (!this.apiKey) {
        return this.generateMockBloomsQuiz(content, options);
      }

      const prompt = this.buildBloomsQuizPrompt(content, options);
      const response = await this.callAI(prompt);
      
      return this.parseGeneratedFormResponse(response);
    } catch (error) {
      console.error('Blooms quiz generation failed:', error);
      return this.generateMockBloomsQuiz(content, options);
    }
  }

  // Generate questions from image
  async generateQuestionsFromImage(imageData: string): Promise<GeneratedForm> {
    try {
      if (!this.apiKey) {
        return this.generateMockImageQuiz();
      }

      const prompt = this.buildImageQuizPrompt(imageData);
      const response = await this.callAI(prompt);
      
      return this.parseGeneratedFormResponse(response);
    } catch (error) {
      console.error('Image quiz generation failed:', error);
      return this.generateMockImageQuiz();
    }
  }

  // Extract content from URL
  async extractContentFromUrl(url: string): Promise<string> {
    try {
      // Mock implementation - in real app, this would scrape the URL
      return `Content extracted from ${url}`;
    } catch (error) {
      console.error('URL content extraction failed:', error);
      return 'Failed to extract content from URL';
    }
  }

  // Generate form from text content
  async generateFormFromText(content: string, options?: {
    formType?: string;
    questionCount?: number;
    difficulty?: string;
  }): Promise<GeneratedForm> {
    try {
      if (!this.apiKey) {
        return this.generateMockTextForm(content, options);
      }

      const prompt = this.buildTextFormPrompt(content, options);
      const response = await this.callAI(prompt);
      
      return this.parseGeneratedFormResponse(response);
    } catch (error) {
      console.error('Text form generation failed:', error);
      return this.generateMockTextForm(content, options);
    }
  }

  // Generate similar quiz
  async generateSimilarQuiz(referenceQuiz: any): Promise<GeneratedForm> {
    try {
      if (!this.apiKey) {
        return this.generateMockSimilarQuiz(referenceQuiz);
      }

      const prompt = this.buildSimilarQuizPrompt(referenceQuiz);
      const response = await this.callAI(prompt);
      
      return this.parseGeneratedFormResponse(response);
    } catch (error) {
      console.error('Similar quiz generation failed:', error);
      return this.generateMockSimilarQuiz(referenceQuiz);
    }
  }

  // Analyze form performance for insights
  async analyzeFormPerformance(formAnalytics: any, conversionFunnel: any[]): Promise<any> {
    try {
      if (!this.apiKey) {
        return this.generateMockPerformanceAnalysis(formAnalytics, conversionFunnel);
      }

      const prompt = this.buildPerformanceAnalysisPrompt(formAnalytics, conversionFunnel);
      const response = await this.callAI(prompt);
      
      return this.parsePerformanceAnalysisResponse(response);
    } catch (error) {
      console.error('Performance analysis failed:', error);
      return this.generateMockPerformanceAnalysis(formAnalytics, conversionFunnel);
    }
  }

  // Private methods for AI API calls
  private async callAI(prompt: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert form designer and UX researcher. Provide helpful, actionable suggestions for creating effective forms and surveys.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`AI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  // Prompt builders
  private buildFormGenerationPrompt(request: AIFormRequest): string {
    return `Create a ${request.formType || 'form'} based on the following ${request.type}:

Content: ${request.content}

Requirements:
- Tone: ${request.tone || 'professional'}
- Length: ${request.length || 'medium'} (${request.length === 'short' ? '3-5' : request.length === 'long' ? '10-15' : '6-9'} questions)
- Language: ${request.language || 'English'}

Please provide a JSON response with:
1. title: A compelling form title
2. description: Brief form description
3. questions: Array of question objects with type, question text, required flag, and options if applicable
4. settings: estimated completion time and category

Focus on user experience, clear language, and logical flow.`;
  }

  private buildQuestionSuggestionPrompt(formContext: any): string {
    return `Based on this form context, suggest 3-5 additional relevant questions:

Form Title: ${formContext.title}
Description: ${formContext.description || 'N/A'}
Form Type: ${formContext.formType || 'general'}
Existing Questions: ${formContext.existingQuestions.map((q: any) => q.question).join(', ')}

Provide questions that:
1. Complement existing questions
2. Fill information gaps
3. Improve data quality
4. Enhance user engagement

Return as JSON array of question objects.`;
  }

  private buildQuestionImprovementPrompt(question: string, context?: string): string {
    return `Improve this form question for better clarity, engagement, and response quality:

Question: "${question}"
Context: ${context || 'General form question'}

Provide:
1. An improved version of the question
2. 2-3 alternative phrasings
3. Reasoning for improvements
4. Tips for better responses

Focus on clarity, bias reduction, and user-friendly language.`;
  }

  private buildAnalysisPrompt(request: AIAnalysisRequest): string {
    const sampleResponses = request.responses.slice(0, 10); // Limit for API
    
    return `Analyze these form responses for ${request.analysisType}:

Responses: ${JSON.stringify(sampleResponses)}
Total Responses: ${request.responses.length}

Provide insights on:
1. Common patterns and themes
2. Response quality and completeness
3. User sentiment (if applicable)
4. Actionable recommendations
5. Areas for improvement

Return structured analysis with confidence scores.`;
  }

  private buildOptimizationPrompt(formData: any): string {
    return `Analyze this form for optimization opportunities:

Questions: ${JSON.stringify(formData.questions)}
Analytics: ${JSON.stringify(formData.analytics)}

Suggest improvements for:
1. Completion rates
2. Response quality
3. User experience
4. Data collection effectiveness
5. Question flow and logic

Prioritize suggestions by impact and ease of implementation.`;
  }

  // Response parsers
  private parseFormResponse(response: string): AIFormResponse {
    try {
      const parsed = JSON.parse(response);
      return {
        title: parsed.title || 'AI Generated Form',
        description: parsed.description || 'Form created with AI assistance',
        questions: parsed.questions?.map((q: any, index: number) => ({
          id: crypto.randomUUID(),
          type: q.type || 'text',
          question: q.question || q.text,
          description: q.description,
          required: q.required ?? true,
          options: q.options,
          validation: q.validation,
          aiSuggestions: {
            alternatives: [],
            reasoning: 'AI generated question',
            improvementTips: []
          }
        })) || [],
        settings: {
          estimatedTime: parsed.settings?.estimatedTime || 5,
          difficulty: parsed.settings?.difficulty || 'medium',
          category: parsed.settings?.category || 'general'
        }
      };
    } catch (error) {
      throw new Error('Failed to parse AI response');
    }
  }

  private parseQuestionsResponse(response: string): AIGeneratedQuestion[] {
    try {
      const parsed = JSON.parse(response);
      return (parsed.questions || parsed).map((q: any) => ({
        id: crypto.randomUUID(),
        type: q.type || 'text',
        question: q.question,
        description: q.description,
        required: q.required ?? true,
        options: q.options,
        validation: q.validation,
        aiSuggestions: {
          alternatives: q.alternatives || [],
          reasoning: q.reasoning || 'AI suggested question',
          improvementTips: q.tips || []
        }
      }));
    } catch (error) {
      throw new Error('Failed to parse questions response');
    }
  }

  private parseImprovementResponse(response: string): any {
    try {
      const parsed = JSON.parse(response);
      return {
        improvedQuestion: parsed.improved || parsed.improvedQuestion,
        suggestions: parsed.alternatives || parsed.suggestions || [],
        reasoning: parsed.reasoning || 'AI improvement suggestions'
      };
    } catch (error) {
      throw new Error('Failed to parse improvement response');
    }
  }

  private parseAnalysisResponse(response: string): AIAnalysisResponse {
    try {
      const parsed = JSON.parse(response);
      return {
        summary: parsed.summary || 'Analysis completed',
        insights: parsed.insights || [],
        recommendations: parsed.recommendations || [],
        sentiment: parsed.sentiment,
        patterns: parsed.patterns
      };
    } catch (error) {
      throw new Error('Failed to parse analysis response');
    }
  }

  private parseOptimizationResponse(response: string): AISuggestion[] {
    try {
      const parsed = JSON.parse(response);
      return (parsed.suggestions || parsed).map((s: any) => ({
        type: s.type || 'form_optimization',
        title: s.title,
        description: s.description,
        impact: s.impact || 'medium',
        implementation: s.implementation,
        expectedImprovement: s.expectedImprovement
      }));
    } catch (error) {
      throw new Error('Failed to parse optimization response');
    }
  }

  // Mock data generators for when AI is not available
  private generateMockForm(request: AIFormRequest): AIFormResponse {
    const mockQuestions: AIGeneratedQuestion[] = [
      {
        id: crypto.randomUUID(),
        type: 'text',
        question: 'What is your name?',
        required: true,
        aiSuggestions: {
          alternatives: ['What should we call you?', 'Please enter your full name'],
          reasoning: 'Personal identification helps personalize the experience',
          improvementTips: ['Consider making this optional for anonymous feedback']
        }
      },
      {
        id: crypto.randomUUID(),
        type: 'email',
        question: 'What is your email address?',
        description: 'We\'ll use this to send you updates',
        required: true,
        validation: {
          pattern: '^[^@]+@[^@]+\\.[^@]+$',
          message: 'Please enter a valid email address'
        },
        aiSuggestions: {
          alternatives: ['Please provide your email', 'Enter your email for updates'],
          reasoning: 'Email collection enables follow-up communication',
          improvementTips: ['Explain why email is needed', 'Consider making optional']
        }
      },
      {
        id: crypto.randomUUID(),
        type: 'rating',
        question: 'How would you rate your overall experience?',
        required: true,
        validation: { min: 1, max: 5 },
        aiSuggestions: {
          alternatives: ['Rate your satisfaction level', 'How satisfied are you?'],
          reasoning: 'Rating scales provide quantifiable feedback',
          improvementTips: ['Add labels to rating scale', 'Consider 1-10 scale for more granularity']
        }
      }
    ];

    if (request.formType === 'quiz') {
      mockQuestions.push({
        id: crypto.randomUUID(),
        type: 'radio',
        question: 'Which of the following is correct?',
        required: true,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        aiSuggestions: {
          alternatives: ['Select the correct answer', 'Choose the best option'],
          reasoning: 'Multiple choice questions are effective for knowledge testing',
          improvementTips: ['Ensure one clearly correct answer', 'Avoid trick questions']
        }
      });
    }

    return {
      title: `${request.formType || 'Form'} Generated by AI`,
      description: `This ${request.formType || 'form'} was created based on your ${request.type} input using AI assistance.`,
      questions: mockQuestions,
      settings: {
        estimatedTime: mockQuestions.length * 1.5,
        difficulty: 'medium',
        category: request.formType || 'general'
      }
    };
  }

  private generateMockQuestions(formContext: any): AIGeneratedQuestion[] {
    return [
      {
        id: crypto.randomUUID(),
        type: 'textarea',
        question: 'What additional feedback would you like to share?',
        description: 'Please provide any other thoughts or suggestions',
        required: false,
        aiSuggestions: {
          alternatives: ['Any other comments?', 'Additional thoughts or suggestions?'],
          reasoning: 'Open-ended questions capture valuable qualitative feedback',
          improvementTips: ['Provide examples of helpful feedback', 'Consider character limits']
        }
      },
      {
        id: crypto.randomUUID(),
        type: 'checkbox',
        question: 'Which topics interest you most? (Select all that apply)',
        required: false,
        options: ['Technology', 'Business', 'Health', 'Education', 'Entertainment'],
        aiSuggestions: {
          alternatives: ['What are your areas of interest?', 'Select your preferred topics'],
          reasoning: 'Multiple selection allows for detailed preference mapping',
          improvementTips: ['Limit options to prevent overwhelming users', 'Consider "Other" option']
        }
      }
    ];
  }

  private generateMockImprovement(question: string): any {
    return {
      improvedQuestion: `${question} (Please be specific and detailed)`,
      suggestions: [
        'Add context or examples to clarify expectations',
        'Consider breaking into multiple questions if complex',
        'Use simpler language for better accessibility'
      ],
      reasoning: 'The improved version provides clearer guidance and encourages more detailed responses'
    };
  }

  private generateMockAnalysis(request: AIAnalysisRequest): AIAnalysisResponse {
    return {
      summary: `Analysis of ${request.responses.length} responses reveals generally positive feedback with some areas for improvement.`,
      insights: [
        {
          category: 'Response Quality',
          finding: 'Most responses are complete and thoughtful',
          confidence: 0.85,
          dataPoints: request.responses.length,
          actionable: true
        },
        {
          category: 'User Sentiment',
          finding: 'Overall sentiment is positive with constructive feedback',
          confidence: 0.78,
          dataPoints: Math.floor(request.responses.length * 0.8),
          actionable: false
        }
      ],
      recommendations: [
        {
          type: 'form_optimization',
          title: 'Add progress indicator',
          description: 'Users would benefit from seeing their progress through the form',
          impact: 'medium',
          implementation: 'Add progress bar component',
          expectedImprovement: '15% increase in completion rate'
        }
      ],
      sentiment: {
        positive: 0.65,
        neutral: 0.25,
        negative: 0.10,
        overall: 'positive'
      },
      patterns: {
        commonThemes: ['User experience', 'Feature requests', 'Performance feedback'],
        outliers: ['Unusual technical issues', 'Extreme satisfaction ratings'],
        trends: ['Increasing satisfaction over time', 'More detailed feedback in recent responses']
      }
    };
  }

  private generateMockOptimizations(formData: any): AISuggestion[] {
    return [
      {
        type: 'completion_boost',
        title: 'Reduce form length',
        description: 'Consider removing non-essential questions to improve completion rates',
        impact: 'high',
        implementation: 'Review each question for necessity and combine where possible',
        expectedImprovement: '25% increase in completion rate'
      },
      {
        type: 'question_improvement',
        title: 'Add question descriptions',
        description: 'Provide context for complex questions to reduce confusion',
        impact: 'medium',
        implementation: 'Add helpful descriptions to questions that might be unclear',
        expectedImprovement: '10% improvement in response quality'
      },
      {
        type: 'form_optimization',
        title: 'Implement conditional logic',
        description: 'Show/hide questions based on previous answers to create personalized experience',
        impact: 'high',
        implementation: 'Add conditional logic to relevant question pairs',
        expectedImprovement: '20% better user experience'
      }
    ];
  }

  // Additional helper methods for new AI features
  private buildBloomsQuizPrompt(content: string, options: any): string {
    return `Generate a quiz based on Bloom's Taxonomy level: ${options.taxonomyLevel}. Content: ${content}. Difficulty: ${options.difficulty}. Generate ${options.questionCount} questions.`;
  }

  private buildImageQuizPrompt(imageData: string): string {
    return `Analyze this image and generate relevant quiz questions: ${imageData}`;
  }

  private buildTextFormPrompt(content: string, options?: any): string {
    return `Generate a form based on this content: ${content}. Type: ${options?.formType || 'general'}. Questions: ${options?.questionCount || 5}`;
  }

  private buildSimilarQuizPrompt(referenceQuiz: any): string {
    return `Generate a similar quiz based on this reference: ${JSON.stringify(referenceQuiz)}`;
  }

  private buildPerformanceAnalysisPrompt(formAnalytics: any, conversionFunnel: any[]): string {
    return `Analyze form performance data: ${JSON.stringify(formAnalytics)}. Conversion funnel: ${JSON.stringify(conversionFunnel)}. Provide insights and recommendations.`;
  }

  private parseGeneratedFormResponse(response: string): GeneratedForm {
    // Mock parsing for now
    return {
      title: 'AI Generated Form',
      description: 'Generated by AI based on your input',
      questions: [
        {
          id: crypto.randomUUID(),
          type: 'short-answer',
          question: 'Sample question from AI',
          required: true
        }
      ],
      settings: {
        theme: 'modern',
        submitButtonText: 'Submit',
        thankYouMessage: 'Thank you for your submission!'
      }
    };
  }

  private generateMockBloomsQuiz(content: string, options: any): GeneratedForm {
    return {
      title: `${options.taxonomyLevel} Level Quiz`,
      description: `Quiz based on Bloom's Taxonomy - ${options.taxonomyLevel} level`,
      questions: [
        {
          id: crypto.randomUUID(),
          type: 'multiple-choice',
          question: `Based on the content, which statement demonstrates ${options.taxonomyLevel}?`,
          required: true,
          options: ['Option A', 'Option B', 'Option C', 'Option D']
        }
      ],
      settings: {
        theme: 'educational',
        submitButtonText: 'Submit Quiz',
        thankYouMessage: 'Quiz completed!'
      }
    };
  }

  private generateMockImageQuiz(): GeneratedForm {
    return {
      title: 'Image-Based Quiz',
      description: 'Quiz generated from image analysis',
      questions: [
        {
          id: crypto.randomUUID(),
          type: 'multiple-choice',
          question: 'What is the main subject of the image?',
          required: true,
          options: ['Person', 'Object', 'Landscape', 'Abstract']
        }
      ],
      settings: {
        theme: 'visual',
        submitButtonText: 'Submit',
        thankYouMessage: 'Thank you!'
      }
    };
  }

  private generateMockTextForm(content: string, options?: any): GeneratedForm {
    return {
      title: 'Text-Based Form',
      description: 'Form generated from text content',
      questions: [
        {
          id: crypto.randomUUID(),
          type: 'short-answer',
          question: 'What is your main takeaway from the content?',
          required: true
        }
      ],
      settings: {
        theme: 'modern',
        submitButtonText: 'Submit',
        thankYouMessage: 'Thank you for your response!'
      }
    };
  }

  private generateMockSimilarQuiz(referenceQuiz: any): GeneratedForm {
    return {
      title: 'Similar Quiz',
      description: 'Quiz similar to the reference provided',
      questions: [
        {
          id: crypto.randomUUID(),
          type: 'multiple-choice',
          question: 'Similar question to the reference quiz',
          required: true,
          options: ['Option A', 'Option B', 'Option C', 'Option D']
        }
      ],
      settings: {
        theme: 'modern',
        submitButtonText: 'Submit',
        thankYouMessage: 'Quiz completed!'
      }
    };
  }

  private generateMockPerformanceAnalysis(formAnalytics: any, conversionFunnel: any[]): any {
    return {
      insights: [
        'Your form has a strong completion rate of 71.5%, which is above industry average',
        'Mobile users show 15% higher engagement than desktop users',
        'Most drop-offs occur at question 3, suggesting it may be too complex',
        'Peak submission times are between 12-3 PM, indicating lunch break usage'
      ],
      recommendations: [
        {
          type: 'form_optimization',
          title: 'Simplify Question 3',
          description: 'Consider breaking down complex questions into smaller parts',
          impact: 'high',
          expectedImprovement: '10-15% increase in completion rate'
        },
        {
          type: 'completion_boost',
          title: 'Add Progress Indicator',
          description: 'Show users how far they are in the form',
          impact: 'medium',
          expectedImprovement: '5-8% increase in completion rate'
        },
        {
          type: 'question_improvement',
          title: 'Optimize for Mobile',
          description: 'Improve mobile experience with larger touch targets',
          impact: 'medium',
          expectedImprovement: '12% better mobile conversion'
        }
      ],
      performanceScore: 78,
      benchmarkComparison: {
        completionRate: { your: 71.5, industry: 65.2, status: 'above' },
        averageTime: { your: 3.2, industry: 4.1, status: 'below' },
        dropoffRate: { your: 28.5, industry: 34.8, status: 'below' }
      }
    };
  }

  private parsePerformanceAnalysisResponse(response: string): any {
    try {
      const parsed = JSON.parse(response);
      return {
        insights: parsed.insights || [],
        recommendations: parsed.recommendations || [],
        performanceScore: parsed.performanceScore || 75,
        benchmarkComparison: parsed.benchmarkComparison || {}
      };
    } catch (error) {
      throw new Error('Failed to parse performance analysis response');
    }
  }

  getFormTemplate(templateId: string): GeneratedForm | null {
    const template = FORM_TEMPLATES[templateId as keyof typeof FORM_TEMPLATES];
    if (!template) return null;

    return {
      ...template,
      questions: template.questions.map(q => ({
        ...q,
        id: `question_${Date.now()}_${Math.random()}`
      }))
    };
  }
}

// Export singleton instance
export const aiService = new AIService();
export type {
  AIFormRequest,
  AIFormResponse,
  AIGeneratedQuestion,
  AISuggestion,
  AIAnalysisRequest,
  AIAnalysisResponse,
  AIInsight
}; 