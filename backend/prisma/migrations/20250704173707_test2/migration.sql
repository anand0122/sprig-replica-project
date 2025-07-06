/*
  Warnings:

  - The values [MAILCHIMP,HUBSPOT,SALESFORCE,SLACK,ZAPIER,WEBHOOK,EMAIL,SMS] on the enum `IntegrationProvider` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "IntegrationProvider_new" AS ENUM ('GOOGLE_SHEETS', 'NOTION');
ALTER TABLE "integrations" ALTER COLUMN "provider" TYPE "IntegrationProvider_new" USING ("provider"::text::"IntegrationProvider_new");
ALTER TYPE "IntegrationProvider" RENAME TO "IntegrationProvider_old";
ALTER TYPE "IntegrationProvider_new" RENAME TO "IntegrationProvider";
DROP TYPE "IntegrationProvider_old";
COMMIT;
