import type { Request, Response } from 'express';
import NoDueReq, { INoDueReq } from '../models/noDueRequest';
import Student from '../models/student';
import FacultyAdvisor, { IFacultyAdvisor } from '../models/facultyAdvisor';
import DepartmentRepresentative from '../models/departmentRepresentative';
import sendEmail from '../utils/sendEmail';
import { DEPARTMENTS } from '../constants';
import mongoose from '../mongooseClient';

const ACTIVE_STATUSES = new Set(['Pending', 'FA Approved']);

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

        const existingRequests = await NoDueReq.find({
            studentRollNumber: user.rollNumber,
            status: { $in: ['Pending', 'FA Approved'] },
        });
        if (existingRequests.length > 0) {
            res.status(400).json({
                message:
                    "Can't create a new request while an existing one is still in progress.",
            });
            return;
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

export async function approveRequest(req: Request, res: Response) {
    try {
        const { reqId } = req.params as { reqId?: string };
        if (!reqId)
            return res.status(400).json({ message: 'reqId is required' });

        const user: any = (req as any).user;
        if (!user?.role || !user?.id)
            return res.status(401).json({ message: 'Unauthorized' });

        const doc: any = await NoDueReq.findById(reqId);
        if (!doc) return res.status(404).json({ message: 'Request not found' });

        const now = new Date();
        let updated = false;

        if (user.role === 'facultyadv') {
            // Approve faculty advisor section only if this advisor is the approver
            if (
                String(doc.facultyAdvisorApproval?.approverId) !==
                String(user.id)
            ) {
                return res
                    .status(403)
                    .json({ message: 'Not the assigned faculty advisor' });
            }
            doc.facultyAdvisorApproval.status = 'Approved';
            doc.facultyAdvisorApproval.date = now;
            updated = true;

            //create department approvals for all non academic departments and corresponding acamemic depts
            const student: any = await Student.findOne({
                rollNumber: doc.studentRollNumber,
            }).lean();
            if (!student)
                return res
                    .status(404)
                    .json({ message: 'Student for this request not found' });
            const deptReps = await DepartmentRepresentative.find({
                department: {
                    $in: [student.department, ...DEPARTMENTS.nonAcademic],
                },
            }).lean();
            doc.departmentApprovals = deptReps.map((rep) => ({
                department: rep.department,
                approverId: rep._id,
                status: 'Pending',
            }));
        } else if (user.role === 'deptrep') {
            // Find matching department approval by approverId or department
            let idx = -1;
            if (Array.isArray(doc.departmentApprovals)) {
                idx = doc.departmentApprovals.findIndex(
                    (a: any) => String(a.approverId) === String(user.id),
                );
            }
            if (idx === -1) {
                // Fallback by department if mapping is by department
                const rep = await DepartmentRepresentative.findById(
                    user.id,
                ).lean();
                if (!rep)
                    return res
                        .status(403)
                        .json({ message: 'Department rep not found' });
                idx = doc.departmentApprovals.findIndex(
                    (a: any) => a.department === rep.department,
                );
            }
            if (idx === -1)
                return res
                    .status(403)
                    .json({ message: 'No matching department approval entry' });

            doc.departmentApprovals[idx].status = 'Approved';
            doc.departmentApprovals[idx].date = now;
            updated = true;
        } else {
            return res.status(403).json({
                message: 'Only faculty advisors or department reps can approve',
            });
        }

        if (!updated)
            return res.status(400).json({ message: 'No changes applied' });

        // Optionally update overall status
        const allDeptApproved = (doc.departmentApprovals || []).every(
            (a: any) => a.status === 'Approved',
        );
        const anyRejected =
            (doc.departmentApprovals || []).some(
                (a: any) => a.status === 'Rejected',
            ) || doc.facultyAdvisorApproval?.status === 'Rejected';
        if (anyRejected) {
            doc.status = 'Rejected';
        } else if (
            doc.facultyAdvisorApproval?.status === 'Approved' &&
            allDeptApproved
        ) {
            doc.status = 'Fully Approved';
        } else if (
            doc.facultyAdvisorApproval?.status === 'Approved' ||
            (doc.departmentApprovals || []).some(
                (a: any) => a.status === 'Approved',
            )
        ) {
            doc.status = 'FA Approved';
        } else {
            doc.status = 'Pending';
        }

        await doc.save();
        return res.json({ message: 'Approved successfully', request: doc });
    } catch (err) {
        console.log(err);

        return res.status(500).json({ message: 'Failed to approve request' });
    }
}

export async function rejectRequest(req: Request, res: Response) {
    try {
        const { reqId } = req.params as { reqId?: string };
        if (!reqId)
            return res.status(400).json({ message: 'reqId is required' });

        const user: any = (req as any).user;
        if (!user?.role || !user?.id)
            return res.status(401).json({ message: 'Unauthorized' });

        const { rejectionReason, remarks } = (req.body as any) || {};

        const doc: any = await NoDueReq.findById(reqId);
        if (!doc) return res.status(404).json({ message: 'Request not found' });

        const now = new Date();
        let updated = false;

        if (user.role === 'facultyadv') {
            if (
                String(doc.facultyAdvisorApproval?.approverId) !==
                String(user.id)
            ) {
                return res
                    .status(403)
                    .json({ message: 'Not the assigned faculty advisor' });
            }
            doc.facultyAdvisorApproval.status = 'Rejected';
            doc.facultyAdvisorApproval.rejectionReason =
                rejectionReason ?? doc.facultyAdvisorApproval.rejectionReason;
            doc.facultyAdvisorApproval.date = now;
            updated = true;
        } else if (user.role === 'deptrep') {
            let idx = -1;
            if (Array.isArray(doc.departmentApprovals)) {
                idx = doc.departmentApprovals.findIndex(
                    (a: any) => String(a.approverId) === String(user.id),
                );
            }
            if (idx === -1) {
                const rep = await DepartmentRepresentative.findById(
                    user.id,
                ).lean();
                if (!rep)
                    return res
                        .status(403)
                        .json({ message: 'Department rep not found' });
                idx = doc.departmentApprovals.findIndex(
                    (a: any) => a.department === rep.department,
                );
            }
            if (idx === -1)
                return res
                    .status(403)
                    .json({ message: 'No matching department approval entry' });

            doc.departmentApprovals[idx].status = 'Rejected';
            doc.departmentApprovals[idx].rejectionReason =
                rejectionReason ?? doc.departmentApprovals[idx].rejectionReason;
            if (remarks != null) doc.departmentApprovals[idx].remarks = remarks;
            doc.departmentApprovals[idx].date = now;
            updated = true;
        } else {
            return res.status(403).json({
                message: 'Only faculty advisors or department reps can reject',
            });
        }

        if (!updated)
            return res.status(400).json({ message: 'No changes applied' });

        // Any rejection makes the overall request Rejected
        doc.status = 'Rejected';

        await doc.save();
        return res.json({ message: 'Rejected successfully', request: doc });
    } catch (err) {
        return res.status(500).json({ message: 'Failed to reject request' });
    }
}

export const getRequestsFaculty = async (req: Request, res: Response) => {
    console.log('endpoint reached - getRequestsFaculty');

    try {
        const user: any = (req as any).user;
        console.log('Authenticated user:', user);

        if (!user?.role || !user?.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (user.role !== 'facultyadv') {
            return res
                .status(403)
                .json({ message: 'Only faculty advisors can access this' });
        }

        // Convert user.id safely to ObjectId if possible
        let userId: mongoose.Types.ObjectId | string = user.id;
        if (mongoose.Types.ObjectId.isValid(user.id)) {
            userId = new mongoose.Types.ObjectId(user.id);
        } else {
            // leave as string if not a valid ObjectId (won't crash)
            console.warn('user.id is not a valid ObjectId:', user.id);
        }

        // Fetch pending and completed separately to mirror deptrep behaviour
        let pending_requests = [] as any[];
        let completed_requests = [] as any[];

        try {
            pending_requests = await NoDueReq.find({
                'facultyAdvisorApproval.approverId': userId,
                'facultyAdvisorApproval.status': 'Pending',
            })
                .sort({ createdAt: -1 })
                .lean();
        } catch (err) {
            console.error('Error fetching pending_requests:', err);
            throw err;
        }

        try {
            completed_requests = await NoDueReq.find({
                'facultyAdvisorApproval.approverId': userId,
                'facultyAdvisorApproval.status': { $ne: 'Pending' },
            })
                .sort({ createdAt: -1 })
                .lean();
        } catch (err) {
            console.error('Error fetching completed_requests:', err);
            throw err;
        }

        console.log(
            'DB queries done. counts:',
            pending_requests.length,
            completed_requests.length,
        );

        return res.status(200).json({ pending_requests, completed_requests });
    } catch (err: any) {
        console.error('getRequestsFaculty failed:', err);
        return res
            .status(500)
            .json({ message: 'Failed to fetch requests', error: err.message });
    }
};

export const getRequestsDeptRep = async (req: Request, res: Response) => {
    console.log('endpoint reached - getRequestsDeptRep');

    try {
        const user: any = (req as any).user;
        console.log('Authenticated user:', user);

        if (!user?.role || !user?.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (user.role !== 'deptrep') {
            return res
                .status(403)
                .json({
                    message: 'Only department representatives can access this',
                });
        }

        // Convert user.id safely to ObjectId if possible
        let userId: mongoose.Types.ObjectId | string = user.id;
        if (mongoose.Types.ObjectId.isValid(user.id)) {
            userId = new mongoose.Types.ObjectId(user.id);
        } else {
            // leave as string if not a valid ObjectId (won't crash)
            console.warn('user.id is not a valid ObjectId:', user.id);
        }

        // Wrap each find with try/catch to isolate possible CastErrors
        let pending_requests = [];
        let completed_requests = [];

        try {
            pending_requests = await NoDueReq.find({
                departmentApprovals: {
                    $elemMatch: { approverId: userId, status: 'Pending' },
                },
            })
                .sort({ createdAt: -1 })
                .lean();
        } catch (err) {
            console.error('Error fetching pending_requests:', err);
            throw err; // rethrow to be caught by outer catch
        }

        try {
            completed_requests = await NoDueReq.find({
                departmentApprovals: {
                    $elemMatch: {
                        approverId: userId,
                        status: { $ne: 'Pending' },
                    },
                },
            })
                .sort({ createdAt: -1 })
                .lean();
        } catch (err) {
            console.error('Error fetching completed_requests:', err);
            throw err;
        }

        console.log(
            'DB queries done. counts:',
            pending_requests.length,
            completed_requests.length,
        );

        return res.status(200).json({ pending_requests, completed_requests });
    } catch (err: any) {
        console.error('getRequestsDeptRep failed:', err);
        // return a clear message and status code
        return res
            .status(500)
            .json({ message: 'Failed to fetch requests', error: err.message });
    }
};

export const reopenRequest = async (req: Request, res: Response) => {
    try {
        const { reqid } = req.params as { reqid?: string };
        console.log(reqid);

        if (!reqid) {
            return res.status(400).json({ message: 'Reqid is required' });
        }

        const user = (req as any).user;
        if (!user?.role || !user?.id)
            return res.status(401).json({ message: 'Unauthorized' });

        const reqDoc = await NoDueReq.findById(reqid);
        if (!reqDoc) {
            return res.status(400).json({ message: 'Request not found' });
        }

        if (user.role == 'facultyadv') {
            reqDoc.status = 'Pending';
            reqDoc.facultyAdvisorApproval.status = 'Pending';
            reqDoc.save();
        } else if (user.role == 'deptrep') {
            reqDoc.status = 'FA Approved';
            if (Array.isArray(reqDoc.departmentApprovals)) {
                for (const approval of reqDoc.departmentApprovals) {
                    if (String(approval.approverId) === String(user.id)) {
                        approval.status = 'Pending';
                    }
                }
                reqDoc.save();
            }
        } else {
            return res.status(403).json({
                message: 'Only faculty advisors or department reps can reopen',
            });
        }

        res.status(200).json({ message: 'Request reopened successfully' });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error. Failed to reopen request',
        });
    }
};

export const getRequestById = async (req: Request, res: Response) => {
    try {
        const { reqid } = req.params as { reqid?: string };

        console.log(reqid);

        if (!reqid) {
            return res.status(400).json({ message: 'Reqid is required' });
        }

        const user = (req as any).user;
        if (!user?.role || !user?.id)
            return res.status(401).json({ message: 'Unauthorized' });

        const reqDoc = await NoDueReq.findById(reqid).lean();

        if (!reqDoc) {
            return res.status(404).json({ message: 'Request not found' });
        }

        res.status(200).json({ request: reqDoc });
    } catch (error) {
        return res
            .status(500)
            .json({
                message: 'Internal server error. Failed to fetch request',
            });
    }
};

export const getRequestsFiltered = async (req: Request, res: Response) => {
    try {
        const {
            q,
            status,
            department,
            page = 1,
            limit = 10,
        } = req.query as {
            q?: string;
            status?: string;
            department?: string;
            page?: string | number;
            limit?: string | number;
        };

        const pageNum = Number(page) || 1;
        const limitNum = Number(limit) || 10;

        // Build base query for NoDueReq
        const query: any = {};

        if (status) query.status = status;

        let rollNumbers: string[] | undefined;

        // Build rollNumbers list if q or department are given
        if (q || department) {
            const studentFilter: any = {};

            if (q) {
                studentFilter.$or = [
                    { rollNumber: { $regex: new RegExp(q, "i") } },
                    { name: { $regex: new RegExp(q, "i") } },
                ];
            }

            if (department) {
                studentFilter.department = {
                    $regex: new RegExp(department, "i"),
                };
            }

            const matchingStudents = await Student.find(
                studentFilter,
                { rollNumber: 1 }
            ).lean();

            rollNumbers = matchingStudents.map((s) => s.rollNumber);

            if (rollNumbers.length > 0) {
                query.studentRollNumber = { $in: rollNumbers };
            } else if (q) {
                // fallback: regex on roll number if name/dept didn't match any students
                query.studentRollNumber = { $regex: new RegExp(q, "i") };
            }
        }

        // Count total and fetch paginated requests
        const total = await NoDueReq.countDocuments(query);

        const requests = await NoDueReq.find(query)
            .sort({ createdAt: -1 })
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum)
            .lean();

        // Attach student info (excluding sensitive fields)
        const enrichedRequests = await Promise.all(
            requests.map(async (reqItem: INoDueReq) => {
                const student = await Student.findOne(
                    { rollNumber: reqItem.studentRollNumber },
                    { passwordHash: 0, otp: 0, otpExpires: 0 }
                ).lean();

                return {
                    ...reqItem,
                    studentData: student || null,
                };
            })
        );

        const totalPages = Math.ceil(total / limitNum);

        return res.status(200).json({
            ok: true,
            data: {
                items: enrichedRequests,
                total,
                totalPages,
            },
        });
    } catch (error) {
        console.error("Error fetching filtered requests:", error);
        return res.status(500).json({
            ok: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Unknown error while fetching requests",
        });
    }
};