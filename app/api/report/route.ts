import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/libs/mongodb";
import User from "@/models/UserSchema";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const { donorId } = await req.json();
    const userId = req.headers.get("userid");

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, message: "Valid User ID is required" },
        { status: 400 }
      );
    }

    const donor = await User.findById(donorId);
    if (!donor) {
      return NextResponse.json(
        { success: false, message: "Donor not found" },
        { status: 404 }
      );
    }

    // Check if already reported
    if (donor.reportsBy?.includes(new mongoose.Types.ObjectId(userId))) {
      return NextResponse.json(
        { success: false, message: "User already reported this donor" },
        { status: 400 }
      );
    }

    // Add report
    donor.reportsBy?.push(new mongoose.Types.ObjectId(userId));
    donor.report = (donor.report ?? 0) + 1;

    // Block donor if report count >= 3
    if (donor.report >= 3) {
      donor.account = "blocked";
    }

    await donor.save();

    return NextResponse.json({
      success: true,
      message: "Reported Donor successfully",
    });

  } catch (error) {
    console.error("❌ Report Donor Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to report donor",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
