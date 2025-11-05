import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'Gmail', 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS  
  }
});

transporter.verify((error) => {
  if (error) {
      console.error('SMTP Connection Error:', error);
  } else {
      console.log('SMTP Server Ready');
  }
});

export const sendApprovalEmail = async (toEmail, bookTitle) => {
  const mailOptions = {
    from: `"PageTurn Admin" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Your Book "${bookTitle}" Has Been Approved`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #2ecc71;">Congratulations!</h2>
        <p>Your book <strong>${bookTitle}</strong> has been approved and is now listed on PageTurn.</p>
        <p>Thank you for your submission!</p>
        <p style="margin-top: 20px; color: #7f8c8d; font-size: 0.9em;">
          This is an automated message. Please do not reply directly to this email.
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending approval email:', error);
    throw error;
  }
};

export const sendRejectionEmail = async (toEmail, bookTitle, reason) => {
  const mailOptions = {
    from: `"PageTurn Admin" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Your Book "${bookTitle}" Submission Update`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #e74c3c;">Book Submission Update</h2>
        <p>We regret to inform you that your book <strong>${bookTitle}</strong> could not be approved.</p>
        <div style="background-color: #f9f9f9; padding: 10px; margin: 10px 0; border-left: 4px solid #e74c3c;">
          <strong>Reason:</strong> ${reason}
        </div>
        <p>You may resubmit with corrections if applicable.</p>
        <p style="margin-top: 20px; color: #7f8c8d; font-size: 0.9em;">
          This is an automated message. Please do not reply directly to this email.
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending rejection email:', error);
    throw error;
  }
};