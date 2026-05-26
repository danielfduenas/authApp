using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using AuthApi.Infrastructure;
using AuthApi.Application;
using System.Security.Claims;

namespace AuthApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // 🔒 Protege todo el controlador por defecto. Requiere JWT válido.
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        // GET /api/users
        // REGLA: Solo el Administrador puede listar todos los usuarios.
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            if (!User.IsInRole("admin"))
            {
                return StatusCode(403, new { message = "Acceso denegado. Se requieren permisos de Administrador." });
            }

            var users = await _context.Users
                .OrderByDescending(u => u.CreatedAt)
                .Select(u => new UserResponseDto
                {
                    Id = u.Id,
                    Email = u.Email,
                    Name = u.Name,
                    Role = u.Role
                })
                .ToListAsync();

            return Ok(users);
        }

        // GET /api/users/{id}
        // REGLA: El Admin ve a cualquiera. El usuario común SOLO ve su propio ID.
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var currentUserRole = User.FindFirst(ClaimTypes.Role)?.Value;

            if (currentUserRole != "admin" && currentUserId != id.ToString())
            {
                return StatusCode(403, new { message = "Acceso denegado. No tienes permiso para ver el perfil de otro usuario." });
            }

            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "Usuario no encontrado." });
            }

            return Ok(new UserResponseDto
            {
                Id = user.Id,
                Email = user.Email,
                Name = user.Name,
                Role = user.Role
            });
        }

        // POST /api/users
        // REGLA: Solo el Admin puede crear usuarios directamente especificando roles.
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateUserDto dto)
        {
            if (!User.IsInRole("admin"))
            {
                return StatusCode(403, new { message = "Acceso denegado. Solo administradores pueden crear usuarios directos." });
            }

            if (await _context.Users.AnyAsync(u => u.Email.ToLower() == dto.Email.ToLower()))
            {
                return Conflict(new { message = "El correo electrónico ya se encuentra registrado." });
            }

            var newUser = new User
            {
                Email = dto.Email.ToLower(),
                PasswordHash = PasswordHasher.HashPassword(dto.Password),
                PasswordSalt = "BCrypt_Salt_Embedded",
                Name = dto.Name,
                Role = dto.Role.ToLower() == "admin" ? "admin" : "user"
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = newUser.Id }, new { message = "Usuario creado exitosamente.", id = newUser.Id });
        }

        // PUT /api/users/{id}
        // REGLA: El Admin edita todo. El usuario común SOLO edita su propia cuenta (y no puede promoverse a admin).
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateUserDto dto)
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var currentUserRole = User.FindFirst(ClaimTypes.Role)?.Value;

            if (currentUserRole != "admin" && currentUserId != id.ToString())
            {
                return StatusCode(403, new { message = "Acceso denegado. No puedes modificar la cuenta de otra persona." });
            }

            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "Usuario no encontrado." });
            }

            // Aplicar cambios si vienen informados en el DTO
            if (!string.IsNullOrWhiteSpace(dto.Email) && dto.Email.ToLower() != user.Email)
            {
                if (await _context.Users.AnyAsync(u => u.Email.ToLower() == dto.Email.ToLower() && u.Id != id))
                {
                    return Conflict(new { message = "El correo electrónico ya está en uso por otra cuenta." });
                }
                user.Email = dto.Email.ToLower();
            }

            if (!string.IsNullOrWhiteSpace(dto.Name))
            {
                user.Name = dto.Name;
            }

            if (!string.IsNullOrWhiteSpace(dto.Password))
            {
                user.PasswordHash = PasswordHasher.HashPassword(dto.Password);
            }

            // Restricción especial de rol: Solo el admin cambia roles o estados de activación
            if (currentUserRole == "admin")
            {
                if (!string.IsNullOrWhiteSpace(dto.Role))
                {
                    user.Role = dto.Role.ToLower() == "admin" ? "admin" : "user";
                }
                if (dto.IsActive.HasValue)
                {
                    user.IsActive = dto.IsActive.Value;
                }
            }

            user.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Usuario actualizado correctamente." });
        }

        // DELETE /api/users/{id}
        // REGLA: Operación destructiva. Solo el Administrador puede ejecutarla.
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            if (!User.IsInRole("admin"))
            {
                return StatusCode(403, new { message = "Acceso denegado. Solo administradores pueden eliminar registros." });
            }

            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "Usuario no encontrado." });
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Usuario eliminado de forma permanente." });
        }
    }
}