import { NextResponse } from "next/server";
import connectDB from "@/libs/mongodb";
import {User } from "@/models/model";


export async function GET() {
  await connectDB();
  
  try {

    const alluser = await User.find({}).select("-password -__v").populate("userdetailsId").lean();

    return NextResponse.json({
      success: true,
      Users : alluser
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Failed to fetch stats"
    }, { status: 500 });
  }
}