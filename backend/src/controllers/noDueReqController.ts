import type { Request, Response } from 'express';
import NoDueReq from '../models/noDueRequest';
import Student from '../models/student';
import FacultyAdvisor, { IFacultyAdvisor } from '../models/facultyAdvisor';
import DepartmentRepresentative from '../models/departmentRepresentative';
import sendEmail from '../utils/sendEmail';

const ACTIVE_STATUSES = new Set(['Pending', 'In Review', 'Partially Approved']);

export async function getStudentRequests(req: Request, res: Response) {
    try {
        const { rollNumber } = req.params as { rollNumber?: string };
        if (!rollNumber) {
            return res.status(400).json({ message: 'rollNumber is required' });
        }

        const requests = await NoDueReq.find({ studentRollNumber: rollNumber })
            .sort({ createdAt: -1 })
            .lean();

        const active = [] as any[];
        const previous = [] as any[];

        for (const reqDoc of requests) {
            if (ACTIVE_STATUSES.has(reqDoc.status)) {
                active.push(reqDoc);
            } else {
                previous.push(reqDoc);
            }
        }

        return res.json({ active, previous });
    } catch (err) {
        return res.status(500).json({ message: 'Failed to fetch requests' });
    }
}

export const createNewRequest = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        console.log(userId);

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized access' });
        }

        const user = await Student.findById(userId);
        console.log(user);

        if (user == null) {
            res.status(400).json({ message: 'User not found' });
            return; //dummy return to fix type error
        }

        const existingRequests = await NoDueReq.find({studentRollNumber: user.rollNumber, status: "Pending"});
        if(existingRequests.length > 0){
            res.status(400).json({message: "Can't create a new request while an existing one is still in progress."})
        }

        const FA = await FacultyAdvisor.findOne<IFacultyAdvisor>({
            name: user?.facultyAdvisorName,
            department: user?.department,
            program: user?.program,
        });
        console.log(FA);

        if (FA == null) {
            res.status(400).json({ message: 'Faculty advisor not found' });
            return; //dummy return to fix type error
        }

        const newReq = new NoDueReq();
        newReq.studentRollNumber = user.rollNumber;
        newReq.status = 'Pending';
        newReq.facultyAdvisorApproval.approverId = (
            FA._id as string | { toString(): string }
        ).toString();

        const result = await newReq.save();

        //send a mail to faculty advisor
        const faMail = FA.email;
        const subject = `${user.name} No due certificate requisition`;
        const body = `${user.name}, ${user.rollNumber} from ${user.program} has requested a no due certificate. Please visit the portal to complete the procedure`;

        await sendEmail({ to: faMail, subject, text: body });

        if (result) {
            res.status(200).json({ message: 'Successfully created a request' });
        }
    } catch (err) {
        res.status(500).json({
            error: err,
            message: 'Something went wrong in the server',
        });
    }
};
