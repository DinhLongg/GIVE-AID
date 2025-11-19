using Backend.DTOs;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GalleryController : ControllerBase
    {
        private readonly GalleryService _service;
        private readonly IWebHostEnvironment _env;
        
        public GalleryController(GalleryService service, IWebHostEnvironment env)
        {
            _service = service;
            _env = env;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

        [Authorize(Roles = "Admin")]
        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Create([FromForm] GalleryCreateRequest request)
        {
            try
            {
                string finalImageUrl = null;

                // Validate: must have either file or imageUrl
                if (request.File == null && string.IsNullOrWhiteSpace(request.ImageUrl))
                {
                    return BadRequest(new { message = "Either file upload or image URL is required" });
                }

                // Handle file upload
                if (request.File != null)
                {
                    // Validate file type
                    var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
                    var fileExt = Path.GetExtension(request.File.FileName).ToLowerInvariant();
                    if (string.IsNullOrEmpty(fileExt) || !allowedExtensions.Contains(fileExt))
                    {
                        return BadRequest(new { message = "Invalid file type. Only JPG, JPEG, PNG, GIF, and WEBP are allowed." });
                    }

                    // Validate file size (max 5MB)
                    const long maxFileSize = 5 * 1024 * 1024; // 5MB
                    if (request.File.Length > maxFileSize)
                    {
                        return BadRequest(new { message = "File size exceeds 5MB limit." });
                    }

                    // Save file using FileHelper
                    finalImageUrl = await Give_AID.Helpers.FileHelper.SaveFileAsync(request.File, _env, "gallery");
                }
                else
                {
                    // Use provided URL
                    finalImageUrl = request.ImageUrl?.Trim();
                    if (string.IsNullOrWhiteSpace(finalImageUrl))
                    {
                        return BadRequest(new { message = "Image URL cannot be empty" });
                    }
                }

                // Create gallery item
                var gallery = new Gallery
                {
                    ImageUrl = finalImageUrl,
                    Caption = request.Caption?.Trim(),
                    ProgramId = request.ProgramId
                };

                var result = await _service.CreateAsync(gallery);
                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Gallery] Error creating gallery item: {ex.Message}");
                return StatusCode(500, new { message = "Failed to create gallery item", error = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            if (!await _service.DeleteAsync(id)) return NotFound(new { message = "Gallery item not found" });
            return Ok(new { message = "Gallery item deleted successfully" });
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("admin")]
        public async Task<IActionResult> GetPaged(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 12,
            [FromQuery] string? search = null)
        {
            var result = await _service.GetPagedAsync(page, pageSize, search);
            return Ok(result);
        }
    }
}
