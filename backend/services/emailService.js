const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
    return nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
    });
};

// Send OTP email
const sendOTPEmail = async (email, otp) => {
    try {
        const transporter = createTransporter();
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'KAZI CONNECT - Verify Your Email',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
                    <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <h2 style="color: #2c3e50; text-align: center; margin-bottom: 30px;">🔐 Email Verification</h2>
                        
                        <p style="font-size: 16px; color: #333; line-height: 1.6;">
                            Welcome to <strong>KAZI CONNECT</strong>! To complete your registration, please use the OTP code below:
                        </p>
                        
                        <div style="background-color: #e9ecef; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
                            <span style="font-size: 32px; font-weight: bold; color: #2c3e50; letter-spacing: 5px;">
                                ${otp}
                            </span>
                        </div>
                        
                        <p style="font-size: 14px; color: #666; text-align: center; margin-top: 20px;">
                            This code will expire in <strong>10 minutes</strong>.
                        </p>
                        
                        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef;">
                            <p style="font-size: 12px; color: #999; margin: 0;">
                                If you didn't request this verification, please ignore this email.
                            </p>
                            <p style="font-size: 12px; color: #999; margin: 5px 0;">
                                For support, contact us at support@kaziconnect.com
                            </p>
                        </div>
                    </div>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('OTP email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };
        
    } catch (error) {
        console.error('Error sending OTP email:', error);
        return { success: false, error: error.message };
    }
};

// Send welcome email after verification
const sendWelcomeEmail = async (email, firstName) => {
    try {
        const transporter = createTransporter();
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Welcome to KAZI CONNECT! 🎉',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
                    <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <h2 style="color: #28a745; text-align: center; margin-bottom: 30px;">🎉 Welcome to KAZI CONNECT!</h2>
                        
                        <p style="font-size: 16px; color: #333; line-height: 1.6;">
                            Hi <strong>${firstName}</strong>,
                        </p>
                        
                        <p style="font-size: 16px; color: #333; line-height: 1.6;">
                            Your email has been successfully verified! You can now:
                        </p>
                        
                        <ul style="font-size: 16px; color: #333; line-height: 1.8; padding-left: 20px;">
                            <li>✅ Create your worker profile</li>
                            <li>✅ Browse and apply for jobs</li>
                            <li>✅ Connect with employers</li>
                            <li>✅ Start earning opportunities</li>
                        </ul>
                        
                        <div style="text-align: center; margin: 40px 0;">
                            <a href="http://localhost:5173/login" style="background-color: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                                Login to Your Account
                            </a>
                        </div>
                        
                        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef;">
                            <p style="font-size: 12px; color: #999; margin: 0;">
                                Need help? Contact us at support@kaziconnect.com
                            </p>
                        </div>
                    </div>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Welcome email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };
        
    } catch (error) {
        console.error('Error sending welcome email:', error);
        return { success: false, error: error.message };
    }
};

module.exports = {
    sendOTPEmail,
    sendWelcomeEmail
};
