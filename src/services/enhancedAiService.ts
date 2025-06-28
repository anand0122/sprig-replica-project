import { aiService } from './aiService';

interface SentimentAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  emotions: {
    joy: number;
    anger: number;
    fear: number;
    sadness: number;
    surprise: number;
  };
  keywords: string[];
  themes: string[];
}

interface AutoGradingResult {
  score: number;
  maxScore: number;
  percentage: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  rubricScores: {
    criterion: string;
    score: number;
    maxScore: number;
    feedback: string;
  }[];
}

interface SmartFieldDetection {
  detectedType: 'text' | 'email' | 'phone' | 'date' | 'number' | 'url' | 'address' | 'name';
  confidence: number;
  suggestions: {
    validation: string;
    placeholder: string;
    helpText: string;
  };
}

interface ConversationalStep {
  id: string;
  type: 'question' | 'response' | 'branch' | 'summary';
  content: string;
  options?: string[];
  nextStepId?: string;
  conditions?: {
    answer: string;
    nextStepId: string;
  }[];
}

interface ConversationalForm {
  id: string;
  title: string;
  description: string;
  steps: ConversationalStep[];
  personality: 'professional' | 'friendly' | 'casual' | 'formal';
  avatar?: string;
  brandColor: string;
}

interface ResponseSummary {
  totalResponses: number;
  averageCompletionTime: number;
  keyInsights: string[];
  topAnswers: {
    question: string;
    answers: { value: string; count: number; percentage: number }[];
  }[];
  sentimentOverview: {
    positive: number;
    negative: number;
    neutral: number;
  };
  recommendations: string[];
}

class EnhancedAIService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
  }

  // LLM-based Answer Analysis
  async analyzeSentiment(text: string): Promise<SentimentAnalysis> {
    try {
      if (!this.apiKey) {
        return this.generateMockSentimentAnalysis(text);
      }

      const prompt = `
        Analyze the sentiment and extract insights from this text: "${text}"
        
        Provide a detailed analysis including:
        1. Overall sentiment (positive, negative, neutral) with confidence score
        2. Emotional breakdown (joy, anger, fear, sadness, surprise) as percentages
        3. Key themes and topics mentioned
        4. Important keywords
        
        Return as JSON with the specified structure.
      `;

      const response = await this.callAI(prompt);
      return this.parseSentimentResponse(response);
    } catch (error) {
      console.error('Sentiment analysis failed:', error);
      return this.generateMockSentimentAnalysis(text);
    }
  }

  // Auto-Grading for Open-Ended Questions
  async autoGradeResponse(
    question: string,
    answer: string,
    rubric: {
      criteria: {
        name: string;
        description: string;
        maxPoints: number;
      }[];
      totalPoints: number;
    }
  ): Promise<AutoGradingResult> {
    try {
      if (!this.apiKey) {
        return this.generateMockGradingResult(question, answer, rubric);
      }

      const prompt = `
        Grade this student response using the provided rubric:
        
        Question: "${question}"
        Student Answer: "${answer}"
        
        Rubric:
        ${rubric.criteria.map(c => `- ${c.name} (${c.maxPoints} points): ${c.description}`).join('\n')}
        Total Points: ${rubric.totalPoints}
        
        Provide:
        1. Score for each criterion with detailed feedback
        2. Overall score and percentage
        3. Constructive feedback highlighting strengths and areas for improvement
        4. Specific suggestions for improvement
        
        Be fair, constructive, and educational in your assessment.
      `;

      const response = await this.callAI(prompt);
      return this.parseGradingResponse(response);
    } catch (error) {
      console.error('Auto-grading failed:', error);
      return this.generateMockGradingResult(question, answer, rubric);
    }
  }

  // Smart Field Detection
  async detectFieldType(fieldDescription: string): Promise<SmartFieldDetection> {
    try {
      if (!this.apiKey) {
        return this.generateMockFieldDetection(fieldDescription);
      }

      const prompt = `
        Analyze this field description and determine the most appropriate input type:
        "${fieldDescription}"
        
        Consider:
        - What type of data is being requested
        - What validation would be appropriate
        - What placeholder text would be helpful
        - What help text would guide users
        
        Return the best field type and suggestions for implementation.
      `;

      const response = await this.callAI(prompt);
      return this.parseFieldDetectionResponse(response);
    } catch (error) {
      console.error('Field detection failed:', error);
      return this.generateMockFieldDetection(fieldDescription);
    }
  }

  // Conversational Forms
  async generateConversationalForm(
    description: string,
    personality: 'professional' | 'friendly' | 'casual' | 'formal' = 'friendly'
  ): Promise<ConversationalForm> {
    try {
      if (!this.apiKey) {
        return this.generateMockConversationalForm(description, personality);
      }

      const prompt = `
        Create a conversational form based on this description: "${description}"
        
        Personality: ${personality}
        
        Design a chat-like experience with:
        1. Welcome message
        2. Progressive questions that feel natural
        3. Conditional branching based on answers
        4. Encouraging responses and transitions
        5. Summary at the end
        
        Make it feel like talking to a ${personality} assistant, not filling out a form.
        Use appropriate tone, emojis (if casual/friendly), and natural language.
      `;

      const response = await this.callAI(prompt);
      return this.parseConversationalFormResponse(response);
    } catch (error) {
      console.error('Conversational form generation failed:', error);
      return this.generateMockConversationalForm(description, personality);
    }
  }

  // Response Summarization
  async summarizeResponses(responses: any[]): Promise<ResponseSummary> {
    try {
      if (!this.apiKey) {
        return this.generateMockResponseSummary(responses);
      }

      const prompt = `
        Analyze these form responses and provide insights:
        ${JSON.stringify(responses.slice(0, 50))} // Limit for API
        
        Provide:
        1. Key insights and patterns
        2. Top answers for each question
        3. Overall sentiment analysis
        4. Recommendations for form improvement
        5. Notable trends or outliers
        
        Focus on actionable insights that would help improve the form or understand the audience.
      `;

      const response = await this.callAI(prompt);
      return this.parseResponseSummaryResponse(response);
    } catch (error) {
      console.error('Response summarization failed:', error);
      return this.generateMockResponseSummary(responses);
    }
  }

  // Extract Keywords and Themes
  async extractKeywords(text: string): Promise<{
    keywords: { word: string; frequency: number; relevance: number }[];
    themes: { theme: string; confidence: number; keywords: string[] }[];
    categories: string[];
  }> {
    try {
      if (!this.apiKey) {
        return this.generateMockKeywordExtraction(text);
      }

      const prompt = `
        Extract keywords, themes, and categorize this text: "${text}"
        
        Provide:
        1. Important keywords with frequency and relevance scores
        2. Main themes with confidence levels
        3. Suggested categories or tags
        
        Focus on meaningful terms that provide insights into the content.
      `;

      const response = await this.callAI(prompt);
      return this.parseKeywordExtractionResponse(response);
    } catch (error) {
      console.error('Keyword extraction failed:', error);
      return this.generateMockKeywordExtraction(text);
    }
  }

  // Generate Follow-up Questions
  async generateFollowUpQuestions(
    originalQuestion: string,
    answer: string,
    context?: string
  ): Promise<{
    questions: string[];
    reasoning: string[];
    priority: 'high' | 'medium' | 'low';
  }> {
    try {
      if (!this.apiKey) {
        return this.generateMockFollowUpQuestions(originalQuestion, answer);
      }

      const prompt = `
        Based on this question and answer, suggest relevant follow-up questions:
        
        Original Question: "${originalQuestion}"
        User Answer: "${answer}"
        ${context ? `Context: ${context}` : ''}
        
        Generate 3-5 follow-up questions that would:
        1. Gather more specific information
        2. Clarify ambiguous points
        3. Explore related topics
        4. Provide deeper insights
        
        Explain the reasoning for each question and prioritize them.
      `;

      const response = await this.callAI(prompt);
      return this.parseFollowUpQuestionsResponse(response);
    } catch (error) {
      console.error('Follow-up question generation failed:', error);
      return this.generateMockFollowUpQuestions(originalQuestion, answer);
    }
  }

  // Private helper methods
  private async callAI(prompt: string): Promise<string> {
    // Implementation would call the actual AI API
    // For now, return mock response
    return 'Mock AI response';
  }

  private generateMockSentimentAnalysis(text: string): SentimentAnalysis {
    const wordCount = text.split(' ').length;
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'love', 'like', 'happy'];
    const negativeWords = ['bad', 'terrible', 'hate', 'dislike', 'awful', 'horrible'];
    
    const hasPositive = positiveWords.some(word => text.toLowerCase().includes(word));
    const hasNegative = negativeWords.some(word => text.toLowerCase().includes(word));
    
    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
    if (hasPositive && !hasNegative) sentiment = 'positive';
    else if (hasNegative && !hasPositive) sentiment = 'negative';

    return {
      sentiment,
      confidence: Math.random() * 0.3 + 0.7, // 0.7-1.0
      emotions: {
        joy: sentiment === 'positive' ? Math.random() * 0.5 + 0.3 : Math.random() * 0.3,
        anger: sentiment === 'negative' ? Math.random() * 0.5 + 0.3 : Math.random() * 0.2,
        fear: Math.random() * 0.2,
        sadness: sentiment === 'negative' ? Math.random() * 0.4 + 0.2 : Math.random() * 0.2,
        surprise: Math.random() * 0.3
      },
      keywords: text.split(' ').filter(word => word.length > 4).slice(0, 5),
      themes: ['user experience', 'product feedback', 'service quality']
    };
  }

  private generateMockGradingResult(question: string, answer: string, rubric: any): AutoGradingResult {
    const answerLength = answer.length;
    const baseScore = Math.min(answerLength / 100, 1) * 0.7 + Math.random() * 0.3;
    
    return {
      score: Math.round(baseScore * rubric.totalPoints),
      maxScore: rubric.totalPoints,
      percentage: Math.round(baseScore * 100),
      feedback: `Good effort on this response. Your answer demonstrates ${answerLength > 200 ? 'thorough' : 'basic'} understanding of the topic.`,
      strengths: [
        'Clear communication',
        'Relevant examples provided',
        'Good structure'
      ],
      improvements: [
        'Could provide more specific details',
        'Consider additional examples',
        'Expand on key concepts'
      ],
      rubricScores: rubric.criteria.map((criterion: any) => ({
        criterion: criterion.name,
        score: Math.round(baseScore * criterion.maxPoints),
        maxScore: criterion.maxPoints,
        feedback: `${criterion.name}: Shows good understanding with room for improvement.`
      }))
    };
  }

  private generateMockFieldDetection(description: string): SmartFieldDetection {
    const emailKeywords = ['email', 'e-mail', 'address', '@'];
    const phoneKeywords = ['phone', 'mobile', 'telephone', 'number'];
    const dateKeywords = ['date', 'birthday', 'when', 'time'];
    const urlKeywords = ['website', 'url', 'link', 'site'];
    
    const lowerDesc = description.toLowerCase();
    
    let detectedType: SmartFieldDetection['detectedType'] = 'text';
    let confidence = 0.5;
    
    if (emailKeywords.some(keyword => lowerDesc.includes(keyword))) {
      detectedType = 'email';
      confidence = 0.9;
    } else if (phoneKeywords.some(keyword => lowerDesc.includes(keyword))) {
      detectedType = 'phone';
      confidence = 0.85;
    } else if (dateKeywords.some(keyword => lowerDesc.includes(keyword))) {
      detectedType = 'date';
      confidence = 0.8;
    } else if (urlKeywords.some(keyword => lowerDesc.includes(keyword))) {
      detectedType = 'url';
      confidence = 0.9;
    }

    const suggestions = {
      email: {
        validation: '^[^@]+@[^@]+\\.[^@]+$',
        placeholder: 'your.email@example.com',
        helpText: 'We\'ll use this to contact you'
      },
      phone: {
        validation: '^[+]?[0-9\\s\\-\\(\\)]+$',
        placeholder: '+1 (555) 123-4567',
        helpText: 'Include country code if international'
      },
      date: {
        validation: '',
        placeholder: 'MM/DD/YYYY',
        helpText: 'Select a date from the calendar'
      },
      url: {
        validation: '^https?://.+',
        placeholder: 'https://example.com',
        helpText: 'Include http:// or https://'
      },
      text: {
        validation: '',
        placeholder: 'Enter your response',
        helpText: ''
      }
    };

    return {
      detectedType,
      confidence,
      suggestions: suggestions[detectedType] || suggestions.text
    };
  }

  private generateMockConversationalForm(description: string, personality: string): ConversationalForm {
    const greetings = {
      professional: 'Hello! I\'m here to help you with this form. Let\'s get started.',
      friendly: 'Hi there! 😊 I\'m excited to help you fill out this form. Ready to begin?',
      casual: 'Hey! Let\'s knock this form out together. It\'ll be quick, I promise!',
      formal: 'Good day. I shall assist you in completing this form. Shall we proceed?'
    };

    return {
      id: crypto.randomUUID(),
      title: 'Conversational Form',
      description,
      personality,
      brandColor: '#3b82f6',
      steps: [
        {
          id: 'welcome',
          type: 'response',
          content: greetings[personality],
          nextStepId: 'q1'
        },
        {
          id: 'q1',
          type: 'question',
          content: 'What\'s your name? I\'d love to personalize this experience for you.',
          nextStepId: 'q2'
        },
        {
          id: 'q2',
          type: 'question',
          content: 'Great to meet you! What brings you here today?',
          options: ['General inquiry', 'Product interest', 'Support needed', 'Other'],
          nextStepId: 'summary'
        },
        {
          id: 'summary',
          type: 'summary',
          content: 'Perfect! Let me summarize what we\'ve covered...'
        }
      ]
    };
  }

  private generateMockResponseSummary(responses: any[]): ResponseSummary {
    return {
      totalResponses: responses.length,
      averageCompletionTime: 180, // 3 minutes
      keyInsights: [
        'Most users complete the form in under 3 minutes',
        '85% of responses are positive',
        'Mobile users take 20% longer to complete',
        'Question 3 has the highest drop-off rate'
      ],
      topAnswers: [
        {
          question: 'How did you hear about us?',
          answers: [
            { value: 'Social Media', count: 45, percentage: 35 },
            { value: 'Google Search', count: 38, percentage: 30 },
            { value: 'Friend Referral', count: 25, percentage: 20 },
            { value: 'Advertisement', count: 19, percentage: 15 }
          ]
        }
      ],
      sentimentOverview: {
        positive: 65,
        negative: 15,
        neutral: 20
      },
      recommendations: [
        'Consider simplifying question 3 to reduce drop-offs',
        'Add more social media promotion based on high conversion',
        'Optimize mobile experience for faster completion',
        'Add progress indicators to improve completion rates'
      ]
    };
  }

  private generateMockKeywordExtraction(text: string) {
    const words = text.toLowerCase().split(/\W+/).filter(word => word.length > 3);
    const wordFreq = words.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const keywords = Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word, frequency]) => ({
        word,
        frequency,
        relevance: Math.random() * 0.5 + 0.5
      }));

    return {
      keywords,
      themes: [
        { theme: 'user experience', confidence: 0.8, keywords: ['experience', 'user', 'interface'] },
        { theme: 'product feedback', confidence: 0.7, keywords: ['product', 'feature', 'quality'] },
        { theme: 'service quality', confidence: 0.6, keywords: ['service', 'support', 'help'] }
      ],
      categories: ['feedback', 'product', 'experience', 'quality']
    };
  }

  private generateMockFollowUpQuestions(originalQuestion: string, answer: string) {
    return {
      questions: [
        'Can you provide more specific details about that?',
        'What factors influenced this choice?',
        'How does this compare to your previous experience?',
        'What would make this even better?'
      ],
      reasoning: [
        'To gather more specific information',
        'To understand decision-making process',
        'To provide context and comparison',
        'To identify improvement opportunities'
      ],
      priority: 'medium' as const
    };
  }

  // Parse response methods (would implement actual parsing in production)
  private parseSentimentResponse(response: string): SentimentAnalysis {
    // Implementation would parse actual AI response
    return this.generateMockSentimentAnalysis('sample text');
  }

  private parseGradingResponse(response: string): AutoGradingResult {
    // Implementation would parse actual AI response
    return this.generateMockGradingResult('', '', { totalPoints: 100, criteria: [] });
  }

  private parseFieldDetectionResponse(response: string): SmartFieldDetection {
    // Implementation would parse actual AI response
    return this.generateMockFieldDetection('sample field');
  }

  private parseConversationalFormResponse(response: string): ConversationalForm {
    // Implementation would parse actual AI response
    return this.generateMockConversationalForm('sample', 'friendly');
  }

  private parseResponseSummaryResponse(response: string): ResponseSummary {
    // Implementation would parse actual AI response
    return this.generateMockResponseSummary([]);
  }

  private parseKeywordExtractionResponse(response: string) {
    // Implementation would parse actual AI response
    return this.generateMockKeywordExtraction('sample text');
  }

  private parseFollowUpQuestionsResponse(response: string) {
    // Implementation would parse actual AI response
    return this.generateMockFollowUpQuestions('', '');
  }
}

// Export singleton instance
export const enhancedAiService = new EnhancedAIService();

export type {
  SentimentAnalysis,
  AutoGradingResult,
  SmartFieldDetection,
  ConversationalForm,
  ConversationalStep,
  ResponseSummary
}; 