import mongoose from "mongoose";

// Define the schema for books
const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 4
    },
    author: {
        type: String,
        required: true,
        minlength: 3
    },
    bookimg: {
        type: String,
        required: true
    },
    condition: {
        type: String,
        enum: ["New", "Good", "Fair", "Poor"],
        required: true
    },
    status: {
        type: String,
        enum: ["Available", "Not Available"],
        default: "Available",
    },
    description: {
        type: String,
        required: true,
        minlength: 10
    },
    Category: {
        type: String,
        enum: ["Fiction", "Non-Fiction", "Science Fiction", "Fantasy", "Biography", "History", "Self-Help", "Romance", "Mystery", "Thriller"],
        required: true,
        index: true // Add this
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true  // Adds createdAt and updatedAt fields automatically
});

// Prevent model redefinition error in Next.js
const Book = mongoose.models.Book || mongoose.model('Book', bookSchema);

export default Book;
