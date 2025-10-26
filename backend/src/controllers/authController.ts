import type{ Request, Response } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import Student from '../models/student.js';
import FacultyAdvisor from '../models/facultyAdvisor.js';
import DepartmentRepresentative from '../models/departmentRepresentative.js';
import sendEmail from '../utils/sendEmail.js';

const getUserModel = (role: string) => {
  if (role === 'student') return Student;
  if (role === 'facultyAdvisor') return FacultyAdvisor;
  if (role === 'departmentRep') return DepartmentRepresentative;
  throw new Error('Invalid role');
};

// POST /api/auth/forgot-password
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { identifier, role } = req.body; // e.g. rollNo or email + role

    const Model = getUserModel(role);
    const user = await Model.findOne({ rollNo: identifier });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate token
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    user.resetPasswordToken = token;
    user.resetPasswordExpires = expires;
    await user.save();

    // In production → send via email
    const resetLink = `http://localhost:3000/reset-password?token=${token}&role=${role}`;
    await sendEmail(user.email ?? 'test@example.com', 'Password Reset', 
      `Click the following link to reset your password: ${resetLink}`);

    res.json({ message: 'Reset link sent (check email)', resetLink }); // show link for dev
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/reset-password
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, role, newPassword } = req.body;

    const Model = getUserModel(role);
    const user = await Model.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.passwordHash = hashed;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
