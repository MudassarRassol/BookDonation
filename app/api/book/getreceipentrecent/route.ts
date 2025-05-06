import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/libs/mongodb";
import mongoose from "mongoose";
import { Book, User } from "@/models/model";

export async function GET(req: NextRequest) {
  await connectDB();
  
  try {
    // Extract userId from headers
    const userId = req.headers.get("userid");
    
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, message: "Valid User ID is required" }, 
        { status: 400 }
      );
    }

    const user = await User.findById(userId).populate("userdetailsId", "city");
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" }, 
        { status: 404 }
      );
    }

    // First find all books that match our criteria
    const allBooks = await Book.find()
      .populate({
        path: "userId",
        select: "email userdetailsId",
        populate: {
          path: "userdetailsId",
          select: "city"
        }
      })
      .lean();

    // Filter the books by city and exclude user's own books
    const recepientbooks = allBooks.filter(
      (book) => 
        book.userId?.userdetailsId?.city === user.userdetailsId?.city && 
        book.userId?._id.toString() !== userId.toString()
    );

    // Now apply sorting and limiting to the filtered results
    const filteredBooks = recepientbooks
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 8); // Get first 8 after sorting

    if (filteredBooks.length > 0) {
      return NextResponse.json(
        { 
          success: true,
          count: filteredBooks.length,
          books: filteredBooks,
          message: "Books fetched successfully",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { 
          success: false,
          message: "No books found for this user"
        },
        { status: 200 }
      );
    }

  } catch (error) {
    console.error("❌ GET Books Error:", error);
    return NextResponse.json(
      { 
        success: false,
        message: "Failed to fetch books",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}