import type { Request, Response } from 'express';
import Student from '../models/student.js';
import FacultyAdvisor from '../models/facultyAdvisor.js';
import DepartmentRepresentative from '../models/departmentRepresentative.js';
import sendEmail from '../utils/sendEmail.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { username } = req.body;

        // search across all user collections (student, faculty advisor, dept rep)
        const query = { $or: [{ email: username }, { rollNumber: username }] };
        let user: any = await Student.findOne(query);
        let model: any = Student;
        if (!user) {
            user = await FacultyAdvisor.findOne(query);
            model = FacultyAdvisor;
        }
        if (!user) {
            user = await DepartmentRepresentative.findOne(query);
            model = DepartmentRepresentative;
        }

        if (!user) return res.status(404).json({ message: 'User not found' });

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins validity

        // Attach OTP fields to the found user document and persist
        (user as any).otp = otp;
        (user as any).otpExpires = expiry;
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

        const query = { $or: [{ email: username }, { rollNumber: username }] };
        let user: any = await Student.findOne(query);
        if (!user) user = await FacultyAdvisor.findOne(query);
        if (!user) user = await DepartmentRepresentative.findOne(query);

        if (!user || !(user as any).otp || !(user as any).otpExpires)
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

        const query = { $or: [{ email: username }, { rollNumber: username }] };
        let user: any = await Student.findOne(query);
        let model: any = Student;
        if (!user) {
            user = await FacultyAdvisor.findOne(query);
            model = FacultyAdvisor;
        }
        if (!user) {
            user = await DepartmentRepresentative.findOne(query);
            model = DepartmentRepresentative;
        }

        if (!user) return res.status(404).json({ message: 'User not found' });

        const hashed = await bcrypt.hash(newPassword, 10);
        (user as any).passwordHash = hashed;
        // remove fields from the in-memory document so save() won't re-add them
        delete (user as any).otp;
        delete (user as any).otpExpires;

        // also unset them in the DB to be safe using the correct model
        await model.updateOne(
            { _id: user._id },
            { $unset: { otp: '', otpExpires: '' } },
        );
        await user.save();

        res.json({ message: 'Password reset successful.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const handleLogin = async (req: Request, res: Response) => {
    const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
    const { username, password } = req.body;

    console.log(username, password);
    if (!username || !password) {
        return res
            .status(400)
            .json({ message: 'Username and password are required.' });
    }

    const query = { $or: [{ email: username }, { rollNumber: username }] };
    let user: any = await Student.findOne(query);
    console.log(user);

    let model: any = Student;
    if (!user) {
        user = await FacultyAdvisor.findOne(query);
        model = FacultyAdvisor;
    }
    if (!user) {
        user = await DepartmentRepresentative.findOne(query);
        model = DepartmentRepresentative;
    }
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
        return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
        expiresIn: '1d',
    });
    // res.cookie('token', token, {
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV === 'production',
    //     sameSite: 'strict',
    //     maxAge: 24 * 60 * 60 * 1000 // 1 day
    // });
    const userObj = (user as any).toObject
        ? (user as any).toObject()
        : { ...(user as any) };
    const { passwordHash, otp, otpExpires, ...sanitizedUser } = userObj;
    res.json({
        message: 'Login successful.',
        user: sanitizedUser,
        session: token,
    });
};
