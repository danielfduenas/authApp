import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { useState } from 'react';

const Register = () => {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      setApiError('');
      setLoading(true);
      
      // Llamada directa al endpoint público que creamos en .NET
      await API.post('/auth/register', {
        email: data.email,
        password: data.password,
        name: data.name
      });

      setSuccess(true);
      setTimeout(() => navigate('/login'), 2500); // Redirige al login tras el éxito
    } catch (error) {
      const message = error.response?.data?.message || 'Error al procesar el registro.';
      setApiError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Crear Cuenta</h2>
        <p style={styles.subtitle}>Completa los campos para registrarte</p>

        {apiError && <div style={styles.errorBanner}>{apiError}</div>}
        {success && <div style={styles.successBanner}>¡Registro exitoso! Redirigiendo...</div>}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div style={styles.formGroup}>
            <label htmlFor="name" style={styles.label}>Nombre Completo</label>
            <input
              id="name"
              type="text"
              style={{ ...styles.input, borderColor: errors.name ? '#ef4444' : '#374151' }}
              {...register('name', { required: 'El nombre es obligatorio' })}
            />
            {errors.name && <span style={styles.errorText}>{errors.name.message}</span>}
          </div>

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
                required: 'La contraseña es obligatoria',
                minLength: { value: 6, message: 'La contraseña debe tener al menos 6 caracteres' }
              })}
            />
            {errors.password && <span style={styles.errorText}>{errors.password.message}</span>}
          </div>

          <button type="submit" disabled={loading || success} style={styles.button}>
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <p style={styles.footerText}>
          ¿Ya tienes cuenta? <Link to="/login" style={styles.link}>Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
};

// Reutilizamos la misma consistencia visual
const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0f172a', fontFamily: 'system-ui, sans-serif', color: '#f8fafc' },
  card: { width: '100%', maxWidth: '400px', padding: '2.5rem', borderRadius: '12px', backgroundColor: '#1e293b', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)', boxSizing: 'border-box' },
  title: { fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.5rem', textAlign: 'center', color: '#f8fafc' },
  subtitle: { fontSize: '0.875rem', color: '#94a3b8', marginBottom: '2rem', textAlign: 'center' },
  formGroup: { marginBottom: '1.5rem', display: 'flex', flexDirection: 'column' },
  label: { fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#cbd5e1' },
  input: { padding: '0.75rem', borderRadius: '6px', backgroundColor: '#0f172a', border: '1px solid #374151', color: '#f8fafc', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' },
  errorText: { color: '#ef4444', fontSize: '0.75rem', marginTop: '0.4rem' },
  errorBanner: { padding: '0.75rem', borderRadius: '6px', backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#f87171', fontSize: '0.875rem', marginBottom: '1.5rem', textAlign: 'center' },
  successBanner: { padding: '0.75rem', borderRadius: '6px', backgroundColor: 'rgba(34, 197, 94, 0.15)', border: '1px solid #22c55e', color: '#4ade80', fontSize: '0.875rem', marginBottom: '1.5rem', textAlign: 'center' },
  button: { width: '100%', padding: '0.75rem', borderRadius: '6px', backgroundColor: '#10b981', color: '#ffffff', fontSize: '1rem', fontWeight: '600', border: 'none', cursor: 'pointer', marginTop: '0.5rem' },
  footerText: { fontSize: '0.875rem', color: '#94a3b8', marginTop: '1.5rem', textAlign: 'center' },
  link: { color: '#60a5fa', textDecoration: 'none', fontWeight: '500' }
};

export default Register;