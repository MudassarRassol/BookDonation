import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/libs/mongodb";
import Favourites from "@/models/FavouritesSchema";


export async function POST(req: NextRequest) {
  await connectDB();

  try {

    const  {data}  = await req.json();
    console.log(data)
   const bookId = data.bookId;
    const userId = data.userId;

    if (!bookId || !userId) {
      return NextResponse.json(
        { success: false, message: "Missing bookId or userId" },
        { status: 400 }
      );
    }

    const favorite = await Favourites.findOne({
      bookId: bookId,
      userId: userId
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