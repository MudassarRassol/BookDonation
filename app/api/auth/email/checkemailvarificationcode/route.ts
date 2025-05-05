
import { NextResponse, NextRequest } from "next/server";
import User from "@/models/UserSchema";

export async function POST(req: NextRequest) {
    try {
      const data = await req.json();
      const code = data.code;
  
      if (!code) {
        return NextResponse.json({ message: "Varification code is required" }, { status: 400 });
      }
  
      const user = await User.findOne({ varificationcode: Number(code) });
      if(code  === user?.varificationcode) {
        await User.findOneAndUpdate({ varificationcode: Number(code) }, { status: "verified" , varificationcode: null });
      }
      if (!user) {
        return NextResponse.json({ message: "Invalid Varification code" }, { status: 401 });
      }
  
      return NextResponse.json({ message: "Varification Code is correct" });
    } catch (err) {
      console.error("❌ Error validating reset code:", err);
      return NextResponse.json({ message: "Failed to validate Varification code" }, { status: 500 });
    }
  }