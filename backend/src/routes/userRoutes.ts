import express from 'express';
import { getStudentData } from '../controllers/userController';

const router = express.Router();

router.get("/student/:rollNumber", getStudentData);

export default router;