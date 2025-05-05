import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/libs/mongodb";
import mongoose from "mongoose";
import { Book } from "@/models/model"
export async function GET(req: NextRequest) {
  await connectDB();
  
  try {
    // Extract userId from headers and validate
    const userId = req.headers.get("userid");
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, message: "Valid User ID is required" }, 
        { status: 400 }
      );
    }

    // Get pagination parameters from query
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '8');
    const skip = (page - 1) * limit;

    // Build query
    const query = { userId: new mongoose.Types.ObjectId(userId) };
    
    // Get paginated books
    const [books, total] = await Promise.all([
      Book.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Book.countDocuments(query)
    ]);

    return NextResponse.json({
      success: true,
      data: books,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }, { status: 200 });

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