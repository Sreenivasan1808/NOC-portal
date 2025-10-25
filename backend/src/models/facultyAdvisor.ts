import { Document, Schema } from 'mongoose';
import db from '../db.js';
import { AcademicDeptPrograms } from '../constants.js';

export interface IFacultyAdvisor extends Document {
    name: string;
    email: string;
    department: string;
    program: string;
    passwordHash: string;
    resetPasswordToken: string;
    resetPasswordExpires: Date;
    otp?: string;
    otpExpires?: Date;
}

const facultyAdvisorSchema = new Schema<IFacultyAdvisor>({
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
            values: Object.keys(AcademicDeptPrograms),
            message: '{VALUE} is not a valid department',
        },
    },
    program: {
        type: String,
        required: true,
        validate: {
            validator: function (value: string) {
                const dept = (this as any).department;
                if (!dept || !AcademicDeptPrograms[dept]) return false;
                return AcademicDeptPrograms[dept].includes(value);
            },
            message: (props) =>
                `${props.value} is not a valid program for the selected department`,
        },
    },
    passwordHash: {
        type: String,
        required: true,
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
});


const FacultyAdvisor = db.model<IFacultyAdvisor>('FacultyAdvisor', facultyAdvisorSchema);
export default FacultyAdvisor;
