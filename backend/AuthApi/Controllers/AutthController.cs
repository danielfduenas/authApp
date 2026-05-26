using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AuthApi.Infrastructure;
using AuthApi.Application;
using System.Threading.Tasks;

namespace AuthApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // Ruta base: api/auth
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly TokenService _tokenService;

        public AuthController(AppDbContext context, TokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        // POST /api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            // 1. Validar resiliencia: Evitar emails duplicados (Retorna 409 Conflict o 400)
            if (await _context.Users.AnyAsync(u => u.Email.ToLower() == dto.Email.ToLower()))
            {
                return Conflict(new { message = "El correo electrónico ya se encuentra registrado." });
            }

            // 2. Aplicar Hash + Sal seguro con BCrypt (Requisito eliminatorio "gatekeeper")
            string hashedPassword = PasswordHasher.HashPassword(dto.Password);

            var newUser = new User
            {
                Email = dto.Email.ToLower(),
                PasswordHash = hashedPassword,
                PasswordSalt = "BCrypt_Salt_Embedded", // La sal está contenida en el propio hash string de BCrypt
                Name = dto.Name,
                Role = "user" // Por defecto todo registro nuevo es rol normal 'user'
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Usuario registrado exitosamente." });
        }

        // POST /api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            // 1. Buscar al usuario por correo
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == dto.Email.ToLower());
            
            // 2. Validar credenciales de forma genérica (por seguridad) y verificar si el usuario está activo
            if (user == null || !PasswordHasher.VerifyPassword(dto.Password, user.PasswordHash))
            {
                return BadRequest(new { message = "Credenciales incorrectas." });
            }

            if (!user.IsActive)
            {
                return StatusCode(403, new { message = "Esta cuenta ha sido desactivada." });
            }

            // 3. Generar el Access Token con firma simétrica HS256 mediante nuestro servicio
            var token = _tokenService.GenerateToken(user);

            // 4. Mapear y responder el contrato esperado
            var response = new AuthResponseDto
            {
                AccessToken = token,
                User = new UserResponseDto
                {
                    Id = user.Id,
                    Email = user.Email,
                    Name = user.Name,
                    Role = user.Role
                }
            };

            return Ok(response);
        }
    }
}