import SendEmailForVerification from "@/Email/SendEmailVarifcationCode";
import { NextResponse, NextRequest } from "next/server";
import User from "@/models/UserSchema";
import connectDB from "@/libs/mongodb";
// ✅ GET: Send Reset Code
export async function POST(req: NextRequest) {
  await connectDB(); // Ensure DB connection
  try {

    const { email } = await req.json(); // Extract email from request body
    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const varificationcode = Math.floor(1000 + Math.random() * 9000); // Ensuring 4-digit code

    await SendEmailForVerification({ email, verificationCode: varificationcode }); // ✅ Await the email sending

    await User.updateOne({ email }, {varificationcode : varificationcode }); // ✅ Update user with reset code

    return NextResponse.json({ message: "Varification Code Sent" });
  } catch (err) {
    console.error("❌ Error sending reset code:", err);
    return NextResponse.json({ message: "Failed to send Varification code" }, { status: 500 });
  }
}

// export async function POST(req: NextRequest) {
//     try {
//       const data = await req.json();
//       const code = data.code;
  
//       if (!code) {
//         return NextResponse.json({ message: "Varification code is required" }, { status: 400 });
//       }
  
//       const user = await User.findOne({ varificationcode: Number(code) });
//       if(code  === user?.varificationcode) {
//         await User.findOneAndUpdate({ varificationcode: Number(code) }, { status: "verified" , varificationcode: null });
//       }
//       if (!user) {
//         return NextResponse.json({ message: "Invalid Varification code" }, { status: 401 });
//       }
  
//       return NextResponse.json({ message: "Varification Code is correct" });
//     } catch (err) {
//       console.error("❌ Error validating reset code:", err);
//       return NextResponse.json({ message: "Failed to validate Varification code" }, { status: 500 });
//     }
//   }


