import mongoose from "mongoose";

// Define the schema for books
const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 4,
    },
    author: {
      type: String,
      default: "",
    },
    bookimg: {
      type: String,
      required: true,
    },
    condition: {
      type: String,
      enum: ["New", "Good", "Fair", "Poor"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Available", "Not Available"],
      default: "Available",
    },
    description: {
      type: String,
      default: "",
    },
    Category: {
      type: String,
      enum: [
        "Fiction",
        "Non-Fiction",
        "Science Fiction",
        "Fantasy",
        "Biography",
        "History",
        "Self-Help",
        "Romance",
        "Mystery",
        "Thriller",
        "9th",
        "10th",
        "11th",
        "12th",
      ],
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// Prevent model redefinition error in Next.js
const Book = mongoose.models.Book || mongoose.model("Book", bookSchema);

export default Book;
