import type { Request, Response } from 'express';
import csv from 'csv-parser';
import fs from 'fs';
import Student from '../models/student.js';
import FacultyAdvisor from '../models/facultyAdvisor.js';
import DepartmentRepresentative from '../models/departmentRepresentative.js';

export const uploadCsv = async (req: Request, res: Response) => {
  const { type } = req.params;
  const file = req.file;

  if (!file) return res.status(400).json({ message: 'No file uploaded' });

  const results: any[] = [];

  try {
    const stream = fs.createReadStream(file.path).pipe(csv());

    stream.on('data', (data) => results.push(data));

    stream.on('end', async () => {
      try {
        if (type === 'students') {
          await Student.insertMany(results);
        } else if (type === 'faculties') {
          await FacultyAdvisor.insertMany(results);
        } else if (type === 'representatives') {
          await DepartmentRepresentative.insertMany(results);
        } else {
          return res.status(400).json({ message: 'Invalid type parameter' });
        }

        fs.unlinkSync(file.path); // cleanup uploaded file
        res.json({ message: `${results.length} ${type} uploaded successfully` });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error saving data to database' });
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error processing CSV file' });
  }
};
