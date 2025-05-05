import { NextResponse } from "next/server";
import connectDB from "@/libs/mongodb";
import { Book } from "@/models/model";

export async function GET(request: Request) {
  await connectDB();
  
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('q');

    if (!searchQuery) {
      return NextResponse.json(
        { success: false, message: "Search query is required" },
        { status: 400 }
      );
    }

    const books = await Book.find({
      title: { $regex: searchQuery, $options: 'i' }
    })
    .populate({
      path: "userId",
      select: "userdetailsId",
      populate: {
        path: "userdetailsId",
        select: "username city profilephoto role"
      }
    })
    .sort({ createdAt: -1 })
    .lean();

    return NextResponse.json(
      { 
        success: true,
        count: books.length,
        books 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("❌ Search Books by Name Error:", error);
    return NextResponse.json(
      { 
        success: false,
        message: "Failed to search books",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}