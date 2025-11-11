import mongoose from '../mongooseClient';

export interface IAdmin extends mongoose.Document {
    name: string;
    email: string;
    passwordHash: string;
    otp?: string;
    otpExpires?: Date;
}

const adminSchema = new mongoose.Schema<IAdmin>({
    name: {
        type: String,
        require: true,
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
    passwordHash: {
        type: String,
        required: true,
    },
    otp: { type: String },
    otpExpires: { type: Date },
});


const Admin = mongoose.model<IAdmin>('Admin', adminSchema);
export default Admin;