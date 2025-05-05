import { NextResponse } from "next/server";
import connectDB from "@/libs/mongodb";
import { Book, Donation, User } from "@/models/model";

export async function GET() {
  await connectDB();
  
  try {
    const [
      totalBooks,
      totalDonations,
      totalUsers,
      pendingDonations,
      approvedDonations,
      rejectedDonations
    ] = await Promise.all([
      Book.countDocuments(),
      Donation.countDocuments(),
      User.countDocuments(),
      Donation.countDocuments({ status: "pending" }),
      Donation.countDocuments({ status: "approved" }),
      Donation.countDocuments({ status: "rejected" }),
    ]);

    return NextResponse.json({
      success: true,
      data: { 
        totalBooks, 
        totalDonations, 
        totalUsers,
        pendingDonations,
        approvedDonations,
        rejectedDonations
      }
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Failed to fetch stats"
    }, { status: 500 });
  }
}