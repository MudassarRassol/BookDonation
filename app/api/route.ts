import { NextResponse } from "next/server";
import connectDB from "@/libs/mongodb";

export async function GET() {
  await connectDB();  // Connects only if not already connected
  return NextResponse.json({ message: "Connected to MongoDB" });
}
