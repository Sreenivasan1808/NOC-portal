import type { Request, Response } from 'express';
import NoDueReq from '../models/noDueRequest.js';

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


