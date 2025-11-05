using Microsoft.EntityFrameworkCore;
using System;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class NgoProgram
    {
        public int Id { get; set; }

        [Required, MaxLength(250)]
        public string? Title { get; set; }

        public string? Description { get; set; }

        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }

        public string? Location { get; set; }

        // Goal tracking
        [Precision(18, 2)]
        public decimal? GoalAmount { get; set; } // Fundraising goal for this program

        public int NGOId { get; set; }
        public NGO? NGO { get; set; }
    }
}
