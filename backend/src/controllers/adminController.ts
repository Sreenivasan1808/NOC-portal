import type { Request, Response } from 'express';
import csv from 'csv-parser';
import fs from 'fs';
import Student from '../models/student';
import FacultyAdvisor from '../models/facultyAdvisor';
import DepartmentRepresentative from '../models/departmentRepresentative';
import bcrypt from 'bcrypt';

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
