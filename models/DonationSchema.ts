import mongoose from "mongoose";

const DonationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bookid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    donorId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
},{
    timestamps: true
});

const Donation = mongoose.models.Donation || mongoose.model('Donation', DonationSchema);
export default Donation;