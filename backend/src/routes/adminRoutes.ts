import express from 'express';
import multer from 'multer';
import { uploadCsv } from '../controllers/adminController.js';
import { authenticateJWT } from '../middlewares/jwtAuth.js';
import { isAdmin } from '../middlewares/isAdmin.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post(
  '/upload/:type',
  authenticateJWT,
  isAdmin, 
  upload.single('file'),
  uploadCsv
);

export default router;
