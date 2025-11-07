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

export interface INoDueReq  {
    studentRollNumber: string;
    facultyAdvisorApproval: IFacultyAdvisorApproval;
    departmentApprovals: IDepartmentApproval[];
    status: 'Pending' | 'FA Approved' | 'Fully Approved' | 'Rejected';
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IApprovalHistory {
    noDueReqId: string;
    actorId: string;
    actorRole: 'Student' | 'FacultyAdvisor' | 'DeptRep' | 'Admin';
    action: 'Submitted' | 'Approved' | 'Rejected';
    timestamp?: Date;
    remarks?: string;
    rejectionReason?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IDeptRep {
    name: string;
    email: string;
    department: string;
    passwordHash: string;
    otp?: string;
    otpExpires?: Date;

}

export interface IFacultyAdvisor {
    name: string;
    email: string;
    department: string;
    program: string;
    passwordHash: string;
    otp?: string;
    otpExpires?: Date;
}

export interface IStudent {
    name: string;
    rollNumber: string;
    email: string;
    facultyAdvisorName: string;
    facultyAdvisorId: string;
    department: string;
    program: string;
    passwordHash: string;
    hosteler: boolean;
    otp?: string;
    otpExpires?: Date;
}