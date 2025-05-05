import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/libs/mongodb";

import mongoose from "mongoose";
import { Book,User } from "@/models/model"
export async function GET(req: NextRequest) {
  await connectDB();
  
  try {
    // Extract userId from headers
    const userId = req.headers.get("userid");
    const user = await User.findById(userId).populate("userdetailsId","city");
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" }, 
        { status: 404 }
      );
    }



    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, message: "Valid User ID is required" }, 
        { status: 400 }
      );
    }

    // Find books for this user, sorted by createdAt in descending order
    const books = await Book.find().populate({
      path: "userId",
      select: "email userdetailsId",
      populate: {
        path: "userdetailsId",
        select: "city"
      }
    })
    .sort({ createdAt: -1 }) // Sorting by creation date, newest first
    .limit(6) // Limiting the result to 5 books
    .lean(); // Converting to plain JavaScript objects

    const recepientbooks =  books.filter((book) => book.userId.userdetailsId.city === user.userdetailsId.city && book.userId._id.toString() !== userId.toString());

      if(recepientbooks.length > 0) {
        return NextResponse.json(
            { 
              success: true,
              count: recepientbooks.length,
              books: recepientbooks,
              message: "Books fetched successfully",
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