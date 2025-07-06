import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

interface FormGenerationOptions {
  prompt: string;
  formType: string;
  language: string;
  style: string;
  userId: string;
}

interface QuestionSuggestionOptions {
  topic: string;
  questionType: string;
  count: number;
  audience?: string;
  purpose?: string;
  userId: string;
}

interface ResponseAnalysisOptions {
  formId: string;
  analysisType: string;
  includePersonalData: boolean;
  userId: string;
}

interface FormOptimizationOptions {
  formId: string;
  optimizationGoals: string[];
  targetAudience?: string;
  userId: string;
}

class AIService {
  private async trackAIUsage(userId: string, operation: string, tokensUsed: number, model: string) {
    try {
      // Track AI usage for billing and analytics
      await prisma.analytics.create({
        data: {
          userId,
          formId: 'ai-usage', // Special form ID for AI usage
          metric: 'ai_tokens_used',
          value: tokensUsed,
          dimensions: {
            operation,
            model,
            timestamp: new Date().toISOString()
          },
          date: new Date(),
          period: 'DAILY'
        }
      });
    } catch (error) {
      logger.error('Failed to track AI usage:', error);
    }
  }

  async generateFormFromPrompt(options: FormGenerationOptions) {
    try {
      const { prompt, formType, language, style, userId } = options;

      const systemPrompt = `You are an expert form builder AI. Generate a comprehensive form based on the user's requirements.

Rules:
1. Return only valid JSON with the structure: { "title": string, "description": string, "fields": array, "settings": object, "design": object }
2. Each field must have: id, type, label, required, placeholder (optional), options (for select/radio/checkbox)
3. Supported field types: text, email, tel, url, number, textarea, select, radio, checkbox, rating, date, time, file
4. For ${formType} forms, include appropriate field types and validation
5. Use ${language} language for all text
6. Apply ${style} styling preferences
7. Include 5-15 relevant fields
8. Add appropriate validation rules
9. Include helpful placeholder text
10. For quiz forms, add correctAnswer property to relevant fields

Generate a professional, user-friendly form that matches the requirements.`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Create a ${formType} form: ${prompt}` }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      const generatedContent = completion.choices[0].message.content;
      if (!generatedContent) {
        throw new Error('No content generated from AI');
      }

      // Parse the JSON response
      const formData = JSON.parse(generatedContent);

      // Add metadata
      formData.metadata = {
        tokensUsed: completion.usage?.total_tokens || 0,
        model: 'gpt-4-turbo-preview',
        generatedAt: new Date().toISOString(),
        generationType: 'prompt'
      };

      // Track usage
      await this.trackAIUsage(userId, 'form_generation', completion.usage?.total_tokens || 0, 'gpt-4-turbo-preview');

      logger.info(`Form generated from prompt for user: ${userId}`, {
        tokensUsed: completion.usage?.total_tokens,
        fieldsGenerated: formData.fields?.length
      });

      return formData;
    } catch (error) {
      logger.error('Form generation from prompt failed:', error);
      throw new Error('Failed to generate form from prompt');
    }
  }

  async generateFormFromImage(options: { imageUrl: string; additionalContext?: string; userId: string }) {
    try {
      const { imageUrl, additionalContext, userId } = options;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this image and create a form based on what you see. ${additionalContext || ''} 
                
                Return only valid JSON with this structure:
                {
                  "title": "Form Title",
                  "description": "Form Description", 
                  "fields": [
                    {
                      "id": "field_id",
                      "type": "text|email|select|etc",
                      "label": "Field Label",
                      "required": true|false,
                      "placeholder": "Placeholder text",
                      "options": ["option1", "option2"] // for select/radio/checkbox only
                    }
                  ],
                  "settings": {},
                  "design": {}
                }`
              },
              {
                type: 'image_url',
                image_url: { url: imageUrl }
              }
            ]
          }
        ],
        max_tokens: 2000
      });

      const generatedContent = completion.choices[0].message.content;
      if (!generatedContent) {
        throw new Error('No content generated from image');
      }

      const formData = JSON.parse(generatedContent);
      formData.metadata = {
        tokensUsed: completion.usage?.total_tokens || 0,
        model: 'gpt-4-vision-preview',
        generatedAt: new Date().toISOString(),
        generationType: 'image',
        sourceImage: imageUrl
      };

      await this.trackAIUsage(userId, 'form_generation_image', completion.usage?.total_tokens || 0, 'gpt-4-vision-preview');

      return formData;
    } catch (error) {
      logger.error('Form generation from image failed:', error);
      throw new Error('Failed to generate form from image');
    }
  }

  async generateFormFromPdf(options: { pdfUrl: string; extractionType: string; userId: string }) {
    try {
      const { pdfUrl, extractionType, userId } = options;

      // Note: This would require PDF parsing. For now, we'll simulate with a prompt
      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: `You are extracting form fields from a PDF document. Create a ${extractionType} form based on the document structure.`
          },
          {
            role: 'user',
            content: `Extract form fields from this PDF: ${pdfUrl}. Create appropriate form fields that would capture the same information as the PDF form.`
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      });

      const generatedContent = completion.choices[0].message.content;
      if (!generatedContent) {
        throw new Error('No content generated from PDF');
      }

      const formData = JSON.parse(generatedContent);
      formData.metadata = {
        tokensUsed: completion.usage?.total_tokens || 0,
        model: 'gpt-4-turbo-preview',
        generatedAt: new Date().toISOString(),
        generationType: 'pdf',
        sourcePdf: pdfUrl
      };

      await this.trackAIUsage(userId, 'form_generation_pdf', completion.usage?.total_tokens || 0, 'gpt-4-turbo-preview');

      return formData;
    } catch (error) {
      logger.error('Form generation from PDF failed:', error);
      throw new Error('Failed to generate form from PDF');
    }
  }

  async generateFormFromUrl(options: { url: string; formType: string; userId: string }) {
    try {
      const { url, formType, userId } = options;

      // This would require web scraping. For now, we'll use a prompt-based approach
      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: `Create a ${formType} form that would be appropriate for the website at ${url}. Base the form on what you know about typical forms for this type of website.`
          },
          {
            role: 'user',
            content: `Generate a ${formType} form for the website: ${url}. Include fields that would be relevant and useful for this website's purpose.`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      const generatedContent = completion.choices[0].message.content;
      if (!generatedContent) {
        throw new Error('No content generated from URL');
      }

      const formData = JSON.parse(generatedContent);
      formData.metadata = {
        tokensUsed: completion.usage?.total_tokens || 0,
        model: 'gpt-4-turbo-preview',
        generatedAt: new Date().toISOString(),
        generationType: 'url',
        sourceUrl: url
      };

      await this.trackAIUsage(userId, 'form_generation_url', completion.usage?.total_tokens || 0, 'gpt-4-turbo-preview');

      return formData;
    } catch (error) {
      logger.error('Form generation from URL failed:', error);
      throw new Error('Failed to generate form from URL');
    }
  }

  async suggestQuestions(options: QuestionSuggestionOptions) {
    try {
      const { topic, questionType, count, audience, purpose, userId } = options;

      const systemPrompt = `You are an expert at creating effective survey and form questions. Generate ${count} high-quality questions about "${topic}".

Requirements:
- Question type: ${questionType === 'any' ? 'mix of different types' : questionType}
- Target audience: ${audience || 'general'}
- Purpose: ${purpose || 'general information gathering'}
- Return valid JSON array with this structure:
[
  {
    "id": "unique_id",
    "type": "question_type",
    "label": "Question text",
    "required": true|false,
    "placeholder": "placeholder text",
    "options": ["option1", "option2"] // for select/radio/checkbox only,
    "validation": {} // optional validation rules
  }
]

Make questions clear, unbiased, and effective for gathering useful responses.`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Generate ${count} questions about: ${topic}` }
        ],
        temperature: 0.8,
        max_tokens: 1500
      });

      const generatedContent = completion.choices[0].message.content;
      if (!generatedContent) {
        throw new Error('No questions generated');
      }

      const questions = JSON.parse(generatedContent);
      const result = {
        questions,
        metadata: {
          tokensUsed: completion.usage?.total_tokens || 0,
          model: 'gpt-3.5-turbo',
          generatedAt: new Date().toISOString(),
          topic,
          questionType,
          count: questions.length
        }
      };

      await this.trackAIUsage(userId, 'question_suggestions', completion.usage?.total_tokens || 0, 'gpt-3.5-turbo');

      return result;
    } catch (error) {
      logger.error('Question suggestions failed:', error);
      throw new Error('Failed to generate question suggestions');
    }
  }

  async analyzeResponses(options: ResponseAnalysisOptions) {
    try {
      const { formId, analysisType, includePersonalData, userId } = options;

      // Get form and responses
      const form = await prisma.form.findFirst({
        where: { id: formId, userId },
        include: { responses: true }
      });

      if (!form) {
        throw new Error('Form not found or access denied');
      }

      // Prepare response data for analysis
      const responseData = form.responses.map(response => {
        const data = response.data as any;
        if (!includePersonalData) {
          // Remove potential PII
          const sanitized = { ...data };
          delete sanitized.email;
          delete sanitized.name;
          delete sanitized.phone;
          return sanitized;
        }
        return data;
      });

      const systemPrompt = `You are an expert data analyst. Analyze the form responses and provide insights.

Analysis type: ${analysisType}
Form title: ${form.title}
Number of responses: ${responseData.length}

Provide analysis in this JSON format:
{
  "summary": "Overall summary of responses",
  "insights": ["insight1", "insight2", "insight3"],
  "recommendations": ["recommendation1", "recommendation2"],
  "sentiment": "positive|neutral|negative",
  "keyFindings": ["finding1", "finding2"],
  "statistics": {
    "completionRate": 85,
    "averageTime": "2 minutes",
    "dropoffPoints": ["field1", "field2"]
  }
}`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Analyze these form responses: ${JSON.stringify(responseData.slice(0, 50))}` } // Limit to first 50 responses
        ],
        temperature: 0.3,
        max_tokens: 2000
      });

      const generatedContent = completion.choices[0].message.content;
      if (!generatedContent) {
        throw new Error('No analysis generated');
      }

      const analysis = JSON.parse(generatedContent);
      analysis.metadata = {
        tokensUsed: completion.usage?.total_tokens || 0,
        model: 'gpt-4-turbo-preview',
        analyzedAt: new Date().toISOString(),
        responsesAnalyzed: responseData.length,
        analysisType
      };

      await this.trackAIUsage(userId, 'response_analysis', completion.usage?.total_tokens || 0, 'gpt-4-turbo-preview');

      return analysis;
    } catch (error) {
      logger.error('Response analysis failed:', error);
      throw new Error('Failed to analyze responses');
    }
  }

  async optimizeForm(options: FormOptimizationOptions) {
    try {
      const { formId, optimizationGoals, targetAudience, userId } = options;

      // Get form data
      const form = await prisma.form.findFirst({
        where: { id: formId, userId },
        include: { 
          responses: true,
          analytics: {
            where: {
              date: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
              }
            }
          }
        }
      });

      if (!form) {
        throw new Error('Form not found or access denied');
      }

      const systemPrompt = `You are a form optimization expert. Analyze this form and provide optimization recommendations.

Optimization goals: ${optimizationGoals.join(', ')}
Target audience: ${targetAudience || 'general'}
Current conversion rate: ${form.conversionRate}%
Total views: ${form.views}
Total submissions: ${form.submissions}

Provide recommendations in this JSON format:
{
  "overallScore": 85,
  "recommendations": [
    {
      "category": "field_optimization|design|user_experience|conversion",
      "priority": "high|medium|low",
      "title": "Recommendation title",
      "description": "Detailed description",
      "expectedImpact": "Potential improvement description",
      "implementation": "How to implement this change"
    }
  ],
  "quickWins": ["quick improvement 1", "quick improvement 2"],
  "designSuggestions": {
    "layout": "suggestions for layout",
    "colors": "color scheme suggestions",
    "typography": "font and text suggestions"
  },
  "fieldSuggestions": [
    {
      "fieldId": "field_id",
      "suggestion": "specific suggestion for this field",
      "reason": "why this change would help"
    }
  ]
}`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Optimize this form: ${JSON.stringify({ title: form.title, fields: form.fields, settings: form.settings })}` }
        ],
        temperature: 0.3,
        max_tokens: 2500
      });

      const generatedContent = completion.choices[0].message.content;
      if (!generatedContent) {
        throw new Error('No optimization generated');
      }

      const optimization = JSON.parse(generatedContent);
      optimization.metadata = {
        tokensUsed: completion.usage?.total_tokens || 0,
        model: 'gpt-4-turbo-preview',
        optimizedAt: new Date().toISOString(),
        optimizationGoals,
        currentMetrics: {
          conversionRate: form.conversionRate,
          views: form.views,
          submissions: form.submissions
        }
      };

      await this.trackAIUsage(userId, 'form_optimization', completion.usage?.total_tokens || 0, 'gpt-4-turbo-preview');

      return optimization;
    } catch (error) {
      logger.error('Form optimization failed:', error);
      throw new Error('Failed to optimize form');
    }
  }

  async autoGradeResponse(options: { responseId: string; gradingCriteria?: any; userId: string }) {
    try {
      const { responseId, gradingCriteria, userId } = options;

      // Get response and form data
      const response = await prisma.response.findFirst({
        where: {
          id: responseId,
          formId_rel: { userId }
        },
        include: {
          formId_rel: true
        }
      });

      if (!response) {
        throw new Error('Response not found or access denied');
      }

      const form = response.formId_rel;
      const fields = form.fields as any[];
      const responseData = response.data as any;

      // Calculate score based on correct answers
      let totalQuestions = 0;
      let correctAnswers = 0;
      const detailedFeedback: any[] = [];

      for (const field of fields) {
        if (field.type === 'multiple-choice' && field.correctAnswer) {
          totalQuestions++;
          const userAnswer = responseData[field.id];
          const isCorrect = userAnswer === field.correctAnswer;
          
          if (isCorrect) correctAnswers++;

          detailedFeedback.push({
            fieldId: field.id,
            question: field.label,
            userAnswer,
            correctAnswer: field.correctAnswer,
            isCorrect,
            explanation: field.explanation || null
          });
        }
      }

      const score = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

      // Use AI for open-ended questions if present
      const openEndedFields = fields.filter(f => 
        ['text', 'textarea'].includes(f.type) && f.gradingRubric
      );

      let aiGradedFields: any[] = [];
      if (openEndedFields.length > 0) {
        const systemPrompt = `You are an expert grader. Grade these open-ended responses based on the provided rubrics.

Return JSON format:
{
  "gradedFields": [
    {
      "fieldId": "field_id",
      "score": 85,
      "feedback": "Detailed feedback",
      "strengths": ["strength1", "strength2"],
      "improvements": ["improvement1", "improvement2"]
    }
  ]
}`;

        const completion = await openai.chat.completions.create({
          model: 'gpt-4-turbo-preview',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Grade these responses: ${JSON.stringify(openEndedFields.map(f => ({
              fieldId: f.id,
              question: f.label,
              answer: responseData[f.id],
              rubric: f.gradingRubric
            })))}` }
          ],
          temperature: 0.2,
          max_tokens: 1500
        });

        const aiGrading = JSON.parse(completion.choices[0].message.content || '{}');
        aiGradedFields = aiGrading.gradedFields || [];

        await this.trackAIUsage(userId, 'auto_grading', completion.usage?.total_tokens || 0, 'gpt-4-turbo-preview');
      }

      // Update response with score
      await prisma.response.update({
        where: { id: responseId },
        data: { score }
      });

      return {
        responseId,
        overallScore: score,
        totalQuestions,
        correctAnswers,
        detailedFeedback,
        aiGradedFields,
        metadata: {
          gradedAt: new Date().toISOString(),
          gradingMethod: 'ai_assisted'
        }
      };
    } catch (error) {
      logger.error('Auto-grading failed:', error);
      throw new Error('Failed to grade response');
    }
  }

  async detectFieldTypes(options: { fieldLabels: string[]; context?: string; userId: string }) {
    try {
      const { fieldLabels, context, userId } = options;

      const systemPrompt = `You are an expert at detecting appropriate form field types. For each field label, suggest the most appropriate field type and configuration.

Return JSON format:
{
  "detections": [
    {
      "label": "field label",
      "suggestedType": "text|email|tel|url|number|textarea|select|radio|checkbox|rating|date|time|file",
      "confidence": 0.95,
      "reasoning": "why this type was chosen",
      "validation": {
        "required": true|false,
        "minLength": 5,
        "maxLength": 100,
        "pattern": "regex pattern if applicable"
      },
      "placeholder": "suggested placeholder text",
      "options": ["option1", "option2"] // for select/radio/checkbox only
    }
  ]
}`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Detect field types for these labels: ${fieldLabels.join(', ')}. Context: ${context || 'general form'}` }
        ],
        temperature: 0.3,
        max_tokens: 1500
      });

      const generatedContent = completion.choices[0].message.content;
      if (!generatedContent) {
        throw new Error('No field types detected');
      }

      const detections = JSON.parse(generatedContent);
      detections.metadata = {
        tokensUsed: completion.usage?.total_tokens || 0,
        model: 'gpt-3.5-turbo',
        detectedAt: new Date().toISOString(),
        fieldsAnalyzed: fieldLabels.length
      };

      await this.trackAIUsage(userId, 'field_detection', completion.usage?.total_tokens || 0, 'gpt-3.5-turbo');

      return detections;
    } catch (error) {
      logger.error('Field type detection failed:', error);
      throw new Error('Failed to detect field types');
    }
  }

  async getUsageStats(userId: string, period: string) {
    try {
      const now = new Date();
      let startDate: Date;

      switch (period) {
        case 'day':
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }

      const usage = await prisma.analytics.findMany({
        where: {
          userId,
          formId: 'ai-usage',
          date: { gte: startDate }
        },
        orderBy: { date: 'desc' }
      });

      const stats = usage.reduce((acc, record) => {
        const operation = record.dimensions?.operation as string;
        if (!acc[operation]) {
          acc[operation] = { count: 0, tokens: 0 };
        }
        acc[operation].count++;
        acc[operation].tokens += record.value;
        return acc;
      }, {} as Record<string, { count: number; tokens: number }>);

      const totalTokens = usage.reduce((sum, record) => sum + record.value, 0);
      const totalRequests = usage.length;

      return {
        period,
        totalTokens,
        totalRequests,
        operationBreakdown: stats,
        dailyUsage: usage.reduce((acc, record) => {
          const date = record.date.toISOString().split('T')[0];
          if (!acc[date]) acc[date] = 0;
          acc[date] += record.value;
          return acc;
        }, {} as Record<string, number>)
      };
    } catch (error) {
      logger.error('Failed to get AI usage stats:', error);
      throw new Error('Failed to retrieve usage statistics');
    }
  }

  async generateBloomsQuiz(options: { prompt: string; taxonomyLevel: string; difficulty: string; questionCount: number; userId: string }) {
    // For now, delegate to generateFormFromPrompt with formType 'quiz'
    return this.generateFormFromPrompt({
      prompt: options.prompt,
      formType: 'quiz',
      language: 'en',
      style: options.difficulty,
      userId: options.userId
    });
  }
}

export const aiService = new AIService(); 