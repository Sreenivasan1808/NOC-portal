import Student from '../models/student';
import FacultyAdvisor, { IFacultyAdvisor } from '../models/facultyAdvisor';
import DepartmentRepresentative from '../models/departmentRepresentative';
import { Request, Response } from 'express'; // Import Request and Response from express

export const getStudentData = async (req: Request, res: Response) => {
    try {
        const { rollNumber } = req.params; // Remove the type assertion as it is inferred

        const student = await Student.findOne({ rollNumber }, {passwordHash : 0});
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
