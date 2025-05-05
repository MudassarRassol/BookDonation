import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/libs/mongodb";
import Donation from "@/models/DonationSchema";
import Book from "@/models/BookSchema";
import SendDonationStatusEmail from "@/Email/SendDonationStatusEmail";
import User from "@/models/UserSchema";
import UserDetails from "@/models/UserDetails";

export async function PUT(req: NextRequest) {
  await dbConnect();
  try {
    const data = await req.formData();
    const donationId = data.get('donationId')?.toString();
    const status = data.get('status')?.toString();


    console.log(donationId,status)
    const donation = await Donation.findByIdAndUpdate(
      { _id: donationId },
      { status: status },
      { new: true }
    ).populate('bookid')

    const user = await User.findById({
      _id : donation.userId
    });

    const donor = await User.findById({
      _id : donation.donorId
    })

    const userdetailsid = await UserDetails.findById({
      _id : donor.userdetailsId
    })



    console.log(userdetailsid)

    console.log(user)

    if (!donation) {
      return NextResponse.json({ success: false, error: "Request not found" });
    }

    // Update book status based on donation status


    
    const newBookStatus = donation.status === "rejected" ? "Available" : "Not Available";
     const updatebook = await Book.findByIdAndUpdate(
      {_id : donation.bookid._id},
      { status: newBookStatus },
      { new: true }
    );

    await updatebook.save();

    

    console.log(newBookStatus)

    // Send email to requester with donor details
    await SendDonationStatusEmail({
      email: user.email, // Requester's email
      donorName: userdetailsid.username,
      donorEmail: donor.email,
      donorImage: userdetailsid.profilephoto,
      bookTitle: donation.bookid.title,
      bookImage: donation.bookid.bookimg,
      status: donation.status ,
      requestDate: donation.createdAt,
      decisionDate: donation.updatedAt,
    });

    return NextResponse.json({ success: true, data: donation });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message });
  }
}