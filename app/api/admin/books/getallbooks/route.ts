import {  NextResponse } from "next/server";
import connectDB from "@/libs/mongodb";
import {Book} from "@/models/model"
export async function GET() {
  await connectDB();
  
  try {

    // Find books for this user, sorted by createdAt in descending order
    const books = await Book.find()
    .populate({
      path: "userId",
      select: "userdetailsId", // Select only the fields you need
      populate: {
        path: "userdetailsId",
        select: "username  city profilephoto role", // Select only the fields you need
        model: "UserDetails" // Specify the model name if necessary
      }
    })
    .sort({ createdAt: -1 }) // Sort by newest first
    .lean(); // Convert to plain JS objects

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