import type { Request, Response } from 'express';
import csv from 'csv-parser';
import fs from 'fs';
import Student from '../models/student';
import FacultyAdvisor from '../models/facultyAdvisor';
import DepartmentRepresentative from '../models/departmentRepresentative';
import bcrypt from 'bcrypt';
import sendEmail from '../utils/sendEmail';

const generatePassword = async (userData: any[]) => {
    const userWithHashedPass = await Promise.all(
        userData.map(async (user) => {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            return {
                ...user,
                passwordHash: hashedPassword,
            };
        }),
    );
    return userWithHashedPass;
};

export const uploadCsv = async (req: Request, res: Response) => {
    const { type } = req.params;
    const file = (req as any).file;

    if (!file) return res.status(400).json({ message: 'No file uploaded' });

    let results: any[] = [];

    try {
        const stream = fs.createReadStream(file.path).pipe(csv());

        stream.on('data', (data) => results.push(data));

        stream.on('end', async () => {
            try {
                console.log(results);
                results = await generatePassword(results);
                if (type === 'students') {
                    await Student.insertMany(results);
                } else if (type === 'faculties') {
                    await FacultyAdvisor.insertMany(results);
                } else if (type === 'representatives') {
                    await DepartmentRepresentative.insertMany(results);
                } else {
                    return res
                        .status(400)
                        .json({ message: 'Invalid type parameter' });
                }

                fs.unlinkSync(file.path); // cleanup uploaded file
                res.json({
                    message: `${results.length} ${type} uploaded successfully`,
                });
            } catch (err) {
                console.error(err);
                res.status(500).json({
                    message: 'Error saving data to database',
                });
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Error processing CSV file' });
    }
};

export const createNewUser = async (req: Request, res: Response) => {
    try {
        const { type, ...userData } = req.body;
        let model;
        if (type === 'students') {
            model = Student;
        } else if (type === 'faculty') {
            model = FacultyAdvisor;
        } else if (type === 'representative') {
            model = DepartmentRepresentative;
        } else {
            return res.status(400).json({ message: 'Invalid type' });
        }

        const { randomBytes } = await import('crypto');
        // generate a 12-character alphanumeric temporary password
        const tempPassword = randomBytes(16)
            .toString('base64')
            .replace(/[^a-zA-Z0-9]/g, '')
            .slice(0, 12);
        const hashedPassword = await bcrypt.hash(tempPassword, 10);
        userData.passwordHash = hashedPassword;

        const status = await model?.insertOne(userData);
        if (!status) {
            return res.status(500).json({ message: 'Could not create user' });
        }

        const email = userData.email;
        const mailText = `Hello ${(userData as any).name ?? 'User'},

An account has been created for you on the NITC No Due Application portal.

Username: Your email id ${type == 'students' && ' or roll number'}.
Temporary password: ${tempPassword}

Please log in and change your password immediately.

Regards,
NITC No Due Application Team`;

        await sendEmail({
            to: email,
            subject: 'Account created for NITC No Due Application',
            text: mailText,
        });

        res.status(200).json({ message: 'User created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating user' });
    }
};
