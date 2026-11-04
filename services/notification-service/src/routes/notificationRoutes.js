import { Router } from 'express';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
} from '../controllers/notificationController.js';
import { extractUser } from '../middleware/authMiddleware.js';

const router = Router();
router.use(extractUser);

router.get('/', getNotifications);
router.get('/unread-count', getUnreadCount);
router.put('/read-all', markAllAsRead);
router.delete('/clear', clearAllNotifications);
router.put('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

export default router;