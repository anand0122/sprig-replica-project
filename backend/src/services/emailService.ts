import nodemailer from 'nodemailer';
import { logger } from '../utils/logger.js';

interface EmailData {
  to: string | string[];
  subject: string;
  template?: string;
  data?: Record<string, any>;
  html?: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendEmail(emailData: EmailData): Promise<boolean> {
    try {
      let { html, text } = emailData;

      // If template is specified, generate HTML and text content
      if (emailData.template) {
        const templateContent = this.generateTemplate(emailData.template, emailData.data || {});
        html = templateContent.html;
        text = templateContent.text;
      }

      const mailOptions = {
        from: `${process.env.FROM_NAME || 'FormPulse'} <${process.env.FROM_EMAIL}>`,
        to: Array.isArray(emailData.to) ? emailData.to.join(', ') : emailData.to,
        subject: emailData.subject,
        html,
        text,
        attachments: emailData.attachments
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      logger.info(`Email sent successfully to ${emailData.to}`, {
        messageId: result.messageId,
        subject: emailData.subject
      });

      return true;
    } catch (error) {
      logger.error('Failed to send email:', error, {
        to: emailData.to,
        subject: emailData.subject,
        template: emailData.template
      });
      return false;
    }
  }

  private generateTemplate(templateName: string, data: Record<string, any>): { html: string; text: string } {
    switch (templateName) {
      case 'email-verification':
        return this.emailVerificationTemplate(data);
      case 'password-reset':
        return this.passwordResetTemplate(data);
      case 'new-response-notification':
        return this.newResponseNotificationTemplate(data);
      case 'welcome':
        return this.welcomeTemplate(data);
      case 'subscription-confirmation':
        return this.subscriptionConfirmationTemplate(data);
      case 'subscription-cancelled':
        return this.subscriptionCancelledTemplate(data);
      case 'form-shared':
        return this.formSharedTemplate(data);
      default:
        throw new Error(`Unknown email template: ${templateName}`);
    }
  }

  private emailVerificationTemplate(data: { firstName: string; verificationUrl: string }) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email - FormPulse</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; }
          .content { padding: 40px 20px; }
          .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .footer { background-color: #f8fafc; padding: 20px; text-align: center; color: #64748b; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to FormPulse!</h1>
          </div>
          <div class="content">
            <h2>Hi ${data.firstName},</h2>
            <p>Thank you for signing up for FormPulse! To get started, please verify your email address by clicking the button below:</p>
            <div style="text-align: center;">
              <a href="${data.verificationUrl}" class="button">Verify Email Address</a>
            </div>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #667eea;">${data.verificationUrl}</p>
            <p>This link will expire in 24 hours for security reasons.</p>
            <p>If you didn't create an account with FormPulse, you can safely ignore this email.</p>
          </div>
          <div class="footer">
            <p>© 2024 FormPulse. All rights reserved.</p>
            <p>Need help? Contact us at support@formpulse.com</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Welcome to FormPulse!
      
      Hi ${data.firstName},
      
      Thank you for signing up for FormPulse! To get started, please verify your email address by visiting:
      
      ${data.verificationUrl}
      
      This link will expire in 24 hours for security reasons.
      
      If you didn't create an account with FormPulse, you can safely ignore this email.
      
      Need help? Contact us at support@formpulse.com
      
      © 2024 FormPulse. All rights reserved.
    `;

    return { html, text };
  }

  private passwordResetTemplate(data: { firstName: string; resetUrl: string }) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password - FormPulse</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; }
          .content { padding: 40px 20px; }
          .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .footer { background-color: #f8fafc; padding: 20px; text-align: center; color: #64748b; font-size: 14px; }
          .warning { background-color: #fef3cd; border: 1px solid #fcefc7; border-radius: 8px; padding: 15px; margin: 20px 0; color: #856404; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <h2>Hi ${data.firstName},</h2>
            <p>We received a request to reset your FormPulse account password. Click the button below to create a new password:</p>
            <div style="text-align: center;">
              <a href="${data.resetUrl}" class="button">Reset Password</a>
            </div>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #667eea;">${data.resetUrl}</p>
            <div class="warning">
              <strong>Important:</strong> This link will expire in 1 hour for security reasons. If you didn't request a password reset, you can safely ignore this email.
            </div>
          </div>
          <div class="footer">
            <p>© 2024 FormPulse. All rights reserved.</p>
            <p>Need help? Contact us at support@formpulse.com</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Password Reset Request
      
      Hi ${data.firstName},
      
      We received a request to reset your FormPulse account password. Visit the following link to create a new password:
      
      ${data.resetUrl}
      
      This link will expire in 1 hour for security reasons.
      
      If you didn't request a password reset, you can safely ignore this email.
      
      Need help? Contact us at support@formpulse.com
      
      © 2024 FormPulse. All rights reserved.
    `;

    return { html, text };
  }

  private newResponseNotificationTemplate(data: {
    formTitle: string;
    responseId: string;
    submitterName: string;
    submitterEmail: string;
    dashboardUrl: string;
  }) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Form Response - FormPulse</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; }
          .content { padding: 40px 20px; }
          .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .response-details { background-color: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0; }
          .footer { background-color: #f8fafc; padding: 20px; text-align: center; color: #64748b; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 New Form Response!</h1>
          </div>
          <div class="content">
            <h2>You have a new response!</h2>
            <p>Someone just submitted a response to your form "<strong>${data.formTitle}</strong>".</p>
            
            <div class="response-details">
              <h3>Response Details:</h3>
              <p><strong>Response ID:</strong> ${data.responseId}</p>
              <p><strong>Submitter:</strong> ${data.submitterName}</p>
              <p><strong>Email:</strong> ${data.submitterEmail}</p>
              <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <div style="text-align: center;">
              <a href="${data.dashboardUrl}" class="button">View Response</a>
            </div>
            
            <p>You can view all responses and analytics in your FormPulse dashboard.</p>
          </div>
          <div class="footer">
            <p>© 2024 FormPulse. All rights reserved.</p>
            <p>To stop receiving these notifications, update your form settings.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      New Form Response!
      
      You have a new response to your form "${data.formTitle}".
      
      Response Details:
      - Response ID: ${data.responseId}
      - Submitter: ${data.submitterName}
      - Email: ${data.submitterEmail}
      - Submitted: ${new Date().toLocaleString()}
      
      View the response: ${data.dashboardUrl}
      
      © 2024 FormPulse. All rights reserved.
    `;

    return { html, text };
  }

  private welcomeTemplate(data: { firstName: string; dashboardUrl: string }) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to FormPulse!</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; }
          .content { padding: 40px 20px; }
          .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .feature { margin: 20px 0; padding: 15px; border-left: 4px solid #667eea; background-color: #f8fafc; }
          .footer { background-color: #f8fafc; padding: 20px; text-align: center; color: #64748b; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚀 Welcome to FormPulse!</h1>
          </div>
          <div class="content">
            <h2>Hi ${data.firstName},</h2>
            <p>Welcome to FormPulse - the AI-powered form builder that makes creating beautiful, intelligent forms effortless!</p>
            
            <div class="feature">
              <h3>🤖 AI-Powered Form Creation</h3>
              <p>Generate forms instantly from text descriptions, images, or URLs.</p>
            </div>
            
            <div class="feature">
              <h3>📊 Advanced Analytics</h3>
              <p>Get detailed insights into form performance and user behavior.</p>
            </div>
            
            <div class="feature">
              <h3>🔗 Easy Integration</h3>
              <p>Connect with 40+ popular tools and services.</p>
            </div>
            
            <div style="text-align: center;">
              <a href="${data.dashboardUrl}" class="button">Get Started</a>
            </div>
            
            <p>Ready to create your first form? Your dashboard is waiting for you!</p>
          </div>
          <div class="footer">
            <p>© 2024 FormPulse. All rights reserved.</p>
            <p>Need help? Check out our <a href="https://docs.formpulse.com">documentation</a> or contact support@formpulse.com</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Welcome to FormPulse!
      
      Hi ${data.firstName},
      
      Welcome to FormPulse - the AI-powered form builder that makes creating beautiful, intelligent forms effortless!
      
      Features you'll love:
      - AI-Powered Form Creation: Generate forms instantly from text descriptions, images, or URLs
      - Advanced Analytics: Get detailed insights into form performance and user behavior
      - Easy Integration: Connect with 40+ popular tools and services
      
      Get started: ${data.dashboardUrl}
      
      Need help? Check out our documentation at https://docs.formpulse.com or contact support@formpulse.com
      
      © 2024 FormPulse. All rights reserved.
    `;

    return { html, text };
  }

  private subscriptionConfirmationTemplate(data: { firstName: string; plan: string; amount: string }) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Subscription Confirmed - FormPulse</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 40px 20px; text-align: center; }
          .content { padding: 40px 20px; }
          .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .plan-details { background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 20px 0; }
          .footer { background-color: #f8fafc; padding: 20px; text-align: center; color: #64748b; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Subscription Confirmed!</h1>
          </div>
          <div class="content">
            <h2>Thank you, ${data.firstName}!</h2>
            <p>Your FormPulse subscription has been successfully activated.</p>
            
            <div class="plan-details">
              <h3>Subscription Details:</h3>
              <p><strong>Plan:</strong> ${data.plan}</p>
              <p><strong>Amount:</strong> ${data.amount}</p>
              <p><strong>Status:</strong> Active</p>
            </div>
            
            <p>You now have access to all premium features. Start creating amazing forms today!</p>
            
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Go to Dashboard</a>
            </div>
          </div>
          <div class="footer">
            <p>© 2024 FormPulse. All rights reserved.</p>
            <p>Questions about billing? Contact us at billing@formpulse.com</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Subscription Confirmed!
      
      Thank you, ${data.firstName}!
      
      Your FormPulse subscription has been successfully activated.
      
      Subscription Details:
      - Plan: ${data.plan}
      - Amount: ${data.amount}
      - Status: Active
      
      You now have access to all premium features. Start creating amazing forms today!
      
      Dashboard: ${process.env.FRONTEND_URL}/dashboard
      
      Questions about billing? Contact us at billing@formpulse.com
      
      © 2024 FormPulse. All rights reserved.
    `;

    return { html, text };
  }

  private subscriptionCancelledTemplate(data: { firstName: string; endDate: string }) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Subscription Cancelled - FormPulse</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; }
          .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 40px 20px; text-align: center; }
          .content { padding: 40px 20px; }
          .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .footer { background-color: #f8fafc; padding: 20px; text-align: center; color: #64748b; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Subscription Cancelled</h1>
          </div>
          <div class="content">
            <h2>Hi ${data.firstName},</h2>
            <p>We're sorry to see you go! Your FormPulse subscription has been cancelled.</p>
            <p>Your subscription will remain active until <strong>${data.endDate}</strong>. After that, your account will be downgraded to the free plan.</p>
            <p>You can reactivate your subscription at any time before the end date.</p>
            
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}/pricing" class="button">Reactivate Subscription</a>
            </div>
            
            <p>We'd love to hear your feedback about why you're leaving. Your input helps us improve FormPulse for everyone.</p>
          </div>
          <div class="footer">
            <p>© 2024 FormPulse. All rights reserved.</p>
            <p>Questions? Contact us at support@formpulse.com</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Subscription Cancelled
      
      Hi ${data.firstName},
      
      We're sorry to see you go! Your FormPulse subscription has been cancelled.
      
      Your subscription will remain active until ${data.endDate}. After that, your account will be downgraded to the free plan.
      
      You can reactivate your subscription at any time before the end date.
      
      Reactivate: ${process.env.FRONTEND_URL}/pricing
      
      We'd love to hear your feedback about why you're leaving. Your input helps us improve FormPulse for everyone.
      
      Questions? Contact us at support@formpulse.com
      
      © 2024 FormPulse. All rights reserved.
    `;

    return { html, text };
  }

  private formSharedTemplate(data: { formTitle: string; formUrl: string; senderName: string; message?: string }) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Form Shared - FormPulse</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; }
          .content { padding: 40px 20px; }
          .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .message { background-color: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0; font-style: italic; }
          .footer { background-color: #f8fafc; padding: 20px; text-align: center; color: #64748b; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📝 Form Shared With You</h1>
          </div>
          <div class="content">
            <h2>${data.senderName} shared a form with you</h2>
            <p>You've been invited to fill out the form "<strong>${data.formTitle}</strong>".</p>
            
            ${data.message ? `
            <div class="message">
              <p><strong>Personal message:</strong></p>
              <p>"${data.message}"</p>
            </div>
            ` : ''}
            
            <div style="text-align: center;">
              <a href="${data.formUrl}" class="button">Fill Out Form</a>
            </div>
            
            <p>This form was created using FormPulse, the AI-powered form builder.</p>
          </div>
          <div class="footer">
            <p>© 2024 FormPulse. All rights reserved.</p>
            <p>Create your own forms at <a href="${process.env.FRONTEND_URL}">formpulse.com</a></p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Form Shared With You
      
      ${data.senderName} shared a form with you.
      
      Form: "${data.formTitle}"
      
      ${data.message ? `Personal message: "${data.message}"` : ''}
      
      Fill out the form: ${data.formUrl}
      
      This form was created using FormPulse, the AI-powered form builder.
      Create your own forms at ${process.env.FRONTEND_URL}
      
      © 2024 FormPulse. All rights reserved.
    `;

    return { html, text };
  }
}

// Export singleton instance
export const emailService = new EmailService();

// Convenience function for sending emails
export const sendEmail = (emailData: EmailData) => emailService.sendEmail(emailData);

// Convenience function for sending notification emails
export const sendNotificationEmail = (emailData: EmailData) => emailService.sendEmail(emailData); 