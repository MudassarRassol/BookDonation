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
    const donorMessage = data.get('donorMessage')?.toString();
    const pickupLocation = data.get('pickupLocation')?.toString();
    const pickupDate = data.get('pickupDate')?.toString();
    const pickupTime = data.get('pickupTime')?.toString();
    const latitude = data.get('latitude')?.toString();
    const longitude = data.get('longitude')?.toString();

    interface UpdateData {
      status: string | undefined;
      updatedAt: Date;
      donorMessage?: string;
      pickupLocation?: string;
      pickupDate?: string;
      pickupTime?: string;
      pickupCoordinates?: {
        type: string;
        coordinates: [number, number];
      };
    }

    const updateData: UpdateData = {
      status: status,
      updatedAt: new Date()
    };

    if (status === "approved") {
      updateData.donorMessage = donorMessage;
      updateData.pickupLocation = pickupLocation;
      updateData.pickupDate = pickupDate;
      updateData.pickupTime = pickupTime;
      
      if (latitude && longitude) {
        updateData.pickupCoordinates = {
          type: "Point",
          coordinates: [parseFloat(longitude), parseFloat(latitude)]
        };
      }
    }

    const donation = await Donation.findByIdAndUpdate(
      { _id: donationId },
      updateData,
      { new: true }
    ).populate('bookid');

    if (!donation) {
      return NextResponse.json({ success: false, error: "Request not found" });
    }

    const user = await User.findById({
      _id: donation.userId
    });

    const donor = await User.findById({
      _id: donation.donorId
    });

    const userdetailsid = await UserDetails.findById({
      _id: donor.userdetailsId
    });

    const newBookStatus = donation.status === "rejected" ? "Available" : "Not Available";
    const updatebook = await Book.findByIdAndUpdate(
      {_id: donation.bookid._id},
      { status: newBookStatus },
      { new: true }
    );

    await updatebook.save();

    await SendDonationStatusEmail({
      email: user.email,
      donorName: userdetailsid.username,
      donorEmail: donor.email,
      donorImage: userdetailsid.profilephoto,
      bookTitle: donation.bookid.title,
      bookImage: donation.bookid.bookimg,
      status: donation.status,
      requestDate: donation.createdAt,
      decisionDate: donation.updatedAt,
      donorMessage: donorMessage,
      pickupLocation: pickupLocation,
      pickupDate: pickupDate,
      pickupTime: pickupTime,
      latitude: latitude,
      longitude: longitude
    });

    return NextResponse.json({ success: true, data: donation });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message });
  }
}