
import nodemailer, { createTransport } from 'nodemailer';



const transport = createTransport({
    service:'gmail',
    auth:{
        user:'cse.takeoff@gmail.com',
        pass:'digkagfgyxcjltup',
    }
});




export const sendIncomeLess = async (email: string, amount: number) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'cse.takeoff@gmail.com',
      pass: process.env.EMAIL_PASS || 'digkagfgyxcjltup',
    },
  });

  const mailOptions = {
    from: 'cse.takeoff@gmail.com',
    to: email,
    subject: `Your Income Notification`,
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="background-color: #FF5733; color: white; padding: 15px; text-align: center; border-radius: 5px;">
          <h2>Income Alert: Your Income is Below the Expected Threshold</h2>
        </div>
        <div style="background-color: white; padding: 20px; margin-top: 10px; border-radius: 5px;">
          <p>Dear User,</p>
          <p>We noticed that your current income of <strong>$${amount.toFixed(2)}</strong> is below the expected threshold for your financial goals.</p>
          <p>Here are a few suggestions to help improve your income or manage your budget more effectively:</p>
          <ul style="padding-left: 20px;">
            <li>Review your expenses and identify areas to save</li>
            <li>Look for additional sources of income or side projects</li>
            <li>Set up alerts for income changes in the Personal Budget app</li>
          </ul>
          <p>Remember, small changes can make a big difference in your financial health.</p>
          <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
          <p>Best regards,<br/>Personal Budget App Team</p>
        </div>
        <div style="text-align: center; margin-top: 20px; color: #777;">
          <p>&copy; ${new Date().getFullYear()} Personal Budget App. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Income alert email sent to ${email}`);
  } catch (error) {
    console.log(error);
  }
};



export const sendOtp = async (email: string, otp: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'cse.takeoff@gmail.com',
      pass: process.env.EMAIL_PASS || 'digkagfgyxcjltup',
    },
  });

  const mailOptions = {
    from: 'cse.takeoff@gmail.com',
    to: email,
    subject: "Your Personal Budget App One-Time Password (OTP)",
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="background-color: #4CAF50; color: white; padding: 15px; text-align: center; border-radius: 5px;">
          <h2>Your OTP for Personal Budget Verification</h2>
        </div>
        <div style="background-color: white; padding: 20px; margin-top: 10px; border-radius: 5px;">
          <p>Dear User,</p>
          <p>Thank you for using the Personal Budget App. To proceed, please use the following One-Time Password (OTP) to verify your email address:</p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: bold; color: #333;">${otp}</span>
          </div>
          <p>This OTP is valid for the next 10 minutes.</p>
          <p>If you did not request this verification, please ignore this email.</p>
          <p>Best regards,<br/>Personal Budget App Team</p>
        </div>
        <div style="text-align: center; margin-top: 20px; color: #777;">
          <p>&copy; ${new Date().getFullYear()} Personal Budget App. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}`);
  } catch (error) {
    console.log(error);
  }
};


