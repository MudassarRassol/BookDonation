import mongoose from "mongoose";

// Define the schema for user details
const userDetailsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    username: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    profilephoto: {
        type: String
    },
    role:{
        type: String,
        enum:['admin', 'donor','recipient']
    }
},{
    timestamps: true
});

// Prevent model redefinition error in Next.js
const UserDetails = mongoose.models.UserDetails || mongoose.model('UserDetails', userDetailsSchema);

export default UserDetails;
