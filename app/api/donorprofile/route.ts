import { NextResponse, NextRequest } from "next/server";
import mongoose from "mongoose";
import User from "@/models/UserSchema";
import Book from "@/models/BookSchema";
import connectDB from "@/libs/mongodb";

export async function POST(
  req: NextRequest
) {
  try {
    await connectDB();
    const body =   await req.json();
    const donorId = body.donorId; // Match the key in your frontend request
    if (!mongoose.Types.ObjectId.isValid(donorId)) {
      return NextResponse.json(
        { success: false, message: "Invalid user ID format" },
        { status: 400 }
      );
    }

    const user = await User.findById(donorId)
      .populate("userdetailsId")
      .lean()
      .exec();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (!("userdetailsId" in user) || !user.userdetailsId) {
      return NextResponse.json(
        { success: false, message: "User details not found" },
        { status: 404 }
      );
    }

    const donorbooks = await Book.find({ userId: donorId })
      .populate("userId")
      .lean()
      .exec();

    const userDetails = {
      profilephoto: user.userdetailsId.profilephoto,
      username: user.userdetailsId.username,
      email: user.email,
      city: user.userdetailsId.city,
    };

    return NextResponse.json(
      {
        success: true,
        message: "User found",
        userDetails,
        donorbooks,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error handling GET request:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Server error",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}