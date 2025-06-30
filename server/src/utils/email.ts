import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendInviteEmail(to: string, token: string) {
  const inviteUrl = `${
    process.env.FRONTEND_URL || "http://localhost:3000"
  }/accept-invite?token=${token}`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Remotia</h1>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #333; margin: 0 0 20px 0;">Танд урилга ирлээ!</h2>
        
        <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
         Таныг Remotia дээрх төсөлд нэгдэхийг урьж байна. Доорх товчийг дарж урилгыг хүлээн авах боломжтой.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${inviteUrl}" 
             style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; 
                    padding: 15px 30px; 
                    text-decoration: none; 
                    border-radius: 25px; 
                    display: inline-block; 
                    font-weight: bold;
                    font-size: 16px;">
            Accept Invitation
          </a>
        </div>
        
        <p style="color: #999; font-size: 14px; margin-top: 30px; text-align: center;">
          Хэрэв дээрх товч ажиллахгүй бол дараах холбоосыг ашиглана уу<br>
          <a href="${inviteUrl}" style="color: #667eea;">${inviteUrl}</a>
        </p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        
        <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
       Энэ урилгыг нэг л удаа ашиглах боломжтой. Хэрэв танд асуух зүйл байвал төслийн админтайгаа холбогдоно уу.
        </p>
      </div>
    </div>
  `;

  const textContent = `
You're Invited to Join a Project on Remotia!

You have been invited to join a project on Remotia. Click the link below to accept the invitation and start collaborating with your team.

Accept Invitation: ${inviteUrl}

If the link doesn't work, copy and paste it into your browser.

This invitation will expire once accepted. If you have any questions, please contact your project administrator.

Best regards,
The Remotia Team
  `;

  await transporter.sendMail({
    from: `"Remotia" <${process.env.EMAIL_USER}>`,
    to,
    subject: "You're Invited to Join a Project on Remotia",
    text: textContent,
    html: htmlContent,
  });
}
