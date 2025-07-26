import mongoose from "mongoose";

// User Schema
interface IUserSchema {
    email: string;
    password: string;
    googleid?: string;
    varificationcode?: string | null;
    report?: number;
    account?: 'blocked' | 'active';
    status?: 'verified' | 'non-verified';
    info?: boolean;
    hi?: string;
    userdetailsId?: mongoose.Schema.Types.ObjectId | null;
     reportsBy?: mongoose.Schema.Types.ObjectId[]; 
    online?: boolean;
    lastSeen?: Date;
}

const userSchema = new mongoose.Schema<IUserSchema>({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    googleid: {
        type: String
    },
    varificationcode: {
        type: String,
        minlength: 4,
        maxlength: 4,
        default: null
    },
     report: {
      type: Number,
      default: 0,
    },
    reportsBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    account: {
        type: String,
        default: 'active',
        enum: ['blocked', 'active','blocked']
    },
    status: {
        type: String,
        default: 'non-verified',
        enum: ['verified', 'non-verified']
    },
    info: {
        type: Boolean,
        default: false
    },
    userdetailsId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserDetails'
    },
    online: {
        type: Boolean,
        default: false,
      },
      lastSeen: Date
}, {
    timestamps: true
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;