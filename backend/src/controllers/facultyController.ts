import type { Request, Response } from 'express';
import Student from '../models/student.js';
import FacultyAdvisor from '../models/facultyAdvisor.js';

// Helper: resolve advisor by id (param) or from JWT (req.user)
async function resolveAdvisor(req: Request): Promise<{ id: string; name?: string } | null> {
  const { id: paramId } = req.params as { id?: string };
  const user: any = (req as any).user;

  const advisorId = paramId ?? (user?.role === 'facultyadv' ? user?.id : undefined);
  if (!advisorId) return null;

  const advisor = await FacultyAdvisor.findById(advisorId).lean();
  if (!advisor) return null;
  return { id: String(advisor._id), name: advisor.name };
}

export async function listStudentsForAdvisor(req: Request, res: Response) {
  try {
    const advisor = await resolveAdvisor(req);
    if (!advisor) return res.status(404).json({ message: 'Faculty advisor not found' });

    // Query by either stored ObjectId or by name as fallback
    const students = await Student.find({
      $or: [
        { facultyAdvisorId: advisor.id },
        ...(advisor.name ? [{ facultyAdvisorName: advisor.name }] : []),
      ],
    })
      .select('name rollNumber email department program facultyAdvisorName')
      .sort({ rollNumber: 1 })
      .lean();

    return res.json({ items: students, count: students.length });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch students' });
  }
}


