import express from 'express';
import { authenticateJWT } from '../middlewares/jwtAuth';
import { getStudentRequests, createNewRequest } from '../controllers/noDueReqController';

const router = express.Router();

// Get a student's requests segregated into active and previous
router.get('/student/:rollNumber', authenticateJWT, getStudentRequests);
router.post("/", authenticateJWT, createNewRequest);

export default router;


