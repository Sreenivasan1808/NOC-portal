import express from 'express';
import { protect } from '../middlewares/jwtAuth.js';
import { getStudentRequests, approveRequest } from '../controllers/noDueReqController.js';

const router = express.Router();

// Get a student's requests segregated into active and previous
router.get('/student/:rollNumber', protect, getStudentRequests);
router.post('/:reqId/approve', protect, approveRequest);

export default router;


