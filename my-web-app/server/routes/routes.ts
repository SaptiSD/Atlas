import { Router } from 'express';

const router = Router();

// Health check
router.get('/', (req: any, res: any) => {
  res.json({ status: 'ok', message: 'API root' });
});

// Example API route
router.get('/health', (req: any, res: any) => {
  res.json({ uptime: process.uptime(), timestamp: Date.now() });
});

export default router;
