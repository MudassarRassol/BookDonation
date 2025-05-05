import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/libs/mongodb";
import Favorites from "@/models/FavouritesSchema";

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const { bookId, userId } = await req.json();

    // Check if already favorited
    const existingFavorite = await Favorites.findOne({ bookId, userId })

    if (existingFavorite) {
      return NextResponse.json(
        { success: false, message: "Book already in favorites" },
        { status: 400 }
      );
    }

    const newFavorite = new Favorites({
      bookId,
      userId
    });

    await newFavorite.save();

    return NextResponse.json(
      { success: true, message: "Added to favorites" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding to favorites:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add to favorites" },
      { status: 500 }
    );
  }
}


export async function DELETE(req: NextRequest) {
    await connectDB();
  
    try {
      const  data  = await req.json();
      const { bookId, userId } = data;

      if (!bookId || !userId) {
        return NextResponse.json(
          { success: false, message: "Missing bookId or userId" },
          { status: 400 }
        );
      }
  
      const result = await Favorites.findOneAndDelete({
        bookId: bookId,
        userId: userId,
      });
  
      if (!result) {
        return NextResponse.json(
          { success: false, message: "Favorite not found" },
          { status: 404 }
        );
      }
  
      return NextResponse.json(
        { success: true, message: "Removed from favorites" },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error removing from favorites:", error);
      return NextResponse.json(
        { success: false, message: "Failed to remove from favorites" },
        { status: 500 }
      );
    }
  }



export async function GET(req: NextRequest) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const bookId = searchParams.get('bookId');
    const userId = searchParams.get('userId');

    if (!bookId || !userId) {
      return NextResponse.json(
        { success: false, message: "Missing bookId or userId" },
        { status: 400 }
      );
    }

    const favorite = await Favorites.findOne({
      bookId: bookId,
      userId: userId,
    });

    return NextResponse.json(
      { 
        success: true, 
        isFavorite: !!favorite 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking favorite:", error);
    return NextResponse.json(
      { success: false, message: "Failed to check favorite status" },
      { status: 500 }
    );
  }
}