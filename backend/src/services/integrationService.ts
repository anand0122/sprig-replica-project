import { PrismaClient, Integration } from '@prisma/client';
// @ts-expect-error types included in package but resolver fails in bundler mode
import { google } from 'googleapis';
// @ts-expect-error notion client has its own types; bundler resolution quirk
import { Client as NotionClient } from '@notionhq/client';
import { logger } from '../utils/logger.js';

const prisma = new PrismaClient();

/**
 * Sync a form response to all active integrations (Google Sheets, Airtable, Notion).
 * Any failures are logged but will not interrupt the main request flow.
 */
export async function syncResponseToIntegrations(formId: string, responseData: Record<string, any>): Promise<void> {
  // Fetch the owner of the form so we can look-up their integrations
  const form = await prisma.form.findUnique({
    where: { id: formId },
    select: { userId: true }
  });

  if (!form) {
    logger.warn(`Form ${formId} not found while trying to sync response to integrations`);
    return;
  }

  // Pull all active spreadsheet/database integrations for the user
  const targetProviders = ['GOOGLE_SHEETS', 'NOTION'];
  const integrations = await prisma.integration.findMany({
    where: {
      userId: form.userId,
      status: 'ACTIVE',
      provider: { in: targetProviders as any }
    }
  });

  if (!integrations.length) return;

  for (const integration of integrations) {
    try {
      const provider = integration.provider as unknown as string;
      switch (provider) {
        case 'GOOGLE_SHEETS':
          await syncToGoogleSheets(integration, responseData);
          break;
        case 'NOTION':
          await syncToNotion(integration, responseData);
          break;
        default:
          break;
      }
    } catch (err) {
      logger.error(`Failed to sync to ${integration.provider} for integration ${integration.id}`, err);
    }
  }
}

/* --------------------------- Google Sheets --------------------------- */
async function syncToGoogleSheets(integration: Integration, data: Record<string, any>) {
  const { credentials, config } = integration as any;
  const { spreadsheetId, sheetName = 'Sheet1' } = config || {};
  if (!spreadsheetId || !credentials) {
    logger.warn('Missing Google Sheets credentials or config; skipping');
    return;
  }

  try {
    const auth = new google.auth.JWT(
      credentials.client_email,
      undefined,
      credentials.private_key,
      ['https://www.googleapis.com/auth/spreadsheets']
    );
    await auth.authorize();
    const sheets = google.sheets({ version: 'v4', auth });

    // Flatten response data into values in the same order each time
    const headerRow = Object.keys(data);
    const valuesRow = Object.values(data);

    // Append values – first ensure header exists
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A1`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [headerRow, valuesRow]
      }
    });
    logger.info(`Synced response to Google Sheets for integration ${integration.id}`);
  } catch (err) {
    logger.error('Google Sheets sync error', err);
  }
}

/* -------------------------------- Notion ------------------------------ */
async function syncToNotion(integration: Integration, data: Record<string, any>) {
  const { credentials, config } = integration as any;
  const { databaseId } = config || {};
  if (!databaseId || !credentials?.apiKey) {
    logger.warn('Missing Notion credentials or config; skipping');
    return;
  }

  try {
    const notion = new NotionClient({ auth: credentials.apiKey });

    // Convert the response data into simple text properties for each key
    const properties: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      properties[key] = {
        rich_text: [{ type: 'text', text: { content: String(value) } }]
      };
    }

    await notion.pages.create({
      parent: { database_id: databaseId },
      properties
    });
    logger.info(`Synced response to Notion for integration ${integration.id}`);
  } catch (err) {
    logger.error('Notion sync error', err);
  }
} 