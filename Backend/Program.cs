using Give_AID.API.Data;
using Give_AID.API.Services;
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
builder.Services.AddScoped<Give_AID.API.Services.AuthService>();
builder.Services.AddScoped<Give_AID.API.Services.DonationService>();
builder.Services.AddScoped<Give_AID.API.Services.NGOService>();
builder.Services.AddScoped<Give_AID.API.Services.PartnerService>();
builder.Services.AddScoped<Give_AID.API.Services.ProgramService>();
builder.Services.AddScoped<Give_AID.API.Services.GalleryService>();
builder.Services.AddScoped<Give_AID.API.Services.QueryService>();
builder.Services.AddScoped<Give_AID.API.Services.UserService>();
builder.Services.AddScoped<Give_AID.API.Services.InvitationService>();
builder.Services.AddScoped<Give_AID.API.Services.EmailService>();
builder.Services.AddScoped<Give_AID.API.Services.AboutService>();

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
