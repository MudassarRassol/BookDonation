import User from "@/models/UserSchema";
import { NextResponse, NextRequest } from "next/server";
import Donation from "@/models/DonationSchema";
import connectDB from "@/libs/mongodb";
export async function GET(req: NextRequest) {
    try {
        console.log('rub')
        // Connect to database first
        await connectDB();

        const id = req.headers.get("userid");

        if (!id) {
            return NextResponse.json(
                { success: false, error: "User ID is required" }, 
                { status: 400 }
            );
        }

        // Find user with populated details
        const user = await User.findById(id).populate('userdetailsId');
        if (!user) {
            return NextResponse.json(
                { success: false, error: "User not found" }, 
                { status: 404 }
            );
        }

        let donationHistory = [];
        let approvedBooks = [];
        let rejectedBooks = [];
        let pendingBooks = [];

        console.log(user.userdetailsId.role)
        if (user.userdetailsId.role === 'donor') {
    
            // For donors, get all donations they've received
            donationHistory = await Donation.find({ donorId: id })
            .populate({
                path : 'userId',
                populate : 'userdetailsId'
            })
                .populate('bookid').sort({ _id: -1 });

            approvedBooks = donationHistory.filter(book => book.status === "approved");
            rejectedBooks = donationHistory.filter(book => book.status === "rejected");
            pendingBooks = donationHistory.filter(book => book.status === "pending");
        } else {
            console.log('run')
            // For recipients, get all donations they've requested
            donationHistory = await Donation.find({ userId: id })
                .populate({
                    path : 'donorId',
                    populate : 'userdetailsId'
                })
                .populate('bookid').sort({ _id: -1 });


            approvedBooks = donationHistory.filter(book => book.status === "approved");
            rejectedBooks = donationHistory.filter(book => book.status === "rejected");
            pendingBooks = donationHistory.filter(book => book.status === "pending");
        }

        return NextResponse.json(
            { 
                success: true, 
                data: {
                    user: {
                        _id: user._id,
                        email: user.email,
                        username: user.userdetailsId.username,
                        role: user.userdetailsId.role,
                        profilePhoto: user.userdetailsId.profilephoto,
                        city: user.userdetailsId.city
                    },
                    stats: {
                        totalRequests: donationHistory.length,
                        approved: approvedBooks.length,
                        rejected: rejectedBooks.length,
                        pending: pendingBooks.length
                    },
                    donationHistory,
                    approvedBooks,
                    rejectedBooks,
                    pendingBooks
                }
            }, 
            { status: 200 }
        );

    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: "Internal Server Error", 
                    details: error.message 
                }, 
                { status: 500 }
            );
        } else {
            return NextResponse.json(
                { 
                    success: false, 
                    error: "Internal Server Error", 
                    details: "An unknown error occurred" 
                }, 
                { status: 500 }
            );
        }
    }
}