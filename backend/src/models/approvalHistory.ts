import mongoose from '../mongooseClient.js';

export interface IApprovalHistory extends mongoose.Document {
    noDueReqId: mongoose.Types.ObjectId;
    actorId: string;
    actorRole: 'Student' | 'FacultyAdvisor' | 'DeptRep' | 'Admin';
    action: 'Submitted' | 'Approved' | 'Rejected';
    timestamp?: Date;
    remarks?: string;
    rejectionReason?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const approvalHistorySchema = new mongoose.Schema<IApprovalHistory>(
    {
        noDueReqId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'NoDueReq',
            required: true,
        },
        actorId: { type: String, required: true },
        actorRole: {
            type: String,
            enum: ['Student', 'FacultyAdvisor', 'DeptRep', 'Admin'],
            required: true,
        },
        action: {
            type: String,
            enum: ['Submitted', 'Approved', 'Rejected'],
            required: true,
        },
        timestamp: { type: Date, default: Date.now },
        remarks: { type: String },
        rejectionReason: { type: String },
    },
    { timestamps: true },
);

const ApprovalHistory = mongoose.model<IApprovalHistory>(
    'ApprovalHistory',
    approvalHistorySchema,
);

export default ApprovalHistory;
