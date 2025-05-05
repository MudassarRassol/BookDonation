import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/libs/mongodb";
import User from "@/models/UserSchema";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    await connectDB(); // Connect to MongoDB

    const formData = await req.formData(); // Parse request body
    // Check if user already exists
    const existingUser = await User.findOne({ email : formData.get('email') });
    if (existingUser) {
      return NextResponse.json({ message: "Email already exists" }, { status: 400 });
    }

    // ✅ FIX: Await password hashing
    const password = formData.get('password')?.toString() || "";
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({ 
      email : formData.get('email')
      , password: hashedPassword });
    await newUser.save();

    return NextResponse.json({ message: "User created successfully" }, { status: 201 });

  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
