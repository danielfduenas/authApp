using System.ComponentModel.DataAnnotations;

namespace AuthApi.Application
{
    // DTO para que el Admin cree usuarios manualmente desde el panel
    public class CreateUserDto
    {
        [Required(ErrorMessage = "El correo electrónico es obligatorio.")]
        [EmailAddress(ErrorMessage = "El formato del correo electrónico no es válido.")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "La contraseña es obligatoria.")]
        [MinLength(6, ErrorMessage = "La contraseña debe tener al menos 6 caracteres.")]
        public string Password { get; set; } = string.Empty;

        [Required(ErrorMessage = "El nombre es obligatorio.")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "El rol es obligatorio.")]
        public string Role { get; set; } = "user"; // "admin" o "user"
    }

    // DTO flexible para actualizar datos de un usuario existente
    public class UpdateUserDto
    {
        [EmailAddress(ErrorMessage = "El formato del correo electrónico no es válido.")]
        public string? Email { get; set; }

        public string? Password { get; set; } // Opcional, por si se desea cambiar

        public string? Name { get; set; }

        public string? Role { get; set; } // Solo el admin podrá procesar este campo

        public bool? IsActive { get; set; }
    }
}