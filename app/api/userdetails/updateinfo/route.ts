import { UploadImage } from "@/libs/uploadimg";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/libs/mongodb";
import { UserDetails } from "@/models/model";

export async function PUT(req: NextRequest) {
  await connectDB();
  try {
    const userId = req.headers.get("userid");
    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const username = formData.get("username")?.toString();
    const city = formData.get("city")?.toString().toLocaleLowerCase();
    const address = formData.get("address")?.toString();
    const image = formData.get("image") as File;

    if (!username || !city || !address) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const existingDetails = await UserDetails.findOne({ userId });
    if (!existingDetails) {
      return NextResponse.json(
        { message: "User details not found" },
        { status: 404 }
      );
    }

    let upimg;
    // Handle image upload if new image is provided
    if (image) {
    upimg = await UploadImage(image, "image-upload");
    }

    const updateData = {
      username,
      city,
      address,
      profilephoto : upimg
    };

    const updatedUser = await UserDetails.findOneAndUpdate(
      { userId },
      updateData,
      { new: true }
    );

    return NextResponse.json(
      { message: "User info updated successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
