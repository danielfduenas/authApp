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

        // CORRECCIÓN: El método oficial de la librería es .Verify()
        public static bool VerifyPassword(string password, string hashedPassword)
        {
            return BCrypt.Net.BCrypt.Verify(password, hashedPassword);
        }
    }
}