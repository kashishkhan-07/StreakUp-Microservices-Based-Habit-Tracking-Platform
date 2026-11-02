import { Router } from 'express';
import { getSummary, getTrends } from '../controllers/analyticsController.js';
import { extractUser } from '../middleware/authMiddleware.js';

const router = Router();

router.use(extractUser);

router.get('/summary', getSummary);
router.get('/trends', getTrends);

export default router;