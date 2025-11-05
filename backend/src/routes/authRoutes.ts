import express from 'express';
import { forgotPassword, verifyOtp, resetPassword, handleLogin, getUser, changePassword } from '../controllers/authController';
import { authenticateJWT } from '../middlewares/jwtAuth';

const router = express.Router();

router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);
router.post('/login', handleLogin);
router.put('/change-password', authenticateJWT, changePassword);
router.get('/me', getUser);

router.get("/", (req, res) => res.send("Auth route"))
export default router;
