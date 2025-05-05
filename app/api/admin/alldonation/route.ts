import { NextResponse } from "next/server";
import connectDB from "@/libs/mongodb";
import { Donation } from "@/models/model";

export async function GET() {
  await connectDB();

  try {
    const donations = await Donation.find()
      .populate("bookid", "title bookimg")
      .populate({
        path: "donorId",
        populate: {
          path: "userdetailsId",
        }
      })
      .populate({
        path: "userId",
        populate: {
          path: "userdetailsId",
        }
      })
      .sort({ createdAt: -1 })
      .lean();

    const formattedData = donations.map((d, index) => ({
      key: index.toString(),
      bookName: d.bookid?.title || "Unknown Book",
      bookImage: d.bookid?.bookimg || "",
      donorName: d.donorId?.userdetailsId?.username || "Anonymous",
      donorEmail: d.donorId?.email || "",
      userEmail: d.userId?.email || "",
      status: d.status,
      date: new Date(d.createdAt).toLocaleDateString()
    }));

    console.log("Formatted Data:", donations);

    return NextResponse.json({
      success: true,
      data: formattedData
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch recent donations"
    }, { status: 500 });
  }
}