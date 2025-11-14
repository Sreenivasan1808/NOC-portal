import express from 'express';
import multer from 'multer';
import { uploadCsv, createNewUser } from '../controllers/adminController';
import { authenticateJWT } from '../middlewares/jwtAuth';
import { isAdmin } from '../middlewares/isAdmin';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post(
  '/upload/:type',
  authenticateJWT,
  //@ts-ignore
  isAdmin, 
  upload.single('file'),
  uploadCsv
);
//@ts-ignore
router.post("/user", authenticateJWT, isAdmin,  createNewUser);

export default router;
