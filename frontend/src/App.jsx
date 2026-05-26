import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute, RoleRoute } from './components/ProtectedRoute';

// Importar pantallas públicas
import Login from './pages/Login';
import Register from './pages/Register';

// Importar pantallas protegidas reales
import UsersTable from './pages/UsersTable';
import Profile from './pages/Profile'; // La crearemos a continuación

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ========================================== */}
          {/* RUTAS PÚBLICAS                            */}
          {/* ========================================== */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ========================================== */}
          {/* RUTAS PROTEGIDAS (Cualquier usuario con JWT) */}
          {/* ========================================== */}
          <Route element={<PrivateRoute />}>
            
            {/* Ruta para el perfil del usuario común o administrador */}
            <Route path="/profile" element={<Profile />} />
            
            {/* ========================================== */}
            {/* RUTAS EXCLUSIVAS DE ADMINISTRADOR          */}
            {/* ========================================== */}
            <Route element={<RoleRoute allowedRoles={['admin']} />}>
              <Route path="/users" element={<UsersTable />} />
            </Route>
            
          </Route>

          {/* Redirección por defecto: si la URL no existe, vuelve al login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;