import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// 1. Protector General: Bloquea a usuarios no autenticados
export const PrivateRoute = () => {
  const { token } = useAuth();
  return token ? <Outlet /> : <Navigate to="/login" replace />; // 
};

// 2. Protector de Rol: Bloquea si el usuario no tiene el rol autorizado 
export const RoleRoute = ({ allowedRoles }) => {
  const { user } = useAuth();
  
  if (!user || !allowedRoles.includes(user.role)) {
    // Si es un usuario común intentando ver la lista de admin, lo manda a su perfil [cite: 14, 93]
    return <Navigate to="/profile" replace />; 
  }

  return <Outlet />;
};