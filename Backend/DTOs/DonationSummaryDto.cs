namespace Backend.DTOs
{
    public class DonationSummaryDto
    {
        public int TotalDonations { get; set; }
        public decimal TotalAmount { get; set; }
        public int SuccessDonations { get; set; }
        public decimal SuccessAmount { get; set; }
    }
}


