import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/libs/mongodb";
import { Book,User } from "@/models/model"
 import mongoose from "mongoose";
export async function GET(req: NextRequest) {
  await connectDB();

  try {
    // Get query parameters
    const { searchParams } = new URL(req.url);
    const id = req.headers.get("userid");

    let role;
    if(!id){
      role = "guest"; // Default to 'guest' if no user found
     }
  
    console.log('running getallbooks route')
    const user = await User.findById(id).populate("userdetailsId");
    role = !Array.isArray(user) && user?.userdetailsId?.role || "guest"; // Default to 'guest' if no user found
    console.log('user', user);
    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '8');
    const skip = (page - 1) * limit;

    // Filter parameters
    const searchTerm = searchParams.get('search') || '';
    const condition = searchParams.get('condition')?.toLowerCase() || '';
    const status = searchParams.get('status') || '';
    const category = searchParams.get('category') || '';

    // Build base query
    const query: Record<string, unknown> = {};
    console.log(role, "role")
    // Role-specific filtering
    if (id && role === 'donor') {
      query.userId = new mongoose.Types.ObjectId(id);
    }
    // For recipients and guests, don't filter by status by default
    // Let the frontend filters handle it

    // Search filter (title, author, or description)
    if (searchTerm) {
      query.$or = [
        { title: { $regex: searchTerm, $options: 'i' } },
        { author: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } }
      ];
    }

    // Additional filters

    if (condition) {
      const formattedCondition = condition.charAt(0).toUpperCase() + condition.slice(1).toLowerCase();
      query.condition = formattedCondition;
    }
    if (status) query.status = status;
    if (category) query.Category = category;

    // Get paginated books and total count
    const [books, total] = await Promise.all([
      Book.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .populate({
          path: 'userId',
          populate: { path: 'userdetailsId' }
        }),
      Book.countDocuments(query)
    ]);

    let  recipientBooks;

    if (role === 'recipient') {
      const userId = req.headers.get("userId");
      console.log("Recipient role detected, filtering books by city.");
      console.log( books.length > 0 ?  books[0].userId.userdetailsId.city + user?.userdetailsId.city  : 'NO BOOK FOUND');
       recipientBooks = books.filter((book) => book.userId.userdetailsId.city === user?.userdetailsId.city && book.userId._id.toString() !== userId?.toString());
      // recipientBooks = books.filter((book) => book.userId && user?.userdetailsId?.city && book.userId.userdetailsId.city === user.userdetailsId.city && userId && book.userId._id.toString() !== userId.toString());
    }

    return NextResponse.json({
      success: true,
      data:  role === 'recipient' ? recipientBooks : books,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      filters: {
        searchTerm,
        condition,
        status,
        category
      }
    }, { status: 200 });

  } catch (error) {
    console.error("❌ GET Books Error:", error);
    return NextResponse.json(
      { 
        success: false,
        message: "Failed to fetch books",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}