import express from 'express';

const router = express.Router();

router.post('/example', (req, res) => {
  // Accept webhook payload and acknowledge
  console.log('Received webhook', req.body);
  res.sendStatus(200);
});

export default router; 