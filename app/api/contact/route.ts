// app/api/contact/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    // Basic validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const mailOptions = {
      from: `"BookShare Contact Form" <${process.env.GMAIL_USER}>`,
      to: process.env.CONTACT_RECEIVING_EMAIL || process.env.GMAIL_USER,
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #2c3e50;">New Contact Form Submission</h2>
          
          <div style="margin: 20px 0;">
            <h3 style="margin-bottom: 5px;">From:</h3>
            <p style="margin: 0;">${name} (${email})</p>
          </div>
          
          <div style="margin: 20px 0;">
            <h3 style="margin-bottom: 5px;">Subject:</h3>
            <p style="margin: 0;">${subject}</p>
          </div>
          
          <div style="margin: 20px 0;">
            <h3 style="margin-bottom: 5px;">Message:</h3>
            <div style="padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
              <p style="margin: 0; white-space: pre-line;">${message}</p>
            </div>
          </div>
          
          <div style="margin-top: 30px; font-size: 14px; color: #7f8c8d;">
            <p>This message was sent from the BookShare contact form.</p>
            <p>You can reply directly to ${email}.</p>
          </div>
        </div>
      `,
    };

    await transport.sendMail(mailOptions);

    // Send a confirmation email to the user
    const userMailOptions = {
      from: `"BookShare" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Thank you for contacting BookShare",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #2c3e50;">Thank you for your message, ${name}!</h2>
          
          <div style="margin: 20px 0;">
            <p>We've received your message and will get back to you as soon as possible.</p>
            <p>Here's a copy of your submission:</p>
          </div>
          
          <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-line; margin-top: 10px;">${message}</p>
          </div>
          
          <div style="margin-top: 30px; font-size: 14px; color: #7f8c8d;">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>If you need to add anything to your message, please contact us again through our website.</p>
          </div>
        </div>
      `,
    };

    await transport.sendMail(userMailOptions);

    return NextResponse.json({ 
      success: true,
      message: "Message sent successfully" 
    });
  } catch (error) {
    console.error("Error sending contact form:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to send message. Please try again later." 
      },
      { status: 500 }
    );
  }
}