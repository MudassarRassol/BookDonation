import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/libs/mongodb";
import User from "@/models/UserSchema";
import UserDetails from "@/models/UserDetails";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  await connectDB();
  
  try {
    // Extract userId from headers
    const userId = req.headers.get("userid");
    
    // Validate userId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, message: "Valid User ID is required" }, 
        { status: 400 }
      );
    }

    // Fetch both user and user details in parallel
    const [user, userDetails] = await Promise.all([
      User.findById(userId).select('-password -__v').lean(),
      UserDetails.findOne({ userId }).select('-__v').lean()
    ]);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Combine the data
    const accountDetails = {
      ...user,
      details: userDetails || null
    };

    return NextResponse.json({
      success: true,
      data: accountDetails
    }, { status: 200 });

  } catch (error) {
    console.error("❌ GET Account Details Error:", error);
    return NextResponse.json(
      { 
        success: false,
        message: "Failed to fetch account details",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}