using System;
using System.Text;

namespace Backend.Helpers
{
    public static class EmailTemplate
    {
        /// <summary>
        /// Tạo nội dung email mời tham gia hệ thống.
        /// </summary>
        public static string InvitationTemplate(string? fromName, string? message, string? inviteToken)
        {
            fromName ??= "Thành viên Give-AID";
            inviteToken ??= "(Không có mã mời)";

            var sb = new StringBuilder();
            sb.AppendLine("Hello,");
            sb.AppendLine();
            sb.AppendLine($"{fromName} has invited you to join Give-AID.");

            if (!string.IsNullOrWhiteSpace(message))
            {
                sb.AppendLine();
                sb.AppendLine("Message:");
                sb.AppendLine(message);
            }

            sb.AppendLine();
            sb.AppendLine($"Use this token to accept invitation: {inviteToken}");
            sb.AppendLine();
            sb.AppendLine("Thanks,");
            sb.AppendLine("Give-AID Team");

            return sb.ToString();
        }

        /// <summary>
        /// Tạo nội dung email phản hồi người dùng khi họ gửi câu hỏi.
        /// </summary>
        public static string QueryReplyTemplate(string? subject, string? reply, string? recipientName)
        {
            subject ??= "Your query";
            reply ??= "(No reply provided)";
            recipientName ??= "User";

            var sb = new StringBuilder();
            sb.AppendLine($"Hello {recipientName},");
            sb.AppendLine();
            sb.AppendLine($"This is a reply to your query: \"{subject}\"");
            sb.AppendLine();
            sb.AppendLine(reply);
            sb.AppendLine();
            sb.AppendLine("If you need further assistance, please reply to this email.");
            sb.AppendLine();
            sb.AppendLine("Regards,");
            sb.AppendLine("Give-AID Support Team");

            return sb.ToString();
        }

        /// <summary>
        /// Tạo nội dung email biên lai khi người dùng quyên góp (HTML template).
        /// </summary>
        public static string DonationReceiptTemplate(string? donorName, decimal amount, string? cause, string? transactionRef, DateTime? donationDate = null)
        {
            donorName ??= "Donor";
            cause ??= "General Cause";
            transactionRef ??= "(No reference)";

            var sb = new StringBuilder();
            sb.AppendLine("<!DOCTYPE html>");
            sb.AppendLine("<html>");
            sb.AppendLine("<head>");
            sb.AppendLine("    <meta charset='UTF-8'>");
            sb.AppendLine("    <style>");
            sb.AppendLine("        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }");
            sb.AppendLine("        .container { max-width: 600px; margin: 0 auto; padding: 20px; }");
            sb.AppendLine("        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }");
            sb.AppendLine("        .content { background-color: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }");
            sb.AppendLine("        .receipt-box { background-color: #fff; border: 2px solid #10b981; padding: 25px; margin: 20px 0; border-radius: 8px; }");
            sb.AppendLine("        .amount { font-size: 32px; font-weight: bold; color: #10b981; text-align: center; margin: 15px 0; }");
            sb.AppendLine("        .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }");
            sb.AppendLine("        .info-row:last-child { border-bottom: none; }");
            sb.AppendLine("        .info-label { font-weight: bold; color: #6b7280; }");
            sb.AppendLine("        .info-value { color: #111827; }");
            sb.AppendLine("        .footer { text-align: center; margin-top: 30px; color: #6c757d; font-size: 12px; }");
            sb.AppendLine("        .thank-you { text-align: center; font-size: 18px; color: #10b981; font-weight: bold; margin: 20px 0; }");
            sb.AppendLine("        .highlight { color: #10b981; font-weight: bold; }");
            sb.AppendLine("    </style>");
            sb.AppendLine("</head>");
            sb.AppendLine("<body>");
            sb.AppendLine("    <div class='container'>");
            sb.AppendLine("        <div class='header'>");
            sb.AppendLine("            <h1>❤️ Thank You for Your Donation!</h1>");
            sb.AppendLine("        </div>");
            sb.AppendLine("        <div class='content'>");
            sb.AppendLine($"            <p>Dear <strong>{donorName}</strong>,</p>");
            sb.AppendLine("            <div class='thank-you'>Thank you for your generous contribution!</div>");
            sb.AppendLine("            <p>We are truly grateful for your support. Your donation will make a significant difference in the lives of those in need.</p>");
            sb.AppendLine("            <div class='receipt-box'>");
            sb.AppendLine("                <h3 style='text-align: center; margin-top: 0; color: #10b981;'>Donation Receipt</h3>");
            sb.AppendLine($"                <div class='amount'>{amount:C}</div>");
            sb.AppendLine("                <div class='info-row'>");
            sb.AppendLine("                    <span class='info-label'>Cause/Program:</span>");
            sb.AppendLine($"                    <span class='info-value'>{cause}</span>");
            sb.AppendLine("                </div>");
            sb.AppendLine("                <div class='info-row'>");
            sb.AppendLine("                    <span class='info-label'>Transaction Reference:</span>");
            sb.AppendLine($"                    <span class='info-value'><code style='background: #f3f4f6; padding: 2px 6px; border-radius: 4px;'>{transactionRef}</code></span>");
            sb.AppendLine("                </div>");
            sb.AppendLine($"                <div class='info-row'>");
            sb.AppendLine("                    <span class='info-label'>Date:</span>");
            sb.AppendLine($"                    <span class='info-value'>{(donationDate ?? DateTime.UtcNow):MMMM dd, yyyy 'at' HH:mm UTC}</span>");
            sb.AppendLine("                </div>");
            sb.AppendLine("            </div>");
            sb.AppendLine("            <p><strong>What happens next?</strong></p>");
            sb.AppendLine("            <ul>");
            sb.AppendLine("                <li>Your donation has been successfully processed</li>");
            sb.AppendLine("                <li>Funds will be allocated to the specified cause/program</li>");
            sb.AppendLine("                <li>You will receive updates on how your donation is making an impact</li>");
            sb.AppendLine("            </ul>");
            sb.AppendLine("            <p style='margin-top: 25px;'>Please keep this email as your receipt for tax purposes (if applicable in your region).</p>");
            sb.AppendLine("            <p style='margin-top: 20px;'>If you have any questions about your donation, please don't hesitate to contact us.</p>");
            sb.AppendLine("            <p style='margin-top: 25px;'>Warm regards,<br><strong>Give-AID Team</strong></p>");
            sb.AppendLine("        </div>");
            sb.AppendLine("        <div class='footer'>");
            sb.AppendLine("            <p>This is an automated receipt. Please do not reply to this email.</p>");
            sb.AppendLine("            <p>For inquiries, contact us at <a href='mailto:support@giveaid.org'>support@giveaid.org</a></p>");
            sb.AppendLine("        </div>");
            sb.AppendLine("    </div>");
            sb.AppendLine("</body>");
            sb.AppendLine("</html>");

            return sb.ToString();
        }

        /// <summary>
        /// Tạo nội dung email xác nhận tài khoản.
        /// </summary>
        public static string VerificationEmailTemplate(string? fullName, string? verificationLink, string? verificationToken)
        {
            fullName ??= "User";
            verificationLink ??= "#";
            verificationToken ??= "(No token)";

            var sb = new StringBuilder();
            sb.AppendLine("<!DOCTYPE html>");
            sb.AppendLine("<html>");
            sb.AppendLine("<head>");
            sb.AppendLine("    <meta charset='UTF-8'>");
            sb.AppendLine("    <style>");
            sb.AppendLine("        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }");
            sb.AppendLine("        .container { max-width: 600px; margin: 0 auto; padding: 20px; }");
            sb.AppendLine("        .header { background: linear-gradient(135deg, #007bff 0%, #0056b3 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }");
            sb.AppendLine("        .content { background-color: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }");
            sb.AppendLine("        .button { display: inline-block; background-color: #007bff; color: white; padding: 14px 28px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }");
            sb.AppendLine("        .button:hover { background-color: #0056b3; }");
            sb.AppendLine("        .token-box { background-color: #fff; border: 2px dashed #007bff; padding: 15px; margin: 20px 0; border-radius: 5px; text-align: center; font-family: monospace; }");
            sb.AppendLine("        .footer { text-align: center; margin-top: 30px; color: #6c757d; font-size: 12px; }");
            sb.AppendLine("        .warning { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }");
            sb.AppendLine("    </style>");
            sb.AppendLine("</head>");
            sb.AppendLine("<body>");
            sb.AppendLine("    <div class='container'>");
            sb.AppendLine("        <div class='header'>");
            sb.AppendLine("            <h1>🎉 Welcome to Give-AID!</h1>");
            sb.AppendLine("        </div>");
            sb.AppendLine("        <div class='content'>");
            sb.AppendLine($"            <p>Hello <strong>{fullName}</strong>,</p>");
            sb.AppendLine("            <p>Thank you for registering with Give-AID! To complete your registration, please verify your email address by clicking the button below:</p>");
            sb.AppendLine($"            <div style='text-align: center;'><a href='{verificationLink}' class='button'>Verify Email Address</a></div>");
            sb.AppendLine("            <p>Or copy and paste this link into your browser:</p>");
            sb.AppendLine($"            <div class='token-box'>{verificationLink}</div>");
            sb.AppendLine("            <div class='warning'>");
            sb.AppendLine("                <strong>⚠️ Important:</strong> This verification link will expire in <strong>24 hours</strong>. If the link has expired, please request a new verification email.");
            sb.AppendLine("            </div>");
            sb.AppendLine("            <p>If you did not create an account with Give-AID, please ignore this email.</p>");
            sb.AppendLine("            <p>Best regards,<br><strong>Give-AID Team</strong></p>");
            sb.AppendLine("        </div>");
            sb.AppendLine("        <div class='footer'>");
            sb.AppendLine("            <p>This is an automated email. Please do not reply.</p>");
            sb.AppendLine("        </div>");
            sb.AppendLine("    </div>");
            sb.AppendLine("</body>");
            sb.AppendLine("</html>");

            return sb.ToString();
        }

        /// <summary>
        /// Tạo nội dung email reset mật khẩu.
        /// </summary>
        public static string PasswordResetEmailTemplate(string? fullName, string? resetLink, string? resetToken)
        {
            fullName ??= "User";
            resetLink ??= "#";
            resetToken ??= "(No token)";

            var sb = new StringBuilder();
            sb.AppendLine("<!DOCTYPE html>");
            sb.AppendLine("<html>");
            sb.AppendLine("<head>");
            sb.AppendLine("    <meta charset='UTF-8'>");
            sb.AppendLine("    <style>");
            sb.AppendLine("        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }");
            sb.AppendLine("        .container { max-width: 600px; margin: 0 auto; padding: 20px; }");
            sb.AppendLine("        .header { background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }");
            sb.AppendLine("        .content { background-color: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }");
            sb.AppendLine("        .button { display: inline-block; background-color: #dc3545; color: white; padding: 14px 28px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }");
            sb.AppendLine("        .button:hover { background-color: #c82333; }");
            sb.AppendLine("        .token-box { background-color: #fff; border: 2px dashed #dc3545; padding: 15px; margin: 20px 0; border-radius: 5px; text-align: center; font-family: monospace; }");
            sb.AppendLine("        .footer { text-align: center; margin-top: 30px; color: #6c757d; font-size: 12px; }");
            sb.AppendLine("        .warning { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }");
            sb.AppendLine("        .danger { background-color: #f8d7da; border-left: 4px solid #dc3545; padding: 15px; margin: 20px 0; }");
            sb.AppendLine("    </style>");
            sb.AppendLine("</head>");
            sb.AppendLine("<body>");
            sb.AppendLine("    <div class='container'>");
            sb.AppendLine("        <div class='header'>");
            sb.AppendLine("            <h1>🔒 Reset Your Password</h1>");
            sb.AppendLine("        </div>");
            sb.AppendLine("        <div class='content'>");
            sb.AppendLine($"            <p>Hello <strong>{fullName}</strong>,</p>");
            sb.AppendLine("            <p>We received a request to reset your password for your Give-AID account. If you made this request, please click the button below to reset your password:</p>");
            sb.AppendLine($"            <div style='text-align: center;'><a href='{resetLink}' class='button'>Reset Password</a></div>");
            sb.AppendLine("            <p>Or copy and paste this link into your browser:</p>");
            sb.AppendLine($"            <div class='token-box'>{resetLink}</div>");
            sb.AppendLine("            <div class='warning'>");
            sb.AppendLine("                <strong>⚠️ Important:</strong> This password reset link will expire in <strong>1 hour</strong>. If the link has expired, please request a new password reset.");
            sb.AppendLine("            </div>");
            sb.AppendLine("            <div class='danger'>");
            sb.AppendLine("                <strong>🔒 Security Notice:</strong> If you did not request a password reset, please ignore this email. Your password will remain unchanged. If you believe your account has been compromised, please contact support immediately.");
            sb.AppendLine("            </div>");
            sb.AppendLine("            <p>Best regards,<br><strong>Give-AID Team</strong></p>");
            sb.AppendLine("        </div>");
            sb.AppendLine("        <div class='footer'>");
            sb.AppendLine("            <p>This is an automated email. Please do not reply.</p>");
            sb.AppendLine("        </div>");
            sb.AppendLine("    </div>");
            sb.AppendLine("</body>");
            sb.AppendLine("</html>");

            return sb.ToString();
        }

        /// <summary>
        /// Tạo nội dung email xác nhận khi người dùng gửi contact form.
        /// </summary>
        public static string ContactConfirmationEmailTemplate(string? fullName, string? subject, string? queryId)
        {
            fullName ??= "Valued Customer";
            subject ??= "Your inquiry";
            queryId ??= "N/A";

            var sb = new StringBuilder();
            sb.AppendLine("<!DOCTYPE html>");
            sb.AppendLine("<html>");
            sb.AppendLine("<head>");
            sb.AppendLine("    <meta charset='UTF-8'>");
            sb.AppendLine("    <style>");
            sb.AppendLine("        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }");
            sb.AppendLine("        .container { max-width: 600px; margin: 0 auto; padding: 20px; }");
            sb.AppendLine("        .header { background: linear-gradient(135deg, #007bff 0%, #0056b3 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }");
            sb.AppendLine("        .content { background-color: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }");
            sb.AppendLine("        .info-box { background-color: #fff; border-left: 4px solid #007bff; padding: 15px; margin: 20px 0; border-radius: 5px; }");
            sb.AppendLine("        .footer { text-align: center; margin-top: 30px; color: #6c757d; font-size: 12px; }");
            sb.AppendLine("        .highlight { color: #007bff; font-weight: bold; }");
            sb.AppendLine("    </style>");
            sb.AppendLine("</head>");
            sb.AppendLine("<body>");
            sb.AppendLine("    <div class='container'>");
            sb.AppendLine("        <div class='header'>");
            sb.AppendLine("            <h1>✓ Message Received</h1>");
            sb.AppendLine("        </div>");
            sb.AppendLine("        <div class='content'>");
            sb.AppendLine($"            <p>Hello <strong>{fullName}</strong>,</p>");
            sb.AppendLine("            <p>Thank you for contacting Give-AID! We have successfully received your message and our team will review it shortly.</p>");
            sb.AppendLine("            <div class='info-box'>");
            sb.AppendLine($"                <p><strong>Subject:</strong> {subject}</p>");
            sb.AppendLine($"                <p><strong>Reference ID:</strong> <span class='highlight'>{queryId}</span></p>");
            sb.AppendLine("            </div>");
            sb.AppendLine("            <p><strong>What happens next?</strong></p>");
            sb.AppendLine("            <ul>");
            sb.AppendLine("                <li>Our support team will review your inquiry</li>");
            sb.AppendLine("                <li>We typically respond within <strong>24 hours</strong></li>");
            sb.AppendLine("                <li>You will receive an email notification when we reply</li>");
            sb.AppendLine("            </ul>");
            sb.AppendLine("            <p>If your inquiry is urgent, please call us at <strong>+84 123 456 789</strong>.</p>");
            sb.AppendLine("            <p>Best regards,<br><strong>Give-AID Support Team</strong></p>");
            sb.AppendLine("        </div>");
            sb.AppendLine("        <div class='footer'>");
            sb.AppendLine("            <p>This is an automated confirmation email. Please do not reply to this message.</p>");
            sb.AppendLine("            <p>If you have any questions, please contact us at <a href='mailto:support@giveaid.org'>support@giveaid.org</a></p>");
            sb.AppendLine("        </div>");
            sb.AppendLine("    </div>");
            sb.AppendLine("</body>");
            sb.AppendLine("</html>");

            return sb.ToString();
        }
    }
}
