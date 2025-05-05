import { NextResponse, NextRequest } from "next/server";
import mongoose from "mongoose";
import User from "@/models/UserSchema";
import Book from "@/models/BookSchema";
import connectDB from "@/libs/mongodb";
export async function GET(  req: NextRequest,
    { params }: { params: { id: string } }) {
    try {
        await connectDB();


              const donorId = params.id;
   if (!mongoose.Types.ObjectId.isValid(donorId)) {
         return NextResponse.json(
           { success: false, message: "Invalid book ID format" },
           { status: 400 }
         );
       }

        const user = await User.findById(donorId).populate("userdetailsId").exec();
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        if (!user.userdetailsId) {
            return NextResponse.json({ success: false, message: "User details not found" }, { status: 404 });
        }

        const donorbooks = await Book.find({userId : donorId }).populate("userId").exec();

        const userDetails = {
            profilephoto: user.userdetailsId.profilephoto,
            username: user.userdetailsId.username,
            email: user.email,
            city: user.userdetailsId.city,
        };

        return NextResponse.json({
            success: true,
            message: "User found",
            userDetails,
            donorbooks,
        }, { status: 200 });

    } catch (error) {
        console.error("Error handling GET request:", error);
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}
