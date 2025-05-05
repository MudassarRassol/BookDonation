import Donation from "@/models/DonationSchema";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const id = req.headers.get("userid");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID not provided in headers",
        },
        { status: 400 }
      );
    }

    const donation = await Donation.find({
        donorId: id,
        status : "pending"
      }).populate([
        {
          path: "userId",
          populate: {
            path: "userdetailsId",
          },
        },
        {
          path: "bookid",
          populate:{
            path : "userId",
            populate : 'userdetailsId'
          }
        },
      ]);

      console.log(donation)
      
      
    if (donation.length > 0) {
      return NextResponse.json({
        message: "Donation fetched successfully",
        donation: donation,
      });
    } else {
      return NextResponse.json({
        message: "No donation requests found",
      });
    }
  } catch (error) {
    console.error("❌ GET Donation Details Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch donation",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
