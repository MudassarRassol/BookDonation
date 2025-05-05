import { NextResponse } from "next/server";
import connectDB from "@/libs/mongodb";
import { Book } from "@/models/model";

export async function GET() {
  await connectDB();

  try {
    const categories = await Book.aggregate([
      {
        $match: {
          Category: { $ne: null, $exists: true }
        }
      },
      {
        $group: {
          _id: "$Category",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    return NextResponse.json({
      success: true,
      data: categories.map(c => ({
        name: c._id || "Unknown",   // fallback if needed
        value: c.count
      }))
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch book categories"
    }, { status: 500 });
  }
}
