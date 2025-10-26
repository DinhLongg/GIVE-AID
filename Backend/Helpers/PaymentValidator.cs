using System;
using System.Text.RegularExpressions;

namespace Backend.Helpers
{
    /// <summary>
    /// Lớp kiểm tra dữ liệu thanh toán giả lập (Payment Validation).
    /// Dùng để xác minh số thẻ, hạn thẻ và mã CVV trong chế độ mô phỏng.
    /// </summary>
    public static class PaymentValidator
    {
        /// <summary>
        /// Kiểm tra số thẻ (12–19 chữ số). Cho phép null an toàn.
        /// </summary>
        public static bool ValidateCardNumber(string? cardNumber)
        {
            if (string.IsNullOrWhiteSpace(cardNumber))
                return false;

            cardNumber = Regex.Replace(cardNumber, @"\s+", ""); // bỏ khoảng trắng

            // Thẻ hợp lệ có từ 12 đến 19 chữ số
            return Regex.IsMatch(cardNumber, @"^\d{12,19}$");
        }

        /// <summary>
        /// Kiểm tra ngày hết hạn (MM/YY hoặc MM/YYYY). Cho phép null an toàn.
        /// </summary>
        public static bool ValidateExpiry(string? expiry)
        {
            if (string.IsNullOrWhiteSpace(expiry))
                return false;

            // Định dạng hợp lệ: MM/YY hoặc MM/YYYY
            var match = Regex.Match(expiry.Trim(), @"^(0[1-9]|1[0-2])\/?([0-9]{2}|[0-9]{4})$");
            if (!match.Success)
                return false;

            var parts = expiry.Split('/');
            if (parts.Length != 2)
                return false;

            if (!int.TryParse(parts[0], out int month))
                return false;

            if (!int.TryParse(parts[1], out int year))
                return false;

            // Chuyển năm YY → YYYY
            if (parts[1].Length == 2)
                year = 2000 + year;

            try
            {
                var lastDay = new DateTime(year, month, 1).AddMonths(1).AddDays(-1);
                return lastDay >= DateTime.UtcNow.Date;
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// Kiểm tra mã CVV (3–4 chữ số). Cho phép null an toàn.
        /// </summary>
        public static bool ValidateCvv(string? cvv)
        {
            if (string.IsNullOrWhiteSpace(cvv))
                return false;

            return Regex.IsMatch(cvv.Trim(), @"^\d{3,4}$");
        }
    }
}
