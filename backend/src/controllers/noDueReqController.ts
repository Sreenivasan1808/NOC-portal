import type { Request, Response } from 'express';
import NoDueReq from '../models/noDueRequest.js';
import DepartmentRepresentative from '../models/departmentRepresentative.js';

const ACTIVE_STATUSES = new Set([
  'Pending',
  'In Review',
  'Partially Approved',
]);

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


export async function approveRequest(req: Request, res: Response) {
  try {
    const { reqId } = req.params as { reqId?: string };
    if (!reqId) return res.status(400).json({ message: 'reqId is required' });

    const user: any = (req as any).user;
    if (!user?.role || !user?.id) return res.status(401).json({ message: 'Unauthorized' });

    const doc: any = await NoDueReq.findById(reqId);
    if (!doc) return res.status(404).json({ message: 'Request not found' });

    const now = new Date();
    let updated = false;

    if (user.role === 'facultyadv') {
      // Approve faculty advisor section only if this advisor is the approver
      if (String(doc.facultyAdvisorApproval?.approverId) !== String(user.id)) {
        return res.status(403).json({ message: 'Not the assigned faculty advisor' });
      }
      doc.facultyAdvisorApproval.status = 'Approved';
      doc.facultyAdvisorApproval.date = now;
      updated = true;
    } else if (user.role === 'deptrep') {
      // Find matching department approval by approverId or department
      let idx = -1;
      if (Array.isArray(doc.departmentApprovals)) {
        idx = doc.departmentApprovals.findIndex((a: any) => String(a.approverId) === String(user.id));
      }
      if (idx === -1) {
        // Fallback by department if mapping is by department
        const rep = await DepartmentRepresentative.findById(user.id).lean();
        if (!rep) return res.status(403).json({ message: 'Department rep not found' });
        idx = doc.departmentApprovals.findIndex((a: any) => a.department === rep.department);
      }
      if (idx === -1) return res.status(403).json({ message: 'No matching department approval entry' });

      doc.departmentApprovals[idx].status = 'Approved';
      doc.departmentApprovals[idx].date = now;
      updated = true;
    } else {
      return res.status(403).json({ message: 'Only faculty advisors or department reps can approve' });
    }

    if (!updated) return res.status(400).json({ message: 'No changes applied' });

    // Optionally update overall status
    const allDeptApproved = (doc.departmentApprovals || []).every((a: any) => a.status === 'Approved');
    const anyRejected = (doc.departmentApprovals || []).some((a: any) => a.status === 'Rejected') || doc.facultyAdvisorApproval?.status === 'Rejected';
    if (anyRejected) {
      doc.status = 'Rejected';
    } else if (doc.facultyAdvisorApproval?.status === 'Approved' && allDeptApproved) {
      doc.status = 'Approved';
    } else if (doc.facultyAdvisorApproval?.status === 'Approved' || (doc.departmentApprovals || []).some((a: any) => a.status === 'Approved')) {
      doc.status = 'Partially Approved';
    } else {
      doc.status = 'In Review';
    }

    await doc.save();
    return res.json({ message: 'Approved successfully', request: doc });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to approve request' });
  }
}

