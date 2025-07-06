import express from 'express';

const router = express.Router();

router.get('/plans', (_req, res) => {
  res.json({ plans: [] });
});

export default router; 