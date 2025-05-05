// app/api/book/guestallbooks/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/libs/mongodb';
import { Book,UserDetails } from "@/models/model"
export async function GET(request: Request) {
  await connectDB();
  
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'Available';
    const condition = searchParams.get('condition');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || '-createdAt';
    const limit = parseInt(searchParams.get('limit') || '8');
    const page = parseInt(searchParams.get('page') || '1');

    const query: any = { status };
    if (condition) query.condition = condition;
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { author: new RegExp(search, 'i') }
      ];
    }

    const skip = (page - 1) * limit;
    const totalBooks = await Book.countDocuments(query);

    const books = await Book.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate({
        path: "userId",
        model: UserDetails,
        select: "username city profilephoto"
      });

    return NextResponse.json({
      success: true,
      data: books,
      pagination: {
        total: totalBooks,
        page,
        pages: Math.ceil(totalBooks / limit),
        limit
      }
    });

  } catch (error) {
    console.error("Error fetching books:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}