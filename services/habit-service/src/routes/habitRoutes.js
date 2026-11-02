import { Router } from 'express';
import {
  getHabits,
  createHabit,
  updateHabit,
  archiveHabit,
  toggleCompletion,
  getCompletions,
} from '../controllers/habitController.js';
import { extractUser } from '../middleware/authMiddleware.js';

const router = Router();

// Protect all habit routes
router.use(extractUser);

router.get('/', getHabits);
router.post('/', createHabit);
router.put('/:id', updateHabit);
router.delete('/:id', archiveHabit);
router.post('/:id/toggle', toggleCompletion);
router.get('/completions', getCompletions);

export default router;