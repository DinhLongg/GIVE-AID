using Give_AID.API.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Give_AID.API.Helpers
{
    public static class JwtHelper
    {
        public static string GenerateToken(User user, IConfiguration config)
        {
            // Lấy key từ appsettings.json
            var jwtKey = config["Jwt:Key"] ?? throw new ArgumentNullException("Jwt:Key not configured");
            var jwtIssuer = config["Jwt:Issuer"] ?? "Give_AID";
            var jwtExpireMinutesStr = config["Jwt:ExpireMinutes"];
            var jwtExpireMinutes = int.TryParse(jwtExpireMinutesStr, out int mins) ? mins : 360;

            // Convert key sang byte[] an toàn
            var key = Encoding.ASCII.GetBytes(jwtKey ?? string.Empty);

            // Tạo danh sách claims (dùng toán tử ?? để tránh null)
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email ?? string.Empty),
                new Claim(ClaimTypes.Name, user.FullName ?? string.Empty),
                new Claim(ClaimTypes.Role, user.Role ?? "User")
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(jwtExpireMinutes),
                Issuer = jwtIssuer,
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature
                )
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
