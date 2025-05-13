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
  donorImage: string;
  bookTitle: string;
  bookImage: string;
  status: "approved" | "rejected";
  requestDate: string;
  decisionDate: string;
  donorMessage?: string;
  pickupLocation?: string;
  pickupDate?: string;
  pickupTime?: string;
  latitude?: string;
  longitude?: string;
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
  donorMessage,
  pickupLocation,
  pickupDate,
  pickupTime,
  latitude,
  longitude
}: EmailProps) => {
  try {
    console.log( pickupDate,
  pickupTime)
    const subject = `📚 ${status === "approved" ? "Your Book Request Was Approved!" : "Update on Your Book Request"}`;
    const decisionColor = status === "approved" ? "#10B981" : "#EF4444"; // Tailwind green-500 vs red-500
    const statusIcon = status === "approved" ? "✅" : "❌";
    const statusText = status === "approved" ? "Approved!" : "Not Approved";

    // Generate map link and static map
    let mapLink = "";
    // let staticMapUrl = "";
    if (latitude && longitude) {
      mapLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
      // staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=15&size=600x300&maptype=roadmap&markers=color:red%7C${latitude},${longitude}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
    } else if (pickupLocation) {
      mapLink = `https://www.google.com/maps?q=${encodeURIComponent(pickupLocation)}`;
      // staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(pickupLocation)}&zoom=15&size=600x300&maptype=roadmap&markers=color:red%7C${encodeURIComponent(pickupLocation)}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
    }

    const mailOptions = {
      from: `"BookShare Team" <${process.env.GMAIL_USER}>`,
      to: email,
      subject,
      html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
          body { font-family: 'Poppins', Arial, sans-serif; margin: 0; padding: 0; background-color: #f7fafc; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white; }
          .content { padding: 30px; }
          .book-image { width: 100%; height: 250px; object-fit: cover; border-bottom: 4px solid ${decisionColor}; }
          .status-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; background-color: ${decisionColor}; color: white; font-weight: 600; margin-bottom: 20px; }
          .section { margin-bottom: 25px; padding-bottom: 25px; border-bottom: 1px solid #e2e8f0; }
          .section-title { font-size: 18px; font-weight: 600; color: #2d3748; margin-bottom: 15px; display: flex; align-items: center; }
          .section-title svg { margin-right: 8px; }
          .info-grid { display: grid; grid-template-columns: 100px 1fr; gap: 10px; margin-bottom: 8px; }
          .info-label { font-weight: 500; color: #4a5568; }
          .info-value { color: #2d3748; }
          .map-container { border-radius: 8px; overflow: hidden; margin: 15px 0; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); }
          .donor-card { display: flex; align-items: center; margin-top: 15px; }
          .donor-avatar { width: 60px; height: 60px; border-radius: 50%; object-fit: cover; margin-right: 15px; border: 2px solid #e2e8f0; }
          .footer { text-align: center; padding: 20px; background-color: #f7fafc; color: #718096; font-size: 12px; }
          .cta-button { display: inline-block; padding: 12px 24px; background-color: ${decisionColor}; color: white; text-decoration: none; border-radius: 6px; font-weight: 500; margin-top: 15px; }
          .message-box { background-color: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid ${decisionColor}; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 24px; font-weight: 600;">BookShare Donation Update</h1>
            <p style="margin: 8px 0 0; opacity: 0.9;">Your book request has been processed</p>
          </div>
          
          <img src="${bookImage}" alt="${bookTitle}" class="book-image">
          
          <div class="content">
            <div class="status-badge">${statusIcon} ${statusText}</div>
            
            <h2 style="margin: 0 0 15px; color: #2d3748; font-size: 20px;">
              ${status === "approved" ? 'Ready for Pickup!' : 'Request Not Approved'}
            </h2>
            
            <p style="margin: 0 0 25px; color: #4a5568; line-height: 1.5;">
              ${status === "approved" 
                ? `Your request for <strong>"${bookTitle}"</strong> has been approved by the donor. Below you'll find all the details for picking up your book.` 
                : `We're sorry to inform you that your request for <strong>"${bookTitle}"</strong> has not been approved by the donor.`}
            </p>
            
            ${status === "approved" ? `
              <div class="section">
                <div class="section-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="${decisionColor}"/>
                  </svg>
                  Pickup Information
                </div>
                
                <div class="info-grid">
                  <div class="info-label">Location:</div>
                  <div class="info-value">${pickupLocation}</div>
                </div>
                
                ${mapLink ? `
                  <div class="map-container">
                    <div style="text-align: center; margin-top: 8px;">
                      <a href="${mapLink}" target="_blank" style="color: #3b82f6; text-decoration: none; font-size: 14px; display: inline-flex; align-items: center;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 4px;">
                          <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M12 11C13.1046 11 14 10.1046 14 9C14 7.89543 13.1046 7 12 7C10.8954 7 10 7.89543 10 9C10 10.1046 10.8954 11 12 11Z" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Open in Google Maps
                      </a>
                    </div>
                  </div>
                ` : ''}
                
                <div class="info-grid">
                  <div class="info-label">Date:</div>
                  <div class="info-value">${pickupDate}</div>
                </div>
                
                <div class="info-grid">
                  <div class="info-label">Time:</div>
                  <div class="info-value">${pickupTime}</div>
                </div>
                
                ${donorMessage ? `
                  <div class="message-box">
                    <p style="margin: 0; font-style: italic; color: #4a5568;">"${donorMessage}"</p>
                  </div>
                ` : ''}
              </div>
            ` : ''}
            
            <div class="section">
              <div class="section-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="#4a5568" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M16 2V6" stroke="#4a5568" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M8 2V6" stroke="#4a5568" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M3 10H21" stroke="#4a5568" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Request Timeline
              </div>
              
              <div class="info-grid">
                <div class="info-label">Requested:</div>
                <div class="info-value">${new Date(requestDate).toLocaleString()}</div>
              </div>
              
              <div class="info-grid">
                <div class="info-label">Status Update:</div>
                <div class="info-value">${new Date(decisionDate).toLocaleString()}</div>
              </div>
            </div>
            
            <div class="section" style="border-bottom: none;">
              <div class="section-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#4a5568" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#4a5568" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Donor Information
              </div>
              
              <div class="donor-card">
                <img src="${donorImage}" alt="${donorName}" class="donor-avatar">
                <div>
                  <h3 style="margin: 0 0 4px; color: #2d3748;">${donorName}</h3>
                  <p style="margin: 0; color: #4a5568;">${donorEmail}</p>
                  ${status === "approved" ? `
                    <a href="mailto:${donorEmail}" class="cta-button">Contact Donor</a>
                  ` : ''}
                </div>
              </div>
            </div>
          </div>
          
          <div class="footer">
            <p style="margin: 0;">© ${new Date().getFullYear()} BookShare. All rights reserved.</p>
            <p style="margin: 8px 0 0; font-size: 11px; color: #a0aec0;">
              This email was sent regarding your book request. If you didn't make this request, please ignore this message.
            </p>
          </div>
        </div>
      </body>
      </html>
      `,
    };

    await transport.sendMail(mailOptions);
    console.log("✅ Donation status email sent successfully");
  } catch (error) {
    console.error("❌ Error sending donation status email:", error);
    throw error;
  }
};

export default SendDonationStatusEmail;