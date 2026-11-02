import { Router } from 'express';
import { getNotifications, getUnreadCount, markAsRead } from '../controllers/notificationController.js';
import { extractUser } from '../middleware/authMiddleware.js';

const router = Router();
router.use(extractUser);

router.get('/', getNotifications);
router.get('/unread-count', getUnreadCount);
router.put('/:id/read', markAsRead);

export default router;