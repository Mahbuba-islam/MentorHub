
import {betterAuth} from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { prisma } from "./prisma"
import nodemailer from "nodemailer"


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASSWORD,
  },
});


export const auth = betterAuth({
    database:prismaAdapter(prisma, {
        provider:"postgresql",
        
    } ),
    trustedOrigins:[process.env.APP_URL!],
user: {
  additionalFields: {
    role: {
      type: "string",
      defaultValue: "STUDENT",
      required: true
    },
    phone: {
      type: "string",
      required: false
    },
    status: {
      type: "string",
      defaultValue: "ACTIVE",
      required: false
    }
  }
},



emailAndPassword:{
        enabled:true,
         requireEmailVerification:false
    },

    emailVerification: {
        sendOnSignUp:true,
    sendVerificationEmail: async ( { user, url, token }, request) => {
          console.log("email verify sent"),
        console.log(user, url, token);
       try{
         const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`
      const info = await transporter.sendMail({
      
    from: `"Mentor Hub" <${process.env.APP_USER}>`
,
    to: user.email,
    subject: "email verify ✔",
    html: `<!DOCTYPE html>
<html lang="en" style="margin:0;padding:0;">
  <head>
    <meta charset="UTF-8" />
    <title>Email Verification</title>
  </head>

  <body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;overflow:hidden;">
            
            <!-- Header -->
            <tr>
              <td style="background:#4f46e5;padding:20px 30px;color:#ffffff;font-size:24px;font-weight:bold;text-align:center;">
                Mentor Hub
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:30px;color:#333333;font-size:16px;line-height:1.6;">
                <p style="margin:0 0 15px;">Hi <strong>${user.name}</strong>,</p>

                <p style="margin:0 0 15px;">
                  Thank you for creating an account with <strong>Mentor Hub</strong>.  
                  Please verify your email address to activate your account.
                </p>

                <p style="margin:0 0 25px;">
                  Click the button below to verify your email:
                </p>

                <!-- Button -->
                <p style="text-align:center;margin:30px 0;">
                  <a href="${verificationUrl}" 
                     style="background:#4f46e5;color:#ffffff;padding:14px 28px;text-decoration:none;
                            font-size:16px;border-radius:6px;display:inline-block;">
                    Verify Email
                  </a>
                </p>

                <p style="margin:0 0 15px;">
                  If the button doesn’t work, copy and paste this link into your browser:
                </p>

                <p style="word-break:break-all;color:#4f46e5;">
                  ${verificationUrl}
                </p>

                <p style="margin-top:30px;">
                  If you didn’t create this account, you can safely ignore this email.
                </p>

                <p style="margin-top:20px;">Best regards,<br/>Mentor Hub Team</p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f0f0f0;padding:15px;text-align:center;font-size:12px;color:#777;">
                © 2026 Mentor Hub. All rights reserved.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
  });
       }
       catch(err){
      console.error(err);
      throw Error
       }

    },
    },



    socialProviders:{
        google:{
            prompt:"select_account consent",
            accessType:"offline",
            clientId : process.env.CLIENT_ID as string,
            clientSecret : process.env.CLIENT_SECRET as string,
            
        },
     
}

})