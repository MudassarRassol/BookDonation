import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { serialize } from "cookie";
import { SignJWT } from "jose";
import User from "@/models/UserSchema";
import connectDB from "@/libs/mongodb";
import UserDetails from "@/models/UserDetails";
export async function POST(req: NextRequest) {
  try {
    await connectDB(); // Ensure DB connection

    const formData = await req.formData();
    const email = formData.get("email")?.toString() || "";
    const password = formData.get("password")?.toString() || "";

    if (!email || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Find user in DB
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    if (process.env.JWT_SECRET) {
      // Convert secret to Uint8Array for `jose`
      const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);

      // Generate JWT token using `jose`
      const token = await new SignJWT({ id: user._id.toString(), email: user.email })
        .setProtectedHeader({ alg: "HS256" }) // Algorithm
        .setIssuedAt()
        .setExpirationTime("7d") // Expiry
        .sign(secretKey);

      // Set token in HttpOnly cookie
      const cookie = serialize("token", token, {
        httpOnly: true,
        secure: false, // Allow HTTP in development
        sameSite: "lax", // More flexible than 'strict'
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      });


    if(user.info == true){
      const res = await UserDetails.findOne({
        userId : user._id
      })


      return new NextResponse(
        JSON.stringify({ message: "Login successful", user: { email: user.email, info: user.info , userId : user._id , varify : user.status },res }),
        {
          status: 200,
          headers: { "Set-Cookie": cookie, "Content-Type": "application/json" },
        }
      );
    }



      // Return response with cookie
      return new NextResponse(
        JSON.stringify({ message: "Login successful", user: { email: user.email, info: user.info , userId : user._id , varify : user.status } , res : {} }),
        {
          status: 200,
          headers: { "Set-Cookie": cookie, "Content-Type": "application/json" },
        }
      );
    } else {
      return NextResponse.json({ message: "JWT secret not configured" }, { status: 500 });
    }
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
