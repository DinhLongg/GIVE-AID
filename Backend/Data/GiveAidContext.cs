using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data
{
    public class GiveAidContext : DbContext
    {
        public GiveAidContext(DbContextOptions<GiveAidContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Donation> Donations { get; set; }
        public DbSet<NGO> NGOs { get; set; }
        public DbSet<Partner> Partners { get; set; }
        public DbSet<NgoProgram> NgoPrograms { get; set; }
        public DbSet<Gallery> Galleries { get; set; }
        public DbSet<Query> Queries { get; set; }
        public DbSet<Invitation> Invitations { get; set; }
        public DbSet<Cause> Causes { get; set; }
        public DbSet<AboutSection> AboutSections { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            // Unique email
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // Unique username
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();

            // seed typical causes
            modelBuilder.Entity<Cause>().HasData(
                new Cause { Id = 1, Name = "Children", Description = "Children Welfare" },
                new Cause { Id = 2, Name = "Education", Description = "Education" },
                new Cause { Id = 3, Name = "Health", Description = "Health Care" },
                new Cause { Id = 4, Name = "Disabled", Description = "Support Disabled" }
            );
        }
    }
}
