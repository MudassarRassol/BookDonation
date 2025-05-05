import {  NextResponse } from "next/server";
import connectDB from "@/libs/mongodb";
import { Book } from "@/models/model";
export async function GET() {
  await connectDB();
  
  try {

    // Find books for this user, sorted by createdAt in descending order
    const books = await Book.find()
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