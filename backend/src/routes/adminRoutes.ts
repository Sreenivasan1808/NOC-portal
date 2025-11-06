import express from 'express';
import multer from 'multer';
import { uploadCsv } from '../controllers/adminController';
import { authenticateJWT } from '../middlewares/jwtAuth';
import { isAdmin } from '../middlewares/isAdmin';

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
