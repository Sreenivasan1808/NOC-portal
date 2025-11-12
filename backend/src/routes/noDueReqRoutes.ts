import express, { NextFunction, Request, Response } from 'express';
import { authenticateJWT } from '../middlewares/jwtAuth';
import {
    getStudentRequests,
    createNewRequest,
    approveRequest,
    rejectRequest,
    getRequestsFaculty,
    getRequestsDeptRep,
    reopenRequest,
    getRequestById,
    getRequestsFiltered
} from '../controllers/noDueReqController';
import { isAdmin } from '../middlewares/isAdmin';

const router = express.Router();

// Get a student's requests segregated into active and previous

router.post('/:reqId/approve', authenticateJWT, approveRequest);
router.post('/:reqId/reject', authenticateJWT, rejectRequest);
router.get('/student/:rollNumber', authenticateJWT, getStudentRequests);
router.get('/faculty', authenticateJWT, getRequestsFaculty);
router.get('/deptrep', authenticateJWT, getRequestsDeptRep);
router.put('/reopen/:reqid', authenticateJWT, reopenRequest);
router.get('/:reqid', authenticateJWT, getRequestById);
router.post('/', authenticateJWT, createNewRequest);
//@ts-ignore
router.get('/', authenticateJWT, isAdmin, getRequestsFiltered);

export default router;
