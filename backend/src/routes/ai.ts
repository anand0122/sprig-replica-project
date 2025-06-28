import express from 'express';
import { z } from 'zod';
import { validateRequest } from '../middleware/validation.js';
import { requireEmailVerification, requireSubscription } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';
import { aiService } from '../services/aiService.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiting for AI endpoints (more restrictive)
const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // limit each user to 50 AI requests per hour
  message: {
    error: 'AI request limit exceeded',
    message: 'You have exceeded the AI request limit. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Validation schemas
const generateFormSchema = z.object({
  prompt: z.string().min(10, 'Prompt must be at least 10 characters').max(1000, 'Prompt too long'),
  formType: z.enum(['survey', 'quiz', 'contact', 'feedback', 'registration', 'custom']).default('custom'),
  language: z.string().default('en'),
  style: z.enum(['minimal', 'modern', 'professional', 'creative']).default('modern')
});

const suggestQuestionsSchema = z.object({
  topic: z.string().min(3, 'Topic must be at least 3 characters').max(200, 'Topic too long'),
  questionType: z.enum(['multiple-choice', 'text', 'rating', 'yes-no', 'any']).default('any'),
  count: z.number().min(1).max(10).default(5),
  audience: z.string().max(100).optional(),
  purpose: z.string().max(200).optional()
});

const analyzeResponsesSchema = z.object({
  formId: z.string().min(1, 'Form ID is required'),
  analysisType: z.enum(['sentiment', 'summary', 'insights', 'recommendations']).default('summary'),
  includePersonalData: z.boolean().default(false)
});

const generateFromImageSchema = z.object({
  imageUrl: z.string().url('Valid image URL required'),
  additionalContext: z.string().max(500).optional()
});

const generateFromPdfSchema = z.object({
  pdfUrl: z.string().url('Valid PDF URL required'),
  extractionType: z.enum(['form', 'quiz', 'survey']).default('form')
});

const generateFromUrlSchema = z.object({
  url: z.string().url('Valid URL required'),
  formType: z.enum(['contact', 'signup', 'feedback', 'custom']).default('custom')
});

const optimizeFormSchema = z.object({
  formId: z.string().min(1, 'Form ID is required'),
  optimizationGoals: z.array(z.enum(['conversion', 'completion', 'engagement', 'accessibility'])),
  targetAudience: z.string().max(200).optional()
});

/**
 * @route POST /api/ai/generate-form
 * @desc Generate form from text prompt
 * @access Private
 */
router.post('/generate-form', aiLimiter, requireEmailVerification, validateRequest(generateFormSchema), async (req, res) => {
  try {
    const { prompt, formType, language, style } = req.body;
    const userId = req.user!.id;

    logger.info(`AI form generation requested by user: ${userId}`, { prompt: prompt.substring(0, 100) });

    const generatedForm = await aiService.generateFormFromPrompt({
      prompt,
      formType,
      language,
      style,
      userId
    });

    res.json({
      message: 'Form generated successfully',
      form: generatedForm,
      usage: {
        tokensUsed: generatedForm.metadata?.tokensUsed || 0,
        model: generatedForm.metadata?.model || 'gpt-3.5-turbo'
      }
    });
  } catch (error) {
    logger.error('AI form generation error:', error);
    res.status(500).json({
      error: 'Form generation failed',
      message: 'An error occurred while generating the form. Please try again.'
    });
  }
});

/**
 * @route POST /api/ai/generate-from-image
 * @desc Generate form from image
 * @access Private (Pro feature)
 */
router.post('/generate-from-image', aiLimiter, requireEmailVerification, requireSubscription('PRO'), validateRequest(generateFromImageSchema), async (req, res) => {
  try {
    const { imageUrl, additionalContext } = req.body;
    const userId = req.user!.id;

    logger.info(`AI form generation from image requested by user: ${userId}`);

    const generatedForm = await aiService.generateFormFromImage({
      imageUrl,
      additionalContext,
      userId
    });

    res.json({
      message: 'Form generated from image successfully',
      form: generatedForm,
      usage: {
        tokensUsed: generatedForm.metadata?.tokensUsed || 0,
        model: generatedForm.metadata?.model || 'gpt-4-vision'
      }
    });
  } catch (error) {
    logger.error('AI form generation from image error:', error);
    res.status(500).json({
      error: 'Form generation failed',
      message: 'An error occurred while generating the form from the image.'
    });
  }
});

/**
 * @route POST /api/ai/generate-from-pdf
 * @desc Generate form from PDF document
 * @access Private (Pro feature)
 */
router.post('/generate-from-pdf', aiLimiter, requireEmailVerification, requireSubscription('PRO'), validateRequest(generateFromPdfSchema), async (req, res) => {
  try {
    const { pdfUrl, extractionType } = req.body;
    const userId = req.user!.id;

    logger.info(`AI form generation from PDF requested by user: ${userId}`);

    const generatedForm = await aiService.generateFormFromPdf({
      pdfUrl,
      extractionType,
      userId
    });

    res.json({
      message: 'Form generated from PDF successfully',
      form: generatedForm,
      usage: {
        tokensUsed: generatedForm.metadata?.tokensUsed || 0,
        model: generatedForm.metadata?.model || 'gpt-4'
      }
    });
  } catch (error) {
    logger.error('AI form generation from PDF error:', error);
    res.status(500).json({
      error: 'Form generation failed',
      message: 'An error occurred while generating the form from the PDF.'
    });
  }
});

/**
 * @route POST /api/ai/generate-from-url
 * @desc Generate form from website URL
 * @access Private (Pro feature)
 */
router.post('/generate-from-url', aiLimiter, requireEmailVerification, requireSubscription('PRO'), validateRequest(generateFromUrlSchema), async (req, res) => {
  try {
    const { url, formType } = req.body;
    const userId = req.user!.id;

    logger.info(`AI form generation from URL requested by user: ${userId}`);

    const generatedForm = await aiService.generateFormFromUrl({
      url,
      formType,
      userId
    });

    res.json({
      message: 'Form generated from URL successfully',
      form: generatedForm,
      usage: {
        tokensUsed: generatedForm.metadata?.tokensUsed || 0,
        model: generatedForm.metadata?.model || 'gpt-4'
      }
    });
  } catch (error) {
    logger.error('AI form generation from URL error:', error);
    res.status(500).json({
      error: 'Form generation failed',
      message: 'An error occurred while generating the form from the URL.'
    });
  }
});

/**
 * @route POST /api/ai/suggest-questions
 * @desc Get AI-powered question suggestions
 * @access Private
 */
router.post('/suggest-questions', aiLimiter, requireEmailVerification, validateRequest(suggestQuestionsSchema), async (req, res) => {
  try {
    const { topic, questionType, count, audience, purpose } = req.body;
    const userId = req.user!.id;

    logger.info(`AI question suggestions requested by user: ${userId}`, { topic, questionType });

    const suggestions = await aiService.suggestQuestions({
      topic,
      questionType,
      count,
      audience,
      purpose,
      userId
    });

    res.json({
      message: 'Question suggestions generated successfully',
      suggestions,
      usage: {
        tokensUsed: suggestions.metadata?.tokensUsed || 0,
        model: suggestions.metadata?.model || 'gpt-3.5-turbo'
      }
    });
  } catch (error) {
    logger.error('AI question suggestions error:', error);
    res.status(500).json({
      error: 'Question suggestions failed',
      message: 'An error occurred while generating question suggestions.'
    });
  }
});

/**
 * @route POST /api/ai/analyze-responses
 * @desc Analyze form responses with AI
 * @access Private
 */
router.post('/analyze-responses', aiLimiter, requireEmailVerification, validateRequest(analyzeResponsesSchema), async (req, res) => {
  try {
    const { formId, analysisType, includePersonalData } = req.body;
    const userId = req.user!.id;

    logger.info(`AI response analysis requested by user: ${userId}`, { formId, analysisType });

    const analysis = await aiService.analyzeResponses({
      formId,
      analysisType,
      includePersonalData,
      userId
    });

    res.json({
      message: 'Response analysis completed successfully',
      analysis,
      usage: {
        tokensUsed: analysis.metadata?.tokensUsed || 0,
        model: analysis.metadata?.model || 'gpt-4'
      }
    });
  } catch (error) {
    logger.error('AI response analysis error:', error);
    res.status(500).json({
      error: 'Response analysis failed',
      message: 'An error occurred while analyzing the responses.'
    });
  }
});

/**
 * @route POST /api/ai/optimize-form
 * @desc Get AI-powered form optimization suggestions
 * @access Private (Pro feature)
 */
router.post('/optimize-form', aiLimiter, requireEmailVerification, requireSubscription('PRO'), validateRequest(optimizeFormSchema), async (req, res) => {
  try {
    const { formId, optimizationGoals, targetAudience } = req.body;
    const userId = req.user!.id;

    logger.info(`AI form optimization requested by user: ${userId}`, { formId, optimizationGoals });

    const optimization = await aiService.optimizeForm({
      formId,
      optimizationGoals,
      targetAudience,
      userId
    });

    res.json({
      message: 'Form optimization completed successfully',
      optimization,
      usage: {
        tokensUsed: optimization.metadata?.tokensUsed || 0,
        model: optimization.metadata?.model || 'gpt-4'
      }
    });
  } catch (error) {
    logger.error('AI form optimization error:', error);
    res.status(500).json({
      error: 'Form optimization failed',
      message: 'An error occurred while optimizing the form.'
    });
  }
});

/**
 * @route POST /api/ai/auto-grade
 * @desc Auto-grade quiz responses
 * @access Private (Pro feature)
 */
router.post('/auto-grade', aiLimiter, requireEmailVerification, requireSubscription('PRO'), async (req, res) => {
  try {
    const { responseId, gradingCriteria } = req.body;
    const userId = req.user!.id;

    logger.info(`AI auto-grading requested by user: ${userId}`, { responseId });

    const grading = await aiService.autoGradeResponse({
      responseId,
      gradingCriteria,
      userId
    });

    res.json({
      message: 'Response graded successfully',
      grading,
      usage: {
        tokensUsed: grading.metadata?.tokensUsed || 0,
        model: grading.metadata?.model || 'gpt-4'
      }
    });
  } catch (error) {
    logger.error('AI auto-grading error:', error);
    res.status(500).json({
      error: 'Auto-grading failed',
      message: 'An error occurred while grading the response.'
    });
  }
});

/**
 * @route POST /api/ai/smart-field-detection
 * @desc Detect and suggest field types based on content
 * @access Private
 */
router.post('/smart-field-detection', aiLimiter, requireEmailVerification, async (req, res) => {
  try {
    const { fieldLabels, context } = req.body;
    const userId = req.user!.id;

    logger.info(`AI field detection requested by user: ${userId}`);

    const detections = await aiService.detectFieldTypes({
      fieldLabels,
      context,
      userId
    });

    res.json({
      message: 'Field types detected successfully',
      detections,
      usage: {
        tokensUsed: detections.metadata?.tokensUsed || 0,
        model: detections.metadata?.model || 'gpt-3.5-turbo'
      }
    });
  } catch (error) {
    logger.error('AI field detection error:', error);
    res.status(500).json({
      error: 'Field detection failed',
      message: 'An error occurred while detecting field types.'
    });
  }
});

/**
 * @route GET /api/ai/usage
 * @desc Get AI usage statistics for the user
 * @access Private
 */
router.get('/usage', requireEmailVerification, async (req, res) => {
  try {
    const userId = req.user!.id;
    const { period = 'month' } = req.query;

    const usage = await aiService.getUsageStats(userId, period as string);

    res.json({
      usage,
      limits: {
        monthly: req.user!.subscriptionTier === 'FREE' ? 50 : req.user!.subscriptionTier === 'PRO' ? 500 : -1,
        daily: req.user!.subscriptionTier === 'FREE' ? 10 : req.user!.subscriptionTier === 'PRO' ? 50 : -1
      }
    });
  } catch (error) {
    logger.error('AI usage stats error:', error);
    res.status(500).json({
      error: 'Failed to fetch usage stats',
      message: 'An error occurred while fetching AI usage statistics.'
    });
  }
});

export default router; 