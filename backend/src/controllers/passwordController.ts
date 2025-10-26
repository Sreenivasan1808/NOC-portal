import type{ Request, Response } from 'express';
import Student from '../models/student.js';
import sendEmail from '../utils/sendEmail.js';
import bcrypt from 'bcrypt';

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { username } = req.body;

    const user = await Student.findOne({
      $or: [{ email: username }, { rollno: username }],
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins validity

    user.otp = otp;
    user.otpExpires = expiry;
    await user.save();

    // Send OTP to email
    await sendEmail({
      to: user.email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is ${otp}. It expires in 10 minutes.`,
    });

    res.json({ message: 'OTP sent to registered email.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { username, otp } = req.body;

    const user = await Student.findOne({
      $or: [{ email: username }, { rollno: username }],
    });

    if (!user || !user.otp || !user.otpExpires)
      return res.status(400).json({ message: 'Invalid or expired OTP' });

    if (user.otp !== otp || user.otpExpires < new Date())
      return res.status(400).json({ message: 'Invalid or expired OTP' });

    res.json({ message: 'OTP verified successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { username, newPassword } = req.body;

    const user = await Student.findOne({
      $or: [{ email: username }, { rollno: username }],
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.passwordHash = hashed;
    // remove fields from the in-memory document so save() won't re-add them
    delete (user as any).otp;
    delete (user as any).otpExpires;

    // also unset them in the DB to be safe
    await Student.updateOne(
      { _id: user._id },
      { $unset: { otp: "", otpExpires: "" } }
    );
    await user.save();

    res.json({ message: 'Password reset successful.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
