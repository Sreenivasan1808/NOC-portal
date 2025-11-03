import express from 'express';
import { protect } from '../middlewares/jwtAuth.js';
import { getStudentRequests } from '../controllers/noDueReqController.js';

const router = express.Router();

// Get a student's requests segregated into active and previous
router.get('/student/:rollNumber', protect, getStudentRequests);

export default router;


