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
const SendEmailForForgetPassword = async ({ email, resetcode }: { email: string; resetcode: number }) => {
    try {
        // Email details
        const mailOptions = {
            from: `"Book Donation" <${process.env.GMAIL_USER}>`, // Sender email
            to: email, // Recipient email
            subject: `🔐 Reset Your Password - Book Donation`,
            text: `Your password reset code is: ${resetcode}`, // Plain text fallback
            html: `
                <div style="background: url('https://source.unsplash.com/600x400/?books,library') no-repeat center center; 
                            background-size: cover; 
                            padding: 50px 20px; 
                            text-align: center;
                            font-family: Arial, sans-serif;">
                    <div style="background: rgba(255, 255, 255, 0.9); padding: 30px; border-radius: 10px; display: inline-block;">
                        <h2 style="color: #2c3e50;">📚 Password Reset Code</h2>
                        <p style="color: #555; font-size: 16px;">Use the code below to reset your password:</p>
                        <h1 style="background: #007BFF; color: #fff; padding: 15px; border-radius: 8px; display: inline-block;">
                            ${resetcode}
                        </h1>
                        <p style="margin-top: 10px; color: #777; font-size: 14px;">This code is valid for a limited time. If you did not request a password reset, please ignore this email.</p>
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

export default SendEmailForForgetPassword;
