using Backend.Data;
using Backend.DTOs;
using Backend.Helpers;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Services
{
    public class UserService
    {
        private readonly GiveAidContext _context;
        public UserService(GiveAidContext context)
        {
            _context = context;
        }

        public async Task<List<User>> GetAllAsync()
        {
            return await _context.Users.ToListAsync();
        }

        public async Task<User?> GetByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return false;
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateRoleAsync(int id, string role)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return false;
            user.Role = role;
            await _context.SaveChangesAsync();
            return true;
        }

        /// <summary>
        /// Update user profile information (FullName, Phone, Address)
        /// </summary>
        public async Task<(bool success, string message, User? user)> UpdateProfileAsync(int userId, UpdateProfileRequest request)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return (false, "User not found", null);

            // Update only provided fields
            if (!string.IsNullOrWhiteSpace(request.FullName))
                user.FullName = request.FullName.Trim();

            if (request.Phone != null)
                user.Phone = string.IsNullOrWhiteSpace(request.Phone) ? null : request.Phone.Trim();

            if (request.Address != null)
                user.Address = string.IsNullOrWhiteSpace(request.Address) ? null : request.Address.Trim();

            try
            {
                await _context.SaveChangesAsync();
                return (true, "Profile updated successfully", user);
            }
            catch (Exception ex)
            {
                return (false, $"Error updating profile: {ex.Message}", null);
            }
        }

        /// <summary>
        /// Change user password
        /// </summary>
        public async Task<(bool success, string message)> ChangePasswordAsync(int userId, ChangePasswordRequest request)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return (false, "User not found");

            // Verify current password
            var isCurrentPasswordValid = PasswordHasher.Verify(request.CurrentPassword ?? string.Empty, user.PasswordHash ?? string.Empty);
            if (!isCurrentPasswordValid)
                return (false, "Current password is incorrect");

            // Update password
            user.PasswordHash = PasswordHasher.Hash(request.NewPassword ?? string.Empty);
            
            try
            {
                await _context.SaveChangesAsync();
                return (true, "Password changed successfully");
            }
            catch (Exception ex)
            {
                return (false, $"Error changing password: {ex.Message}");
            }
        }
    }
}
