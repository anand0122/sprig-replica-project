import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';
import { syncResponseToIntegrations } from '../services/integrationService.js';

const router = express.Router();
const prisma = new PrismaClient();

// Public endpoint to submit responses without auth
router.post('/submit', async (req, res) => {
  try {
    const { formId, data, metadata } = req.body;
    const form = await prisma.form.findUnique({ where: { id: formId, status: { not: 'DELETED' } } });
    if (!form) return res.status(404).json({ error: 'Form not found' });

    const response = await prisma.response.create({
      data: {
        formId,
        data,
        metadata: metadata || {},
        status: 'COMPLETED',
      },
    });

    // Trigger integrations asynchronously (do not block response)
    syncResponseToIntegrations(formId, data).catch((err) => {
      logger.error('Integration sync error', err);
    });

    res.json({ success: true, responseId: response.id });
  } catch (err) {
    logger.error('Submit response error', err);
    res.status(500).json({ error: 'Failed to submit response' });
  }
});

// Get responses for a form (auth required)
router.get('/form/:formId', authenticateToken, async (req, res) => {
  try {
    const { formId } = req.params;
    const userId = req.user!.id;

    // Ensure user owns the form (simplified)
    const form = await prisma.form.findFirst({ where: { id: formId, userId } });
    if (!form) return res.status(404).json({ error: 'Form not found' });

    const responses = await prisma.response.findMany({
      where: { formId },
      orderBy: { submittedAt: 'desc' },
    });

    res.json({ responses });
  } catch (err) {
    logger.error('List responses error', err);
    res.status(500).json({ error: 'Failed to fetch responses' });
  }
});

// Get single response
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const response = await prisma.response.findUnique({ where: { id } });
    if (!response) return res.status(404).json({ error: 'Response not found' });

    // Ensure user owns form
    const form = await prisma.form.findFirst({ where: { id: response.formId, userId } });
    if (!form) return res.status(403).json({ error: 'Forbidden' });

    res.json({ response });
  } catch (err) {
    logger.error('Get response error', err);
    res.status(500).json({ error: 'Failed to fetch response' });
  }
});

export default router; 