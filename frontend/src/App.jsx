import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute, RoleRoute } from './components/ProtectedRoute';

// Importar pantallas públicas
import Login from './pages/Login';
import Register from './pages/Register';

// Componentes temporales para las vistas protegidas (los desarrollaremos a continuación)
const TempUsersTable = () => (
  <div style={{ padding: '2rem', backgroundColor: '#0f172a', minHeight: '100vh', color: '#fff' }}>
    <h2>Panel de Administración (Vista de Admin)</h2>
    <p>Pronto listaremos la tabla de usuarios aquí.</p>
  </div>
);

const TempProfile = () => (
  <div style={{ padding: '2rem', backgroundColor: '#0f172a', minHeight: '100vh', color: '#fff' }}>
    <h2>Mi Perfil (Vista de Usuario Común)</h2>
    <p>Pronto mostraremos los datos del perfil aquí.</p>
  </div>
);

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
            {/* Ruta para usuarios estándar ('user') */}
            <Route path="/profile" element={<TempProfile />} />
            
            {/* ========================================== */}
            {/* RUTAS EXCLUSIVAS DE ADMINISTRADOR          */}
            {/* ========================================== */}
            <Route element={<RoleRoute allowedRoles={['admin']} />}>
              <Route path="/users" element={<TempUsersTable />} />
            </Route>
          </Route>

          {/* Redirección por defecto: si no coincide con nada, va al login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;