import { NextResponse } from "next/server";
import connectDB from "@/libs/mongodb";
import { Book, Donation } from "@/models/model";

export async function GET() {
  await connectDB();

  try {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 11);
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    const bookStats = await Book.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      }
    ]);

    const donationStats = await Donation.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      }
    ]);

    const monthlyData = [];

    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const tempDate = new Date(now.getFullYear(), now.getMonth() - i, 1);

      const year = tempDate.getFullYear();
      const month = tempDate.getMonth() + 1; // 0-based to 1-based

      const bookRecord = bookStats.find(
        (item) => item._id.year === year && item._id.month === month
      );
      const donationRecord = donationStats.find(
        (item) => item._id.year === year && item._id.month === month
      );

      // ✅ make sure tempDate is valid
      monthlyData.push({
        name: tempDate.toLocaleString('en-US', { month: 'short' }), // ✅ Locale is safe
        books: bookRecord ? bookRecord.count : 0,
        donations: donationRecord ? donationRecord.count : 0,
      });
    }

    return NextResponse.json({
      success: true,
      data: monthlyData
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch monthly stats"
    }, { status: 500 });
  }
}
