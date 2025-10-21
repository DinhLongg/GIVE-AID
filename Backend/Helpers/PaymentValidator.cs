using System.Text.RegularExpressions;

namespace Give_AID.API.Helpers
{
    public static class PaymentValidator
    {
        // Very basic validation for dummy mode
        public static bool ValidateCardNumber(string cardNumber)
        {
            if (string.IsNullOrWhiteSpace(cardNumber)) return false;
            cardNumber = Regex.Replace(cardNumber, @"\s+", "");
            return Regex.IsMatch(cardNumber, @"^\d{12,19}$");
        }

        public static bool ValidateExpiry(string expiry)
        {
            if (string.IsNullOrWhiteSpace(expiry)) return false;
            // Accept MM/YY or MM/YYYY
            var m = Regex.Match(expiry, @"^(0[1-9]|1[0-2])\/?([0-9]{2}|[0-9]{4})$");
            if (!m.Success) return false;
            // basic expiry check
            var parts = expiry.Split('/');
            if (parts.Length != 2) return false;
            int month = int.Parse(parts[0]);
            string yearStr = parts[1];
            int year = yearStr.Length == 2 ? 2000 + int.Parse(yearStr) : int.Parse(yearStr);
            var lastDay = new System.DateTime(year, month, 1).AddMonths(1).AddDays(-1);
            return lastDay >= System.DateTime.UtcNow.Date;
        }

        public static bool ValidateCvv(string cvv)
        {
            return Regex.IsMatch(cvv ?? "", @"^\d{3,4}$");
        }
    }
}
