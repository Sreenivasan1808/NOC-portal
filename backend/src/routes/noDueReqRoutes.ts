import express from 'express';
import { authenticateJWT } from '../middlewares/jwtAuth';
import { getStudentRequests, createNewRequest, approveRequest, rejectRequest } from '../controllers/noDueReqController';

const router = express.Router();

// Get a student's requests segregated into active and previous

router.post('/:reqId/approve', authenticateJWT, approveRequest);
router.post('/:reqId/reject', authenticateJWT, rejectRequest);
router.get('/student/:rollNumber', authenticateJWT, getStudentRequests);
router.post("/", authenticateJWT, createNewRequest);

export default router;


