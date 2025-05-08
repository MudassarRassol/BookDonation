import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/libs/mongodb";
import Donation from "@/models/DonationSchema";
import Book from "@/models/BookSchema";



export async function POST(req: NextRequest) {
  await dbConnect();

  try {


    const body = await req.json();
    const id = body.requestid;
    console.log(
      body,id
    )
    if (!id) {
      return NextResponse.json({ success: false, error: "Request ID is required" });
    }

    // Find and delete the request
    const deletedRequest = await Donation.findByIdAndDelete({
      _id : id
    });

    if (!deletedRequest) {
      return NextResponse.json({ success: false, error: "Request not found" });
    }

    // If the request was approved, make the book available again
    if (deletedRequest.status === "pending") {
      await Book.findByIdAndUpdate(
        deletedRequest.bookid,
        { status: "Available" },
        { new: true }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Request cancelled successfully",
    });
  } catch (error) {
    console.error("Error cancelling request:", error);
    return NextResponse.json({
      success: false,
      error: "Internal server error",
    });
  }
}
