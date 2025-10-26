using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Threading.Tasks;

namespace Give_AID.Helpers
{
    public static class FileHelper
    {
        /// <summary>
        /// Save IFormFile to wwwroot/uploads/{subFolder} and return the relative url (e.g., /uploads/2025-10-26/abc.jpg)
        /// </summary>
        public static async Task<string> SaveFileAsync(IFormFile file, IWebHostEnvironment env, string? subFolder = null)
        {
            if (file == null || file.Length == 0) throw new ArgumentException("File is empty", nameof(file));
            subFolder ??= DateTime.UtcNow.ToString("yyyy-MM-dd");
            var uploadsRoot = Path.Combine(env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "uploads");
            var targetDir = Path.Combine(uploadsRoot, subFolder);

            if (!Directory.Exists(targetDir)) Directory.CreateDirectory(targetDir);

            var fileExt = Path.GetExtension(file.FileName);
            var safeName = Path.GetFileNameWithoutExtension(file.FileName);
            // sanitize filename
            foreach (var c in Path.GetInvalidFileNameChars())
            {
                safeName = safeName.Replace(c, '-');
            }

            var fileName = $"{safeName}-{Guid.NewGuid():N}{fileExt}";
            var fullPath = Path.Combine(targetDir, fileName);

            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // return relative url
            var relativeUrl = $"/uploads/{subFolder}/{fileName}";
            return relativeUrl.Replace("\\", "/");
        }

        /// <summary>
        /// Delete a file by relative path (e.g., /uploads/2025-10-26/abc.jpg)
        /// </summary>
        public static bool DeleteFile(string relativeUrl, IWebHostEnvironment env)
        {
            if (string.IsNullOrWhiteSpace(relativeUrl)) return false;
            var wwwroot = env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            // normalize
            if (relativeUrl.StartsWith("/")) relativeUrl = relativeUrl.Substring(1);
            var fullPath = Path.Combine(wwwroot, relativeUrl.Replace("/", Path.DirectorySeparatorChar.ToString()));

            if (!File.Exists(fullPath)) return false;
            File.Delete(fullPath);
            return true;
        }
    }
}
