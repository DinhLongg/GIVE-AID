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
        /// Tạo nội dung email biên lai khi người dùng quyên góp.
        /// </summary>
        public static string DonationReceiptTemplate(string? donorName, decimal amount, string? cause, string? transactionRef)
        {
            donorName ??= "Donor";
            cause ??= "General Cause";
            transactionRef ??= "(No reference)";

            var sb = new StringBuilder();
            sb.AppendLine($"Dear {donorName},");
            sb.AppendLine();
            sb.AppendLine($"Thank you for your generous donation of {amount:C} to {cause}.");
            sb.AppendLine($"Transaction reference: {transactionRef}");
            sb.AppendLine();
            sb.AppendLine("This is a receipt for your records.");
            sb.AppendLine();
            sb.AppendLine("Warm regards,");
            sb.AppendLine("Give-AID Team");

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
    }
}
