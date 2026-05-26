import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const Profile = () => {
  const { logout, user: authUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        // Consumir el endpoint protegido usando el ID del token en sesión
        const response = await API.get(`/users/${authUser.id}`);
        setProfileData(response.data);
      } catch (err) {
        const message = err.response?.data?.message || 'No se pudo cargar la información del perfil.';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    if (authUser?.id) {
      fetchProfile();
    }
  }, [authUser]);

  return (
    <div style={styles.container}>
      {/* Navbar Superior del Usuario */}
      <header style={styles.header}>
        <div style={styles.brand}>
          <h1 style={styles.brandTitle}>AuthApp</h1>
          <span style={styles.badge}>Mi Perfil</span>
        </div>
        <button onClick={logout} style={styles.logoutButton}>Cerrar Sesión</button>
      </header>

      {/* Contenedor de la Tarjeta */}
      <main style={styles.main}>
        <div style={styles.card}>
          <div style={styles.avatarSection}>
            <div style={styles.avatarPlaceholder}>
              {profileData?.name?.charAt(0).toUpperCase() || '?'}
            </div>
            <h2 style={styles.nameTitle}>{profileData?.name || 'Cargando...'}</h2>
            <span style={{
              ...styles.roleBadge,
              backgroundColor: profileData?.role === 'admin' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(16, 185, 129, 0.15)',
              color: profileData?.role === 'admin' ? '#60a5fa' : '#34d399'
            }}>
              Rol: {profileData?.role}
            </span>
          </div>

          <hr style={styles.divider} />

          {loading ? (
            <div style={styles.infoText}>Consultando credenciales seguras...</div>
          ) : error ? (
            <div style={styles.errorBox}>{error}</div>
          ) : (
            <div style={styles.infoSection}>
              <div style={styles.infoGroup}>
                <span style={styles.infoLabel}>Identificador Único (UUID)</span>
                <span style={styles.infoValue}>{profileData?.id}</span>
              </div>

              <div style={styles.infoGroup}>
                <span style={styles.infoLabel}>Correo Electrónico</span>
                <span style={styles.infoValue}>{profileData?.email}</span>
              </div>

              <div style={styles.infoGroup}>
                <span style={styles.infoLabel}>Estado de la Cuenta</span>
                <span style={styles.statusValue}>
                  <span style={styles.statusDot}></span> Activa y Verificada
                </span>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// Consistencia visual con el layout oscuro del ecosistema
const styles = {
  container: { minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', fontFamily: 'system-ui, sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', backgroundColor: '#1e293b', borderBottom: '1px solid #374151' },
  brand: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  brandTitle: { fontSize: '1.25rem', fontWeight: 'bold', margin: 0 },
  badge: { fontSize: '0.75rem', backgroundColor: '#10b981', padding: '0.25rem 0.5rem', borderRadius: '4px', fontWeight: '500' },
  logoutButton: { backgroundColor: 'transparent', border: '1px solid #ef4444', color: '#f87171', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500' },
  main: { display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '3rem 1rem' },
  card: { width: '100%', maxWidth: '500px', backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #374151', padding: '2.5rem', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)', boxSizing: 'border-box' },
  avatarSection: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' },
  avatarPlaceholder: { width: '70px', height: '70px', borderRadius: '50%', backgroundColor: '#2563eb', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '2rem', fontWeight: 'bold', color: '#ffffff', marginBottom: '1rem' },
  nameTitle: { fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 0.5rem 0', textAlign: 'center' },
  roleBadge: { padding: '0.3rem 0.75rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' },
  divider: { border: 0, height: '1px', backgroundColor: '#374151', margin: '1.5rem 0' },
  infoSection: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  infoGroup: { display: 'flex', flexDirection: 'column', gap: '0.35rem' },
  infoLabel: { fontSize: '0.75rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: '600', letterSpacing: '0.05em' },
  infoValue: { fontSize: '1rem', color: '#e2e8f0', wordBreak: 'break-all' },
  statusValue: { display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', color: '#34d399', fontWeight: '500' },
  statusDot: { width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' },
  infoText: { textAlign: 'center', color: '#94a3b8', padding: '1rem 0' },
  errorBox: { padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#f87171', borderRadius: '8px', textAlign: 'center' }
};

export default Profile;