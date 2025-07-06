import express from 'express';

const router = express.Router();

router.get('/overview', (_req, res) => {
  res.json({ stats: { totalForms: 0, totalResponses: 0 } });
});

export default router; 