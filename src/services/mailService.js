import nodemailer from 'nodemailer';
import dotenv from "dotenv";
import Logger from '../utils/logger.js';
import config from './config/config.js';

dotenv.config();

const MAILING_PASSWORD = config.mailing.MAILING_PASSWORD;
const MAILING_USER = config.mailing.MAILING_USER;

class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: MAILING_USER,
                pass: MAILING_PASSWORD,
            },
        });
    }

    async sendMail(to, subject, htmlContent) {
        try {
            const mailOptions = {
                from: MAILING_USER,
                to: to,
                subject: subject,
                html: htmlContent,
            };
            await this.transporter.sendMail(mailOptions);
            Logger.info('Mail sent successfully');
        } catch (error) {
            Logger.error('Error sending email:', error);
            throw error;
        }
    }

    async sendPasswordResetEmail(email, resetToken) {
        const subject = 'Password Reset Request';
        const htmlContent = `
            <p>Hello,</p>
            <p>You have requested to reset your password. Click on the following link to reset it:</p>
            <a href="${config.mailing.BASE}/reset-password/${resetToken}">Reset Password</a>
            <p>If you did not request this, please ignore this email.</p>
        `;
        
        try {
            await this.sendMail(email, subject, htmlContent);
        } catch (error) {
            Logger.error('Error sending password reset email:', error);
        }
    }
}

export default new MailService();
