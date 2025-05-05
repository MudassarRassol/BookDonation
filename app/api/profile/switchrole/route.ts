import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/libs/mongodb";
import UserDetails from "@/models/UserDetails";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  await connectDB();
  
  try {
    const { role } = await req.json();
    const userId = req.headers.get("userid");

    // Validate inputs
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, message: "Valid User ID is required" }, 
        { status: 400 }
      );
    }

    if (!['donor', 'recipient'].includes(role)) {
      return NextResponse.json(
        { success: false, message: "Invalid role specified" },
        { status: 400 }
      );
    }

    // Update role
    const updatedDetails = await UserDetails.findOneAndUpdate(
      { userId },
      { role },
      { new: true }
    );

    if (!updatedDetails) {
      return NextResponse.json(
        { success: false, message: "User details not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Role switched successfully",
      role: updatedDetails.role
    }, { status: 200 });

  } catch (error) {
    console.error("❌ Role Switch Error:", error);
    return NextResponse.json(
      { 
        success: false,
        message: "Failed to switch role",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}