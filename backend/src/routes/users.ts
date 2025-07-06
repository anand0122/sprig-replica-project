import express from 'express';

const router = express.Router();

// Example authenticated endpoint
router.get('/me', (req, res) => {
  // Assuming authenticateToken has set req.user
  res.json({ user: req.user || null });
});

export default router; 