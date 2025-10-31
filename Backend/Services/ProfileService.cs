//thêm mới 30/10
using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class ProfileService
    {
        private readonly GiveAidContext _context;

        public ProfileService(GiveAidContext context)
        {
            _context = context;
        }

        public async Task<ProfileResponse?> GetProfileAsync(int userId)
        {
            var profile = await _context.UserProfiles
                .FirstOrDefaultAsync(x => x.UserId == userId);

            if (profile == null) return null;

            return new ProfileResponse
            {
                FullName = profile.FullName,
                Email = profile.Email,
                Phone = profile.Phone,
                DateOfBirth = profile.DateOfBirth,
                Gender = profile.Gender,
                StreetAddress = profile.StreetAddress,
                City = profile.City,
                Country = profile.Country
            };
        }

        public async Task<bool> UpdateProfileAsync(int userId, ProfileUpdateRequest req)
        {
            var profile = await _context.UserProfiles.FirstOrDefaultAsync(x => x.UserId == userId);

            if (profile == null)
            {
                profile = new UserProfile { UserId = userId };
                _context.UserProfiles.Add(profile);
            }

            profile.FullName = req.FullName;
            profile.Email = req.Email;
            profile.Phone = req.Phone;
            profile.DateOfBirth = req.DateOfBirth;
            profile.Gender = req.Gender;
            profile.StreetAddress = req.StreetAddress;
            profile.City = req.City;
            profile.Country = req.Country;

            await _context.SaveChangesAsync();
            return true;
        }
    }
}
