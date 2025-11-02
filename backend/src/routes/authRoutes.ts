import express from 'express';
import { forgotPassword,changePassword, verifyOtp, resetPassword, handleLogin } from '../controllers/authController.js';

const router = express.Router();

router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);
router.post('/login', handleLogin);
router.post("/change-password", protect, changePassword);
router.get("/", (req, res) => res.send("Auth route"))
export default router;
