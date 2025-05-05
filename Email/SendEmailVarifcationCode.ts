import nodemailer from "nodemailer";

// Gmail SMTP Transporter
const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER, // Your Gmail Address
        pass: process.env.GMAIL_PASS, // App Password from Google
    },
});

// Function to send verification email
const SendEmailForVerification = async ({ email, verificationCode }: { email: string; verificationCode: number }) => {
    try {
        // Email details
        const mailOptions = {
            from: `"Book Donation" <${process.env.GMAIL_USER}>`, // Sender email
            to: email, // Recipient email
            subject: `🔐 Verify Your Email - Book Donation`,
            text: `Your email verification code is: ${verificationCode}`, // Plain text fallback
            html: `
                <div style="background: url('https://source.unsplash.com/600x400/?books,library') no-repeat center center; 
                            background-size: cover; 
                            padding: 50px 20px; 
                            text-align: center;
                            font-family: Arial, sans-serif;">
                    <div style="background: rgba(255, 255, 255, 0.9); padding: 30px; border-radius: 10px; display: inline-block;">
                        <h2 style="color: #2c3e50;">📚 Email Verification Code</h2>
                        <p style="color: #555; font-size: 16px;">Use the code below to verify your email address:</p>
                        <h1 style="background: #28a745; color: #fff; padding: 15px; border-radius: 8px; display: inline-block;">
                            ${verificationCode}
                        </h1>
                        <p style="margin-top: 10px; color: #777; font-size: 14px;">This code is valid for a limited time. If you did not request an email verification, please ignore this email.</p>
                    </div>
                </div>
            `,
        };

        // Send email
        await transport.sendMail(mailOptions);
        console.log("✅ Verification email sent successfully");
    } catch (error) {
        console.error("❌ Error sending email:", error);
    }
};

export default SendEmailForVerification;
