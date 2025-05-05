import mongoose from "mongoose";

// Define the schema for books
const bookcheckSchema = new mongoose.Schema({
    bookid:{
        type : mongoose.Types.ObjectId,
    },
    delete : {
        type : Boolean,
        default : false
    }
}, {
    timestamps: true  // Adds createdAt and updatedAt fields automatically
});

// Prevent model redefinition error in Next.js
const Bookcheck = mongoose.models.BookBackup || mongoose.model('BookBackup', bookcheckSchema);

export default Bookcheck;
