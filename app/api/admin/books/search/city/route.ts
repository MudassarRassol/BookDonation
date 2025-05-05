import { NextResponse } from "next/server";
import connectDB from "@/libs/mongodb";
import { Book } from "@/models/model";

export async function GET(request: Request) {
  await connectDB();
  
  try {
    const { searchParams } = new URL(request.url);
    const cityQuery = searchParams.get('q');

    if (!cityQuery) {
      return NextResponse.json(
        { success: false, message: "City query is required" },
        { status: 400 }
      );
    }

    const books = await Book.find()
      .populate({
        path: "userId",
        select: "userdetailsId",
        populate: {
          path: "userdetailsId",
          select: "username city profilephoto role",
          match: { city: { $regex: cityQuery, $options: 'i' } }
        }
      })
      .sort({ createdAt: -1 })
      .lean();

    // Filter out books without matching city
    const filteredBooks = books.filter(book => 
      book.userId?.userdetailsId?.city?.toLowerCase().includes(cityQuery.toLowerCase())
    );

    return NextResponse.json(
      { 
        success: true,
        count: filteredBooks.length,
        books: filteredBooks 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("❌ Search Books by City Error:", error);
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