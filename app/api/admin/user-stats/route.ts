import { NextResponse } from "next/server";
import connectDB from "@/libs/mongodb";
import { UserDetails } from "@/models/model";

export async function GET() {
  await connectDB();
  
  try {
    const [totalUsers, admins, librarians, members] = await Promise.all([
      UserDetails.countDocuments(),
      UserDetails.countDocuments({ role: "admin" }),
      UserDetails.countDocuments({ role: "donor" }),
      UserDetails.countDocuments({ role: "recipient" })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        admins,
        librarians,
        members
      }
    });

  } catch {
    return NextResponse.json({
      success: false,
      error: "Failed to fetch user statistics"
    }, { status: 500 });
  }
}