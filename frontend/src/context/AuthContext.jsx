import { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, [token]);

  // Función para manejar el inicio de sesión exitoso
  const login = async (email, password) => {
    const response = await API.post('/auth/login', { email, password }); // Contrato sugerido 
    const { accessToken, user: userData } = response.data;

    localStorage.setItem('token', accessToken);
    localStorage.setItem('user', JSON.stringify(userData));
    
    setToken(accessToken);
    setUser(userData);
    return userData;
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para consumir el contexto de forma rápida
export const useAuth = () => useContext(AuthContext);