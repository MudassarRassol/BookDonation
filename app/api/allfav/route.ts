import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/libs/mongodb";
import Favourites from "@/models/FavouritesSchema";
import Book from "@/models/BookSchema";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const userId = req.headers.get("userid") ;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "8");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    // Get favorite book IDs for the user
    const favorites = await Favourites.find({
      userId: new mongoose.Types.ObjectId(userId),
    })
      .skip(skip)
      .limit(limit)
      .lean();

    const bookIds = favorites.map((fav) => fav.bookId);

    // Get total count of favorites
    const total = await Favourites.countDocuments({
      userId: new mongoose.Types.ObjectId(userId),
    });

    // Get complete book details
    const books = await Book.find({ _id: { $in: bookIds } })
      .populate({
        path: "userId",
        populate: { path: "userdetailsId" },
      })
      .lean();

    return NextResponse.json(
      {
        success: true,
        data: books,
        total,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch favorites" },
      { status: 500 }
    );
  }
}