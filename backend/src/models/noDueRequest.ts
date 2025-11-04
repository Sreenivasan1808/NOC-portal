import mongoose from '../mongooseClient';

interface IFacultyAdvisorApproval {
    approverId: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    dueDate?: Date;
    rejectionReason?: string;
    date?: Date;
}

interface IDepartmentApproval {
    department: string;
    approverId: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    dueDate?: Date;
    rejectionReason?: string;
    remarks?: string;
    date?: Date;
}

export interface INoDueReq extends mongoose.Document {
    studentRollNumber: string;
    facultyAdvisorApproval: IFacultyAdvisorApproval;
    departmentApprovals: IDepartmentApproval[];
    status:
        | 'Pending'
        | 'In Review'
        | 'Partially Approved'
        | 'Approved'
        | 'Rejected'
        | 'Cancelled';
    createdAt?: Date;
    updatedAt?: Date;
}

const noDueReqSchema = new mongoose.Schema<INoDueReq>(
    {
        studentRollNumber: { type: String, required: true },

        facultyAdvisorApproval: {
            approverId: { type: String, required: true },
            status: {
                type: String,
                enum: ['Pending', 'Approved', 'Rejected'],
                default: 'Pending',
            },
            dueDate: { type: Date },
            rejectionReason: { type: String },
            date: { type: Date },
        },

        departmentApprovals: [
            {
                department: { type: String, required: true },
                approverId: { type: String, required: true },
                status: {
                    type: String,
                    enum: ['Pending', 'Approved', 'Rejected'],
                    default: 'Pending',
                },
                dueDate: { type: Date },
                rejectionReason: { type: String },
                remarks: { type: String },
                date: { type: Date },
            },
        ],

        status: {
            type: String,
            enum: [
                'Pending',
                'In Review',
                'Partially Approved',
                'Approved',
                'Rejected',
                'Cancelled',
            ],
            default: 'Pending',
        },
    },
    { timestamps: true },
);

const NoDueReq = mongoose.model<INoDueReq>('NoDueReq', noDueReqSchema);
export default NoDueReq;
