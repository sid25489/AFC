import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create a reusable transporter object using SMTP transport
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
};

/**
 * Send password reset email
 * @param email - Recipient email address
 * @param resetToken - Password reset token
 * @param name - User's name
 */
export const sendPasswordResetEmail = async (
    email: string,
    resetToken: string,
    name: string
): Promise<void> => {
    const transporter = createTransporter();

    // Frontend URL for password reset
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

    const mailOptions = {
        from: `"${process.env.EMAIL_FROM_NAME || 'Diner Support'}" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Password Reset Request',
        html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .button {
              display: inline-block;
              padding: 12px 24px;
              background-color: #4CAF50;
              color: white;
              text-decoration: none;
              border-radius: 4px;
              margin: 20px 0;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #eee;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Password Reset Request</h2>
            <p>Hi ${name},</p>
            <p>You requested to reset your password. Click the button below to create a new password:</p>
            <a href="${resetUrl}" class="button">Reset Password</a>
            <p>Or copy and paste this link into your browser:</p>
            <p>${resetUrl}</p>
            <p><strong>This link will expire in 1 hour.</strong></p>
            <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
            <div class="footer">
              <p>This is an automated email, please do not reply.</p>
            </div>
          </div>
        </body>
      </html>
    `,
        text: `
      Hi ${name},

      You requested to reset your password. Visit the link below to create a new password:

      ${resetUrl}

      This link will expire in 1 hour.

      If you didn't request a password reset, please ignore this email.
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Password reset email sent to ${email}`);
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw new Error('Failed to send password reset email');
    }
};

/**
 * Send welcome email for new users
 * @param email - Recipient email address
 * @param name - User's name
 */
export const sendWelcomeEmail = async (
    email: string,
    name: string
): Promise<void> => {
    const transporter = createTransporter();

    const mailOptions = {
        from: `"${process.env.EMAIL_FROM_NAME || 'Diner'}" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Welcome to Diner!',
        html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Welcome to Diner!</h2>
            <p>Hi ${name},</p>
            <p>Thank you for joining us! We're excited to have you on board.</p>
            <p>You can now start exploring our menu and placing orders.</p>
            <p>Enjoy your dining experience!</p>
          </div>
        </body>
      </html>
    `,
        text: `
      Hi ${name},

      Thank you for joining Diner! We're excited to have you on board.

      You can now start exploring our menu and placing orders.

      Enjoy your dining experience!
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Welcome email sent to ${email}`);
    } catch (error) {
        console.error('Error sending welcome email:', error);
        // Don't throw error for welcome emails, just log it
    }
};
