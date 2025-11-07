import express from 'express';
import { authenticateJWT } from '../middlewares/jwtAuth';
import { listStudentsForAdvisor } from '../controllers/facultyController';

const router = express.Router();

// From token (faculty advisor self)
router.get('/students', authenticateJWT, listStudentsForAdvisor);

// By advisor id (e.g., admin usage)
router.get('/:id/students', authenticateJWT, listStudentsForAdvisor);

export default router;


