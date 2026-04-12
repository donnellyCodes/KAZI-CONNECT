// Mock email service for development/testing
const sendOTPEmail = async (email, otp) => {
    console.log(`MOCK EMAIL: OTP for ${email} is ${otp}`);
    console.log(`Email would be sent to: ${email}`);
    console.log(`Subject: KAZI CONNECT - Verify Your Email`);
    console.log(`Body: Your verification code is ${otp}`);
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { success: true, messageId: 'mock-' + Date.now() };
};

const sendWelcomeEmail = async (email, firstName) => {
    console.log(`MOCK EMAIL: Welcome email sent to ${email}`);
    console.log(`Subject: Welcome to KAZI CONNECT! 🎉`);
    console.log(`Body: Welcome ${firstName}!`);
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { success: true, messageId: 'mock-welcome-' + Date.now() };
};

module.exports = {
    sendOTPEmail,
    sendWelcomeEmail
};
