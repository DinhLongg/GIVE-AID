using Backend.Data;
using Backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add configuration and services
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Configure JSON serialization to use camelCase for property names
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
        // Ignore circular references to prevent infinite loops (e.g., Donation.User.Donations.User...)
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// DbContext
var conn = builder.Configuration.GetConnectionString("DefaultConnection")
           ?? "Server=(localdb)\\MSSQLLocalDB;Database=GiveAidDB;Trusted_Connection=True;";
builder.Services.AddDbContext<GiveAidContext>(options => options.UseSqlServer(conn));

// DI: Services
builder.Services.AddScoped<Backend.Services.AuthService>();
builder.Services.AddScoped<Backend.Services.DonationService>();
builder.Services.AddScoped<Backend.Services.NGOService>();
builder.Services.AddScoped<Backend.Services.PartnerService>();
builder.Services.AddScoped<Backend.Services.ProgramService>();
builder.Services.AddScoped<Backend.Services.GalleryService>();
builder.Services.AddScoped<Backend.Services.QueryService>();
builder.Services.AddScoped<Backend.Services.UserService>();
builder.Services.AddScoped<Backend.Services.InvitationService>();
builder.Services.AddScoped<Backend.Services.EmailService>();
builder.Services.AddScoped<Backend.Services.AboutService>();
builder.Services.AddScoped<Backend.Services.ProfileService>();

// JWT Auth config
var jwtKey = builder.Configuration["Jwt:Key"] ?? "very_secret_key_change_me_please";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "Give_AID";
var key = Encoding.ASCII.GetBytes(jwtKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false; // set true in production
    options.SaveToken = true;
    options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = jwtIssuer,
        ValidateAudience = false,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateLifetime = true,
    };
});

builder.Services.AddAuthorization();

// CORS Configuration - Allow frontend to call API
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000", "http://localhost:5174")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Seed data on startup
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<GiveAidContext>();
    var configuration = services.GetRequiredService<IConfiguration>();
    try
    {
        // Seed admin user
        await Backend.Helpers.DataSeeder.SeedAdminUserAsync(context, configuration);
        
        // Seed NGOs and Programs (only if database is empty)
        await Backend.Helpers.DataSeeder.SeedNGOsAndProgramsAsync(context);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error seeding data: {ex.Message}");
        Console.WriteLine($"Stack trace: {ex.StackTrace}");
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
