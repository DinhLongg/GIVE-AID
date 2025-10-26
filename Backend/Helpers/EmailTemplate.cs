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
    }
}
