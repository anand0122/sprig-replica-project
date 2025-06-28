import express from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { validateRequest } from '../middleware/validation.js';
import { requireEmailVerification, requireSubscription } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';
import { generateSlug } from '../utils/helpers.js';
import { trackFormEvent } from '../services/analyticsService.js';

const router = express.Router();
const prisma = new PrismaClient();

// Validation schemas
const createFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().max(1000, 'Description too long').optional(),
  fields: z.array(z.any()).default([]),
  settings: z.object({}).optional(),
  design: z.object({}).optional(),
  logic: z.object({}).optional(),
  teamId: z.string().optional()
});

const updateFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long').optional(),
  description: z.string().max(1000, 'Description too long').optional(),
  fields: z.array(z.any()).optional(),
  settings: z.object({}).optional(),
  design: z.object({}).optional(),
  logic: z.object({}).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  isPublic: z.boolean().optional(),
  requiresAuth: z.boolean().optional(),
  metaTitle: z.string().max(200).optional(),
  metaDescription: z.string().max(300).optional(),
  customCss: z.string().optional(),
  customJs: z.string().optional()
});

const publishFormSchema = z.object({
  isPublic: z.boolean().default(true),
  requiresAuth: z.boolean().default(false),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional()
});

/**
 * @route GET /api/forms
 * @desc Get all forms for authenticated user
 * @access Private
 */
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search, sortBy = 'updatedAt', sortOrder = 'desc' } = req.query;
    const userId = req.user!.id;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    // Build where clause
    const where: any = {
      userId,
      status: status ? { equals: status } : { not: 'DELETED' }
    };

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    // Get forms with pagination
    const [forms, total] = await Promise.all([
      prisma.form.findMany({
        where,
        skip,
        take,
        orderBy: { [sortBy as string]: sortOrder },
        include: {
          _count: {
            select: { responses: true }
          }
        }
      }),
      prisma.form.count({ where })
    ]);

    res.json({
      forms,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    logger.error('Get forms error:', error);
    res.status(500).json({
      error: 'Failed to fetch forms',
      message: 'An error occurred while fetching your forms.'
    });
  }
});

/**
 * @route GET /api/forms/:id
 * @desc Get form by ID
 * @access Private
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const form = await prisma.form.findFirst({
      where: {
        id,
        userId,
        status: { not: 'DELETED' }
      },
      include: {
        _count: {
          select: { responses: true }
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    if (!form) {
      return res.status(404).json({
        error: 'Form not found',
        message: 'The requested form was not found or you do not have access to it.'
      });
    }

    res.json({ form });
  } catch (error) {
    logger.error('Get form error:', error);
    res.status(500).json({
      error: 'Failed to fetch form',
      message: 'An error occurred while fetching the form.'
    });
  }
});

/**
 * @route POST /api/forms
 * @desc Create a new form
 * @access Private
 */
router.post('/', requireEmailVerification, validateRequest(createFormSchema), async (req, res) => {
  try {
    const userId = req.user!.id;
    const { title, description, fields, settings, design, logic, teamId } = req.body;

    // Check form limit based on subscription
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { subscriptionTier: true, formsCreated: true }
    });

    const formLimits = {
      FREE: 5,
      PRO: 100,
      ENTERPRISE: -1 // unlimited
    };

    const limit = formLimits[user!.subscriptionTier as keyof typeof formLimits];
    if (limit !== -1 && user!.formsCreated >= limit) {
      return res.status(403).json({
        error: 'Form limit reached',
        message: `You have reached the form limit for your ${user!.subscriptionTier} plan.`,
        upgradeUrl: `${process.env.FRONTEND_URL}/pricing`
      });
    }

    // Generate unique slug
    const slug = await generateSlug(title, 'form');

    // Create form
    const form = await prisma.form.create({
      data: {
        title,
        description,
        slug,
        fields: fields || [],
        settings: settings || {},
        design: design || {},
        logic: logic || {},
        userId,
        teamId,
        status: 'DRAFT'
      },
      include: {
        _count: {
          select: { responses: true }
        }
      }
    });

    // Update user's form count
    await prisma.user.update({
      where: { id: userId },
      data: { formsCreated: { increment: 1 } }
    });

    // Track event
    await trackFormEvent('form_created', userId, form.id);

    logger.info(`Form created: ${form.id} by user: ${userId}`);

    res.status(201).json({
      message: 'Form created successfully',
      form
    });
  } catch (error) {
    logger.error('Create form error:', error);
    res.status(500).json({
      error: 'Failed to create form',
      message: 'An error occurred while creating the form.'
    });
  }
});

/**
 * @route PUT /api/forms/:id
 * @desc Update form
 * @access Private
 */
router.put('/:id', requireEmailVerification, validateRequest(updateFormSchema), async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const updateData = req.body;

    // Check if form exists and user owns it
    const existingForm = await prisma.form.findFirst({
      where: {
        id,
        userId,
        status: { not: 'DELETED' }
      }
    });

    if (!existingForm) {
      return res.status(404).json({
        error: 'Form not found',
        message: 'The requested form was not found or you do not have access to it.'
      });
    }

    // If title is being updated, regenerate slug
    if (updateData.title && updateData.title !== existingForm.title) {
      updateData.slug = await generateSlug(updateData.title, 'form');
    }

    // Update form
    const form = await prisma.form.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date()
      },
      include: {
        _count: {
          select: { responses: true }
        }
      }
    });

    // Track event
    await trackFormEvent('form_updated', userId, form.id);

    logger.info(`Form updated: ${form.id} by user: ${userId}`);

    res.json({
      message: 'Form updated successfully',
      form
    });
  } catch (error) {
    logger.error('Update form error:', error);
    res.status(500).json({
      error: 'Failed to update form',
      message: 'An error occurred while updating the form.'
    });
  }
});

/**
 * @route POST /api/forms/:id/publish
 * @desc Publish form
 * @access Private
 */
router.post('/:id/publish', requireEmailVerification, validateRequest(publishFormSchema), async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const { isPublic, requiresAuth, metaTitle, metaDescription } = req.body;

    // Check if form exists and user owns it
    const existingForm = await prisma.form.findFirst({
      where: {
        id,
        userId,
        status: { not: 'DELETED' }
      }
    });

    if (!existingForm) {
      return res.status(404).json({
        error: 'Form not found',
        message: 'The requested form was not found or you do not have access to it.'
      });
    }

    // Validate form has at least one field
    const fields = existingForm.fields as any[];
    if (!fields || fields.length === 0) {
      return res.status(400).json({
        error: 'Cannot publish empty form',
        message: 'Form must have at least one field to be published.'
      });
    }

    // Update form status to published
    const form = await prisma.form.update({
      where: { id },
      data: {
        status: 'PUBLISHED',
        isPublic,
        requiresAuth,
        metaTitle,
        metaDescription,
        publishedAt: new Date(),
        updatedAt: new Date()
      }
    });

    // Track event
    await trackFormEvent('form_published', userId, form.id);

    logger.info(`Form published: ${form.id} by user: ${userId}`);

    res.json({
      message: 'Form published successfully',
      form,
      publicUrl: `${process.env.FRONTEND_URL}/form/${form.slug}`
    });
  } catch (error) {
    logger.error('Publish form error:', error);
    res.status(500).json({
      error: 'Failed to publish form',
      message: 'An error occurred while publishing the form.'
    });
  }
});

/**
 * @route POST /api/forms/:id/unpublish
 * @desc Unpublish form
 * @access Private
 */
router.post('/:id/unpublish', requireEmailVerification, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const form = await prisma.form.updateMany({
      where: {
        id,
        userId,
        status: 'PUBLISHED'
      },
      data: {
        status: 'DRAFT',
        isPublic: false,
        updatedAt: new Date()
      }
    });

    if (form.count === 0) {
      return res.status(404).json({
        error: 'Form not found',
        message: 'The requested form was not found or is not published.'
      });
    }

    // Track event
    await trackFormEvent('form_unpublished', userId, id);

    logger.info(`Form unpublished: ${id} by user: ${userId}`);

    res.json({
      message: 'Form unpublished successfully'
    });
  } catch (error) {
    logger.error('Unpublish form error:', error);
    res.status(500).json({
      error: 'Failed to unpublish form',
      message: 'An error occurred while unpublishing the form.'
    });
  }
});

/**
 * @route POST /api/forms/:id/duplicate
 * @desc Duplicate form
 * @access Private
 */
router.post('/:id/duplicate', requireEmailVerification, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    // Get original form
    const originalForm = await prisma.form.findFirst({
      where: {
        id,
        userId,
        status: { not: 'DELETED' }
      }
    });

    if (!originalForm) {
      return res.status(404).json({
        error: 'Form not found',
        message: 'The requested form was not found or you do not have access to it.'
      });
    }

    // Check form limit
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { subscriptionTier: true, formsCreated: true }
    });

    const formLimits = {
      FREE: 5,
      PRO: 100,
      ENTERPRISE: -1
    };

    const limit = formLimits[user!.subscriptionTier as keyof typeof formLimits];
    if (limit !== -1 && user!.formsCreated >= limit) {
      return res.status(403).json({
        error: 'Form limit reached',
        message: `You have reached the form limit for your ${user!.subscriptionTier} plan.`
      });
    }

    // Generate new slug
    const newSlug = await generateSlug(`${originalForm.title} (Copy)`, 'form');

    // Create duplicate
    const duplicatedForm = await prisma.form.create({
      data: {
        title: `${originalForm.title} (Copy)`,
        description: originalForm.description,
        slug: newSlug,
        fields: originalForm.fields,
        settings: originalForm.settings,
        design: originalForm.design,
        logic: originalForm.logic,
        userId,
        status: 'DRAFT'
      }
    });

    // Update user's form count
    await prisma.user.update({
      where: { id: userId },
      data: { formsCreated: { increment: 1 } }
    });

    // Track event
    await trackFormEvent('form_duplicated', userId, duplicatedForm.id);

    logger.info(`Form duplicated: ${id} -> ${duplicatedForm.id} by user: ${userId}`);

    res.status(201).json({
      message: 'Form duplicated successfully',
      form: duplicatedForm
    });
  } catch (error) {
    logger.error('Duplicate form error:', error);
    res.status(500).json({
      error: 'Failed to duplicate form',
      message: 'An error occurred while duplicating the form.'
    });
  }
});

/**
 * @route DELETE /api/forms/:id
 * @desc Delete form (soft delete)
 * @access Private
 */
router.delete('/:id', requireEmailVerification, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const form = await prisma.form.updateMany({
      where: {
        id,
        userId,
        status: { not: 'DELETED' }
      },
      data: {
        status: 'DELETED',
        updatedAt: new Date()
      }
    });

    if (form.count === 0) {
      return res.status(404).json({
        error: 'Form not found',
        message: 'The requested form was not found or you do not have access to it.'
      });
    }

    // Track event
    await trackFormEvent('form_deleted', userId, id);

    logger.info(`Form deleted: ${id} by user: ${userId}`);

    res.json({
      message: 'Form deleted successfully'
    });
  } catch (error) {
    logger.error('Delete form error:', error);
    res.status(500).json({
      error: 'Failed to delete form',
      message: 'An error occurred while deleting the form.'
    });
  }
});

/**
 * @route GET /api/forms/:id/analytics
 * @desc Get form analytics
 * @access Private
 */
router.get('/:id/analytics', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const { period = 'last_30_days' } = req.query;

    // Verify form ownership
    const form = await prisma.form.findFirst({
      where: {
        id,
        userId,
        status: { not: 'DELETED' }
      }
    });

    if (!form) {
      return res.status(404).json({
        error: 'Form not found',
        message: 'The requested form was not found or you do not have access to it.'
      });
    }

    // Calculate date range based on period
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'last_7_days':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'last_30_days':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'last_90_days':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get analytics data
    const [
      totalResponses,
      responsesInPeriod,
      analyticsData
    ] = await Promise.all([
      prisma.response.count({
        where: { formId: id }
      }),
      prisma.response.count({
        where: {
          formId: id,
          submittedAt: { gte: startDate }
        }
      }),
      prisma.analytics.findMany({
        where: {
          formId: id,
          date: { gte: startDate }
        },
        orderBy: { date: 'asc' }
      })
    ]);

    // Calculate conversion rate
    const conversionRate = form.views > 0 ? (totalResponses / form.views) * 100 : 0;

    res.json({
      summary: {
        totalViews: form.views,
        totalResponses,
        responsesInPeriod,
        conversionRate: Math.round(conversionRate * 100) / 100
      },
      analytics: analyticsData,
      period
    });
  } catch (error) {
    logger.error('Get form analytics error:', error);
    res.status(500).json({
      error: 'Failed to fetch analytics',
      message: 'An error occurred while fetching form analytics.'
    });
  }
});

export default router; 