using System.ComponentModel.DataAnnotations;

namespace AuthApi.Application
{
    // DTO para mapear el endpoint: POST /api/auth/register
    public class RegisterDto
    {
        [Required(ErrorMessage = "El correo electrónico es obligatorio.")]
        [EmailAddress(ErrorMessage = "El formato del correo electrónico no es válido.")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "La contraseña es obligatoria.")]
        [MinLength(6, ErrorMessage = "La contraseña debe tener al menos 6 caracteres.")]
        public string Password { get; set; } = string.Empty;

        [Required(ErrorMessage = "El nombre es obligatorio.")]
        [StringLength(150, ErrorMessage = "El nombre no puede superar los 150 caracteres.")]
        public string Name { get; set; } = string.Empty;
    }

    // DTO para mapear el endpoint: POST /api/auth/login
    public class LoginDto
    {
        [Required(ErrorMessage = "El correo electrónico es obligatorio.")]
        [EmailAddress(ErrorMessage = "El formato del correo electrónico no es válido.")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "La contraseña es obligatoria.")]
        public string Password { get; set; } = string.Empty;
    }

    // DTO estructurado para la respuesta exitosa del Login
    public class AuthResponseDto
    {
        public string AccessToken { get; set; } = string.Empty;
        public UserResponseDto User { get; set; } = new();
    }

    // Información básica del usuario que es seguro retornar a la UI
    public class UserResponseDto
    {
        public Guid Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
    }
}