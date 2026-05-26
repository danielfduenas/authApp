using BCrypt.Net;

namespace AuthApi.Application
{
    public static class PasswordHasher
    {
        // Genera un Hash seguro con una Sal integrada automáticamente por BCrypt
        public static string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        // Verifica si la contraseña en texto plano coincide con el Hash guardado
        public static bool VerifyPassword(string password, string hashedPassword)
        {
            return BCrypt.Net.BCrypt.VerifyPassword(password, hashedPassword);
        }
    }
}