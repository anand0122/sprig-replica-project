import express from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { validateRequest } from '../middleware/validation.js';
import { logger } from '../utils/logger.js';
import { authenticateToken } from '../middleware/auth.js';
import axios from 'axios';
// @ts-expect-error typings resolution quirk
import { google } from 'googleapis';

const router = express.Router();
const prisma = new PrismaClient();

// ------------------------- Validation Schemas -------------------------
const providerEnum = z.enum(['GOOGLE_SHEETS', 'NOTION']);

const createIntegrationSchema = z.object({
  provider: providerEnum,
  name: z.string().optional(),
  description: z.string().optional(),
  config: z.record(z.any()).default({}),
  credentials: z.record(z.any()).default({})
});

const updateIntegrationSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  config: z.record(z.any()).optional(),
  credentials: z.record(z.any()).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'ERROR', 'PENDING']).optional()
});

// ---------------------------- OAuth -----------------------------------

/**
 * STEP 1 – Redirect user to Google consent screen
 */
router.get('/google_sheets/auth', authenticateToken, (req, res) => {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID!;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
    const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT!;

    if (!clientId || !clientSecret || !redirectUri) {
      return res.status(500).json({ error: 'Google OAuth not configured' });
    }

    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

    const scopes = [
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/spreadsheets'
    ];

    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent',
      state: req.user!.id,
    });

    res.redirect(url);
  } catch (err) {
    logger.error('Google Sheets OAuth start error', err);
    res.status(500).json({ error: 'Failed to start Google OAuth' });
  }
});

/**
 * STEP 2 – Google redirects back with ?code & state
 * This route must be PUBLIC (no auth header).
 */
router.get('/google_sheets/callback', async (req, res) => {
  try {
    const { code, state } = req.query as { code?: string; state?: string };
    if (!code || !state) return res.status(400).send('Missing code/state');

    const clientId = process.env.GOOGLE_CLIENT_ID!;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
    const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT!;

    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
    const { tokens } = await oauth2Client.getToken(code as string);

    const existing = await prisma.integration.findFirst({
      where: { userId: state as string, provider: 'GOOGLE_SHEETS' as any },
    });

    if (existing) {
      await prisma.integration.update({
        where: { id: existing.id },
        data: { credentials: tokens as any, status: 'ACTIVE' },
      });
    } else {
      await prisma.integration.create({
        data: {
          userId: state as string,
          provider: 'GOOGLE_SHEETS' as any,
          name: 'Google Sheets',
          description: 'Sync responses to Google Sheets',
          credentials: tokens as any,
          config: {},
          status: 'ACTIVE',
        },
      });
    }

    const redirect = `${process.env.FRONTEND_URL}/integrations?connected=google_sheets`;
    res.redirect(redirect);
  } catch (err) {
    logger.error('Google Sheets OAuth callback error', err);
    res.status(500).send('Google OAuth failed');
  }
});

/**
 * STEP 1 – Redirect user to Notion OAuth consent
 */
router.get('/notion/auth', authenticateToken, (req, res) => {
  try {
    const clientId = process.env.NOTION_CLIENT_ID!;
    const redirectUri = process.env.NOTION_OAUTH_REDIRECT!;

    if (!clientId || !redirectUri) {
      return res.status(500).json({ error: 'Notion OAuth not configured' });
    }

    const url = `https://api.notion.com/v1/oauth/authorize?client_id=${clientId}&response_type=code&owner=user&redirect_uri=${encodeURIComponent(redirectUri)}&state=${req.user!.id}`;
    res.redirect(url);
  } catch (err) {
    logger.error('Notion OAuth start error', err);
    res.status(500).json({ error: 'Failed to start Notion OAuth' });
  }
});

/**
 * STEP 2 – Notion redirects back
 */
router.get('/notion/callback', async (req, res) => {
  try {
    const { code, state } = req.query as { code?: string; state?: string };
    if (!code || !state) return res.status(400).send('Missing code/state');

    const clientId = process.env.NOTION_CLIENT_ID!;
    const clientSecret = process.env.NOTION_CLIENT_SECRET!;
    const redirectUri = process.env.NOTION_OAUTH_REDIRECT!;

    const tokenRes = await axios.post(
      'https://api.notion.com/v1/oauth/token',
      {
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
          'Notion-Version': '2022-06-28',
        },
      }
    );

    const credentials = tokenRes.data;

    const existing = await prisma.integration.findFirst({
      where: { userId: state as string, provider: 'NOTION' as any },
    });

    if (existing) {
      await prisma.integration.update({
        where: { id: existing.id },
        data: { credentials: credentials as any, status: 'ACTIVE' },
      });
    } else {
      await prisma.integration.create({
        data: {
          userId: state as string,
          provider: 'NOTION' as any,
          name: 'Notion',
          description: 'Sync responses to Notion',
          credentials: credentials as any,
          config: {},
          status: 'ACTIVE',
        },
      });
    }

    const redirect = `${process.env.FRONTEND_URL}/integrations?connected=notion`;
    res.redirect(redirect);
  } catch (err) {
    logger.error('Notion OAuth callback error', err);
    res.status(500).send('Notion OAuth failed');
  }
});

// ---------------------------- Protected CRUD --------------------------

router.use(authenticateToken);

// ---------------------------- Routes ----------------------------------

/**
 * GET /api/integrations
 * List all integrations for the authenticated user
 */
router.get('/', async (req, res) => {
  try {
    const userId = req.user!.id;
    const integrations = await prisma.integration.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ integrations });
  } catch (err) {
    logger.error('List integrations error', err);
    res.status(500).json({ error: 'Failed to fetch integrations' });
  }
});

/**
 * POST /api/integrations
 * Create a new integration (store credentials & config)
 */
router.post('/', validateRequest(createIntegrationSchema), async (req, res) => {
  try {
    const userId = req.user!.id;
    const { provider, name, description, config, credentials } = req.body;

    const integration = await prisma.integration.create({
      data: {
        userId,
        provider: provider as any,
        name: name || provider,
        description,
        config,
        credentials,
        status: 'ACTIVE'
      }
    });

    res.status(201).json({ integration });
  } catch (err) {
    logger.error('Create integration error', err);
    res.status(500).json({ error: 'Failed to create integration' });
  }
});

/**
 * PUT /api/integrations/:id
 * Update an existing integration
 */
router.put('/:id', validateRequest(updateIntegrationSchema), async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const existing = await prisma.integration.findFirst({ where: { id, userId } });
    if (!existing) return res.status(404).json({ error: 'Integration not found' });

    const integration = await prisma.integration.update({
      where: { id },
      data: req.body
    });

    res.json({ integration });
  } catch (err) {
    logger.error('Update integration error', err);
    res.status(500).json({ error: 'Failed to update integration' });
  }
});

/**
 * DELETE /api/integrations/:id
 * Soft-delete (deactivate) an integration
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const existing = await prisma.integration.findFirst({ where: { id, userId } });
    if (!existing) return res.status(404).json({ error: 'Integration not found' });

    await prisma.integration.update({
      where: { id },
      data: { status: 'INACTIVE' }
    });

    res.status(204).send();
  } catch (err) {
    logger.error('Delete integration error', err);
    res.status(500).json({ error: 'Failed to delete integration' });
  }
});

export default router; 