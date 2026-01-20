using BusinessLayer.Interfaces;
using BusinessLayer.Services;
using DataBaseLayer.FundooDbContext;
using DataBaseLayer.Repositories.Implementations;
using DataBaseLayer.Repositories.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using ModelLayer.Helpers;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// --------------------------------------------------
// CORS Configuration
// --------------------------------------------------
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", policy =>
    {
        policy.WithOrigins(
            "http://localhost:4200",
            "http://127.0.0.1:4200",
            "https://localhost:4200"
        )
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials();
    });
});

// --------------------------------------------------
// Controllers
// --------------------------------------------------
builder.Services.AddControllers();

// --------------------------------------------------
// Database (EF Core)
// --------------------------------------------------
builder.Services.AddDbContext<FundooNotesDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    )
);

// --------------------------------------------------
// Dependency Injection (THIS FIXES YOUR ERROR)
// --------------------------------------------------

// Repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();

// Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<INoteRepository, NoteRepository>();
builder.Services.AddScoped<INoteService, NoteService>();
builder.Services.AddScoped<ILabelRepository, LabelRepository>();
builder.Services.AddScoped<ILabelService, LabelService>();
builder.Services.AddScoped<INoteLabelRepository, NoteLabelRepository>();
builder.Services.AddScoped<INoteLabelService, NoteLabelService>();
builder.Services.AddScoped<ICollaboratorRepository, CollaboratorRepository>();
builder.Services.AddScoped<ICollaboratorService, CollaboratorService>();


// Helpers
builder.Services.AddSingleton<JwtHelper>();

// --------------------------------------------------
// Swagger + JWT Authorization
// --------------------------------------------------
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "FundooNotes API",
        Version = "v1"
    });

    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter JWT token like: Bearer {your_token}"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// --------------------------------------------------
// JWT Authentication
// --------------------------------------------------
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])
            )
        };
    });

// Authorization
builder.Services.AddAuthorization();

var app = builder.Build();

// --------------------------------------------------
// Middleware pipeline
// --------------------------------------------------
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// CORS middleware (must come BEFORE UseHttpsRedirection)
app.UseCors("AllowAngularApp");

// Only use HTTPS redirection in production
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

// ⚠️ ORDER MATTERS
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
