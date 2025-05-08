import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/libs/mongodb";
import Book from "@/models/BookSchema";
import UserDetails from "@/models/UserDetails";
import User from "@/models/UserSchema";
import mongoose from "mongoose";

export async function POST(
  req: NextRequest
) {
  await connectDB();
  const body =   await req.json();
  const bookId = body.bookId; // Match the key in your frontend request
  console.log(bookId)
  if (!bookId) {
    return NextResponse.json(
      { success: false, message: "Book ID is required" },
      { status: 400 }
    );
  }

  try {
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return NextResponse.json(
        { success: false, message: "Invalid book ID format" },
        { status: 400 }
      );
    }
    const book = await Book.findById(bookId);
    const user = await User.findById(book?.userId);
    const userDetails = await UserDetails.findById(user?.userdetailsId);

    const data = {
      ...book?.toObject(),
      user: {
        ...user?.toObject(),
        userdetailsId: userDetails ? userDetails.toObject() : null,
      },
    }

    if (!book) {
      return NextResponse.json(
        { success: false, message: "Book not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data  }, { status: 200 });
  } catch (error) {
    console.error("❌ GET Book Details Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch book details",
        error: error instanceof Error ? error.message : "Unknown error",
        stack:
          process.env.NODE_ENV === "development" && error instanceof Error
            ? error.stack
            : undefined,
      },
      { status: 500 }
    );
  }
}