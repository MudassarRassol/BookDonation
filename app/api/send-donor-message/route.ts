import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { User } from "@/models/model";
import connectDB from "@/libs/mongodb";

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export async function POST(req: Request) {
  await connectDB();

  try {
    const body = await req.json();
    const userId = req.headers.get("userid");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId).populate('userdetailsId');
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const {
      donorEmail,
      bookTitle,
      bookImage,
      message: userMessage,
    } = body;

    if (!donorEmail || !bookTitle || !userMessage) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const recipientName = user.userdetailsId?.name || "Book Lover";
    const recipientEmail = user.userdetailsId?.email || user.email;
    const recipientImage = user.userdetailsId?.profilephoto || "";

    const subject = `📖 New Message About Your Book "${bookTitle}"`;

    const mailOptions = {
      from: `"Book Sharing Platform" <${process.env.GMAIL_USER}>`,
      to: donorEmail,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 80% ; margin: 0 auto; padding: 10px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #2c3e50;">New Message About Your Book</h2>
          
          <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
            <h3 style="margin-top: 0;">${bookTitle}</h3>
            <img src="${bookImage}" alt="${bookTitle}" style="max-width: 200px; height: auto; margin: 10px 0; border-radius: 4px;" />
          </div>
          
          <div style="margin: 20px 0;">
            <h3 style="margin-bottom: 10px;">Message from ${recipientName} (${recipientEmail}):</h3>
            <div style="padding: 15px; background-color: #e3f2fd; border-radius: 5px;">
              <p style="margin: 0; font-style: italic;">"${userMessage}"</p>
            </div>
          </div>
          
          ${recipientImage ? `
          <div style="margin: 15px 0; text-align: center;">
            <img src="${recipientImage}" alt="${recipientName}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 2px solid #e0e0e0;" />
          </div>
          ` : ''}
          
          <div style="margin-top: 30px; font-size: 14px; color: #7f8c8d;">
            <p>Please respond directly to ${recipientName} at ${recipientEmail}.</p>
            <p>Thank you for using our platform!</p>
          </div>
        </div>
      `,
    };

    await transport.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send message" },
      { status: 500 }
    );
  }
}