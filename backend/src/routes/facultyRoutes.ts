import express from 'express';
import { protect } from '../middlewares/jwtAuth.js';
import { listStudentsForAdvisor } from '../controllers/facultyController.js';

const router = express.Router();

// From token (faculty advisor self)
router.get('/students', protect, listStudentsForAdvisor);

// By advisor id (e.g., admin usage)
router.get('/:id/students', protect, listStudentsForAdvisor);

export default router;


