import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    walletAddress: string;
    labrBalance: string;
    isRegistered: boolean;
    registrationDate?: Date;
    incomeVerification?: {
        verificationId: string;
        status: 'pending' | 'completed' | 'failed';
        annualIncome?: number;
        monthlyIncome?: number;
        verifiedAt?: Date;
        accessToken?: string;
        itemId?: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
    walletAddress: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    labrBalance: {
        type: String,
        required: true
    },
    isRegistered: {
        type: Boolean,
        default: false
    },
    registrationDate: {
        type: Date
    },
    incomeVerification: {
        verificationId: String,
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed'],
            default: 'pending'
        },
        annualIncome: Number,
        monthlyIncome: Number,
        verifiedAt: Date,
        accessToken: String,
        itemId: String
    }
}, {
    timestamps: true
});

// Only keep the incomeVerification index since walletAddress is already indexed by unique: true
UserSchema.index({ 'incomeVerification.verificationId': 1 });

export const User = mongoose.model<IUser>('User', UserSchema);