using Backend.Data;
using Backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add configuration and services
builder.Services.AddControllers();
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
builder.Services.AddScoped<ProfileService>();//thêm mới 30/10


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

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
