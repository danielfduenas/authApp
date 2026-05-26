using AuthApi.Infrastructure;
using AuthApi.Application;
using Microsoft.EntityFrameworkCore;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// ==========================================
// 1. REGISTRO DE SERVICIOS (DI CONTAINER)
// ==========================================

builder.Services.AddControllers();

// Configurar CORS para permitir peticiones desde el Frontend (React)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://127.0.0.1:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Registrar el AppDbContext para usar SQL Server en Docker
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Registrar utilidades de la capa de aplicación
builder.Services.AddScoped<TokenService>();

// Configurar la autenticación JWT con firma HS256
var secretKey = builder.Configuration["JwtSettings:SecretKey"] ?? throw new InvalidOperationException("JWT Secret Key not configured.");
var key = Encoding.ASCII.GetBytes(secretKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false; 
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false,
        ClockSkew = TimeSpan.Zero
    };
});

// Configurar Swagger de forma segura y compatible con .NET 10
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// ==========================================
// 2. CONFIGURACIÓN DEL PIPELINE HTTP (MIDDLEWARES)
// ==========================================

// Habilitar Swagger visible para cumplir con los requisitos de la prueba
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "AuthApi v1");
});

app.UseCors("AllowFrontend");

app.UseHttpsRedirection();

// Middlewares de seguridad
app.UseAuthentication(); 
app.UseAuthorization();  

app.MapControllers();

app.Run();