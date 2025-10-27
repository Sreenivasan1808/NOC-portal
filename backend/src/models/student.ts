import mongoose from '../mongooseClient.js';
import { AcademicDeptPrograms } from '../constants.js';

export interface IStudent extends mongoose.Document {
    name: string;
    rollNumber: string;
    email: string;
    facultyAdvisorName: string;
    department: string;
    program: string;
    passwordHash: string;
    hosteler: boolean;
    otp?: string;
    otpExpires?: Date;
}



const studentSchema = new mongoose.Schema<IStudent>({
    name: {
        type: String,
        required: true,
        maxLength: 100,
    },
    rollNumber: {
        type: String,
        required: true,
        unique: true,
        minLength: 8,
        maxLength: 12,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    facultyAdvisorName: {
        type: String,
        required: [true, 'Faculty advisor name is required'],
        maxLength: 100,
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
    hosteler: {
        type: Boolean,
        required: true
    },
    otp: { type: String },
    otpExpires: { type: Date }
});

const Student = mongoose.model<IStudent>('Student', studentSchema);
export default Student;
