import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  // Inicialización de react-hook-form
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      setApiError('');
      setLoading(true);
      const userData = await login(data.email, data.password);
      
      // Si es admin, va a la tabla de gestión; si es usuario normal, a su perfil
      if (userData.role === 'admin') {
        navigate('/users');
      } else {
        navigate('/profile');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Error al conectar con el servidor.';
      setApiError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Iniciar Sesión</h2>
        <p style={styles.subtitle}>Ingresa tus credenciales para continuar</p>

        {apiError && <div style={styles.errorBanner}>{apiError}</div>}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>Correo Electrónico</label>
            <input
              id="email"
              type="email"
              style={{ ...styles.input, borderColor: errors.email ? '#ef4444' : '#374151' }}
              {...register('email', {
                required: 'El correo es obligatorio',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'El formato de correo no es válido'
                }
              })}
            />
            {errors.email && <span style={styles.errorText}>{errors.email.message}</span>}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>Contraseña</label>
            <input
              id="password"
              type="password"
              style={{ ...styles.input, borderColor: errors.password ? '#ef4444' : '#374151' }}
              {...register('password', {
                required: 'La contraseña es obligatoria'
              })}
            />
            {errors.password && <span style={styles.errorText}>{errors.password.message}</span>}
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Validando...' : 'Ingresar'}
          </button>
        </form>

        <p style={styles.footerText}>
          ¿No tienes una cuenta? <Link to="/register" style={styles.link}>Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
};

// Estilos modulares integrados en JS para agilizar el desarrollo de la prueba
const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0f172a', fontFamily: 'system-ui, sans-serif', color: '#f8fafc' },
  card: { width: '100%', maxWidth: '400px', padding: '2.5rem', borderRadius: '12px', backgroundColor: '#1e293b', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)', boxSizing: 'border-box' },
  title: { fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.5rem', textAlign: 'center', color: '#f8fafc' },
  subtitle: { fontSize: '0.875rem', color: '#94a3b8', marginBottom: '2rem', textAlign: 'center' },
  formGroup: { marginBottom: '1.5rem', display: 'flex', flexDirection: 'column' },
  label: { fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#cbd5e1' },
  input: { padding: '0.75rem', borderRadius: '6px', backgroundColor: '#0f172a', border: '1px solid #374151', color: '#f8fafc', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' },
  errorText: { color: '#ef4444', fontSize: '0.75rem', marginTop: '0.4rem' },
  errorBanner: { padding: '0.75rem', borderRadius: '6px', backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#f87171', fontSize: '0.875rem', marginBottom: '1.5rem', textAlign: 'center' },
  button: { width: '100%', padding: '0.75rem', borderRadius: '6px', backgroundColor: '#2563eb', color: '#ffffff', fontSize: '1rem', fontWeight: '600', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s', marginTop: '0.5rem' },
  footerText: { fontSize: '0.875rem', color: '#94a3b8', marginTop: '1.5rem', textAlign: 'center' },
  link: { color: '#60a5fa', textDecoration: 'none', fontWeight: '500' }
};

export default Login;