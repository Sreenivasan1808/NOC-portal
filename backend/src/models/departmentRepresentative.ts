import mongoose from '../mongooseClient.js';
import { DEPARTMENTS } from '../constants.js';

export interface IDeptRep extends mongoose.Document {
    name: string;
    email: string;
    department: string;
    passwordHash: string;
    otp?: string;
    otpExpires?: Date;

}

const ALL_DEPARTMENTS: string[] = [...DEPARTMENTS.academic, ...DEPARTMENTS.nonAcademic];

const departmentRepresentativeSchema = new mongoose.Schema<IDeptRep>({
    name: {
        type: String,
        required: true,
        maxLength: 100,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    department: {
        type: String,
        required: true,
        enum: {
            values: ALL_DEPARTMENTS,
            message: '{VALUE} is not a valid department',
        },
    },
    passwordHash: {
        type: String,
        required: true,
    },
    otp: { type: String },
    otpExpires: { type: Date }
});

const DepartmentRepresentative = mongoose.model<IDeptRep>(
    'DepartmentRepresentative',
    departmentRepresentativeSchema,
);
export default DepartmentRepresentative;
