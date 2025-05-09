import { UploadImage } from "@/libs/uploadimg";
import { NextRequest, NextResponse } from "next/server";
import UserDetails from "@/models/UserDetails";
import connectDB from "@/libs/mongodb";
import User from "@/models/UserSchema";

export async function POST(req: NextRequest) {
  await connectDB();
  try {
    // Handle FormData
    const userId = req.headers.get("userid")
  
    const formData = await req.formData();
    const username = formData.get("username")?.toString();
    const city = formData.get("city")?.toString()?.toLocaleLowerCase().toLocaleLowerCase();
    const address = formData.get("address")?.toString();
    const role = formData.get("role")?.toString();
    const image = formData.get("image") as File;

    if (!username || !city || !address || !role) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    

    const checkDetails = await UserDetails.findOne({ userId });

    if(checkDetails){
      return NextResponse.json({ message: "User info already exists / Go to Edit Page" }, { status: 400 });
    }

    if (image) {
     const imageUrl = await UploadImage(image, "image-upload");

      const user = new UserDetails({
        userId,
        username,
        city,
        address,
        role,
        profilephoto: imageUrl,
      });


      await user.save();
      
      
      const updateinfo = await User.findById({
        _id : userId
      })

      if(updateinfo){
        await User.findByIdAndUpdate({_id:userId},{info:true,userdetailsId:user._id})
      }

      return NextResponse.json({ message: "User info added", user });
    }

    // Save to database

  } catch (error) {
    console.error("❌ API Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
