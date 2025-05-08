import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

interface EmailProps {
  email: string;
  donorName: string;
  donorEmail: string;
  donorImage: string; // this is a URL
  bookTitle: string;
  bookImage: string;
  status: "approved" | "rejected";
  requestDate: string;
  decisionDate: string;
}



const SendDonationStatusEmail = async ({
  email,
  donorName,
  donorEmail,
  donorImage,
  bookTitle,
  bookImage,
  status,
  requestDate,
  decisionDate,
}: EmailProps) => {
  try {
    const subject = `📦 Your Book Donation Request Has Been ${status.toUpperCase()}`;
    const decisionColor = status === "approved" ? "#28a745" : "#dc3545";
    const statusText = status === "approved" ? "Approved ✅" : "Rejected ❌";
;

    const mailOptions = {
      from: `"Book Donation" <${process.env.GMAIL_USER}>`,
      to: email,
      subject,
      html: `
        <div style="background: #f4f4f4; padding: 10px; font-family: Arial, sans-serif;">
          <div style="background: white; max-width: 600px; margin: auto; border-radius: 10px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            <img src="${bookImage}" alt="Book Image" style="width: 100%; height: auto; display: block;" />
            <div style="padding: 30px;">
              <h2 style="color: ${decisionColor}; margin-bottom: 10px;">${statusText}</h2>
              <p style="font-size: 16px;">Your request for the book <strong>"${bookTitle}"</strong> has been <strong>${status}</strong>.</p>

              <hr style="margin: 20px 0;" />
              <h3>📅 Request Details:</h3>
              <p><strong>Requested on:</strong> ${requestDate}</p>
              <p><strong>${status === "approved" ? "Approved" : "Rejected"} on:</strong> ${decisionDate}</p>

              <hr style="margin: 20px 0;" />
              <h3>🙋‍♂️ Donor Information:</h3>
              <img 
                src="${donorImage}" 
                alt="Donor Image" 
                width="80" 
                height="80" 
                style="border-radius: 50%; display: block; margin: 10px 0;" 
              />
              <p><strong>Name:</strong> ${donorName}</p>
              <p><strong>Email:</strong> ${donorEmail}</p>

              <p style="color: #777; font-size: 13px; margin-top: 30px;">If you did not make this request, please disregard this email.</p>
            </div>
          </div>
        </div>
      `,
    };

    await transport.sendMail(mailOptions);
    console.log("✅ Donation status email sent with embedded base64 image");
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};

export default SendDonationStatusEmail;
