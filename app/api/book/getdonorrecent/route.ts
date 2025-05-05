import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/libs/mongodb";;
import mongoose from "mongoose";
import { Book } from "@/models/model"
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

    // Find books for this user, sorted by createdAt in descending order
    const books = await Book.find({ userId: userId })
      .sort({ createdAt: -1 }) // -1 for descending (newest first)
      .limit(5)
      .lean(); // Convert to plain JavaScript objects

      if(books.length > 0) {
        return NextResponse.json(
            { 
              success: true,
              count: books.length,
              books 
            },
            { status: 200 }
          );
      }
      else{
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