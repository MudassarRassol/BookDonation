import SendEmailForForgetPassword from "@/Email/SendEmailForForgetPassword";
import { NextResponse, NextRequest } from "next/server";
import User from "@/models/UserSchema";
import bcrypt from "bcryptjs"; // For password hashing
import connectDB from "@/libs/mongodb";
// ✅ GET: Send Reset Code
export async function GET(req: NextRequest) {
  await connectDB(); // Ensure DB connection
  try {
    const email = req.nextUrl.searchParams.get("email"); // Correct way to get email from query params

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const resetcode = Math.floor(1000 + Math.random() * 9000); // Ensuring 4-digit code

    await SendEmailForForgetPassword({ email, resetcode }); // ✅ Await the email sending

    await User.updateOne({ email }, {varificationcode : resetcode }); // ✅ Update user with reset code

    return NextResponse.json({ message: "Reset Code Sent" });
  } catch (err) {
    console.error("❌ Error sending reset code:", err);
    return NextResponse.json({ message: "Failed to send reset code" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
    try {
      const data = await req.json();
      const code = data.code;
  
      if (!code) {
        return NextResponse.json({ message: "Reset code is required" }, { status: 400 });
      }
  
      const user = await User.findOne({ varificationcode: Number(code) });
      if (!user) {
        return NextResponse.json({ message: "Invalid reset code" }, { status: 401 });
      }
  
      return NextResponse.json({ message: "Reset Code is correct" });
    } catch (err) {
      console.error("❌ Error validating reset code:", err);
      return NextResponse.json({ message: "Failed to validate reset code" }, { status: 500 });
    }
  }

// ✅ PUT: Reset Password
export async function PUT(req: NextRequest) {
  try {
    const data = await req.formData();
    const resetcode = data.get("resetcode");
    const newpassword = data.get("newpassword");

    if (!resetcode || !newpassword) {
      return NextResponse.json({ message: "Reset code and new password are required" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newpassword.toString(), 10); // Secure hashing

    const user = await User.findOneAndUpdate(
      { varificationcode: Number(resetcode) },
      { password: hashedPassword, varificationcode: null }, // Reset the reset code
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ message: "Invalid reset code" }, { status: 404 });
    }

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("❌ Error during password change:", err);
    return NextResponse.json({ message: "Error during password change" }, { status: 500 });
  }
}
