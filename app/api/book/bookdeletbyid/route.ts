import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/libs/mongodb";
import Book from "@/models/BookSchema";
import mongoose from "mongoose";
import Bookcheck from "@/models/BookCheckSchema";

export async function DELETE(
  req: NextRequest
) {
  await connectDB();
  
  try {
    const body = await req.json();
    const bookId = body.bookId; // Match the key in your frontend request
    const userId = req.headers.get('userid');
    
    // Validate inputs
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return NextResponse.json(
        { success: false, message: "Invalid book ID format" },
        { status: 400 }
      );
    }

    // Chain operations: verify ownership before deletion
    const book = await Book.findOne({ _id: bookId, userId })
      .catch(err => {
        throw new Error(`Verification query failed: ${err.message}`);
      });

    if (!book) {
      return NextResponse.json(
        {
          success: false,
          message: "Book not found or you don't have permission"
        },
        { status: 404 }
      );
    }

    // Chain deletion operations
    const [deletedBook] = await Promise.all([
      Book.findByIdAndDelete(bookId),
      Bookcheck.findOneAndDelete({ bookid: bookId }),
    ]).catch(err => {
      throw new Error(`Deletion transaction failed: ${err.message}`);
    });

    if (!deletedBook) {
      throw new Error("Deletion completed but no document was modified");
    }

    return NextResponse.json({
      success: true,
      message: "Book deleted successfully",
      deletedId: deletedBook._id
    }, { status: 200 });

  } catch (error) {
    console.error("❌ DELETE Book Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete book",
        error: error instanceof Error ? error.message : "Unknown error",
        stack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}