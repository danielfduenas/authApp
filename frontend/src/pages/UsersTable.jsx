import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import UserModal from '../components/UserModal';

const UsersTable = () => {
  const { logout, user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Estados para el modal de creación/edición de usuarios
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleCreate = () => {
    setSelectedUser(null); // Modo creación
    setIsModalOpen(true);
  };

  const handleEdit = (userToEdit) => {
    setSelectedUser(userToEdit); // Modo edición
    setIsModalOpen(true);
  };

  // 1. Cargar usuarios desde el backend al montar el componente
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await API.get('/users');
      setUsers(response.data);
    } catch (err) {
      setError('No se pudo cargar la lista de usuarios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. Función para alternar el estado Activo/Inactivo de un usuario
  const toggleStatus = async (id, currentStatus) => {
    if (id === currentUser.id) {
      alert('No puedes desactivar tu propia cuenta de administrador de forma remota.');
      return;
    }
    try {
      await API.put(`/users/${id}`, { isActive: !currentStatus });
      // Sincronizar el estado local ágilmente
      setUsers(users.map(u => u.id === id ? { ...u, isActive: !currentStatus } : u));
    } catch (err) {
      alert('Error al actualizar el estado del usuario.');
    }
  };

  // 3. Función para eliminar un usuario de forma permanente
  const handleDelete = async (id, name) => {
    if (id === currentUser.id) {
      alert('No puedes eliminar tu propia cuenta de administrador.');
      return;
    }

    const confirmDelete = window.confirm(`¿Estás seguro de que deseas eliminar permanentemente a ${name}?`);
    if (confirmDelete) {
      try {
        await API.delete(`/users/${id}`);
        setUsers(users.filter(u => u.id !== id));
      } catch (err) {
        alert('Error al eliminar el usuario.');
      }
    }
  };

  // 4. Filtrar la lista local según lo que escriba el usuario en la barra de búsqueda
  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.dashboardContainer}>
      {/* Barra de Navegación Superior */}
      <header style={styles.header}>
        <div style={styles.brand}>
          <h1 style={styles.brandTitle}>AuthApp Admin</h1>
          <span style={styles.badge}>Panel de Gestión</span>
        </div>
        <div style={styles.userInfo}>
          <span style={styles.welcomeText}>Bienvenido, <strong>{currentUser?.name}</strong></span>
          <button onClick={logout} style={styles.logoutButton}>Cerrar Sesión</button>
        </div>
      </header>

      {/* Contenido Principal */}
      <main style={styles.mainContent}>
        <div style={styles.actionsBar}>
          {/* Barra de Búsqueda */}
          <input
            type="text"
            placeholder="Buscar por nombre o correo electrónico..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
          {/* Botón para registrar un nuevo usuario */}
          <button style={styles.createButton} onClick={handleCreate}>
            + Nuevo Usuario
          </button>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        {/* Tabla Responsiva */}
        <div style={styles.tableWrapper}>
          {loading ? (
            <div style={styles.loadingText}>Cargando registros del servidor...</div>
          ) : filteredUsers.length === 0 ? (
            <div style={styles.emptyText}>No se encontraron usuarios coincidentes.</div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Nombre</th>
                  <th style={styles.th}>Correo Electrónico</th>
                  <th style={styles.th}>Rol asignado</th>
                  <th style={styles.th}>Estado</th>
                  <th style={styles.th}>Acciones de control</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((userItem) => (
                  <tr key={userItem.id} style={styles.tr}>
                    <td style={styles.td}>
                      <div style={styles.nameCell}>{userItem.name}</div>
                    </td>
                    <td style={styles.td}>{userItem.email}</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.roleBadge,
                        backgroundColor: userItem.role === 'admin' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(148, 163, 184, 0.15)',
                        color: userItem.role === 'admin' ? '#60a5fa' : '#94a3b8'
                      }}>
                        {userItem.role}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {/* Switch interactivo de estado de cuenta */}
                      <button
                        onClick={() => toggleStatus(userItem.id, userItem.isActive ?? true)}
                        disabled={userItem.id === currentUser.id}
                        style={{
                          ...styles.statusButton,
                          backgroundColor: (userItem.isActive ?? true) ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color: (userItem.isActive ?? true) ? '#34d399' : '#f87171',
                          cursor: userItem.id === currentUser.id ? 'not-allowed' : 'pointer'
                        }}
                      >
                        <span style={{
                          ...styles.statusDot,
                          backgroundColor: (userItem.isActive ?? true) ? '#10b981' : '#ef4444'
                        }}></span>
                        {(userItem.isActive ?? true) ? 'Activo' : 'Inactivo'}
                      </button>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.btnGroup}>
                        <button 
                          onClick={() => handleEdit(userItem)} 
                          style={styles.actionBtnEdit}
                        >
                          Editar
                        </button>
                        {userItem.id !== currentUser.id && (
                          <button 
                            onClick={() => handleDelete(userItem.id, userItem.name)} 
                            style={styles.actionBtnDelete}
                          >
                            Eliminar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* Modal posicionado de manera segura en la raíz del componente */}
      <UserModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchUsers} 
        userToEdit={selectedUser} 
      />
    </div>
  );
};

// Estilos modulares consolidados
const styles = {
  dashboardContainer: { minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', fontFamily: 'system-ui, sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', backgroundColor: '#1e293b', borderBottom: '1px solid #374151' },
  brand: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  brandTitle: { fontSize: '1.25rem', fontWeight: 'bold', margin: 0 },
  badge: { fontSize: '0.75rem', backgroundColor: '#2563eb', padding: '0.25rem 0.5rem', borderRadius: '4px', fontWeight: '500' },
  userInfo: { display: 'flex', alignItems: 'center', gap: '1.5rem' },
  welcomeText: { fontSize: '0.875rem', color: '#cbd5e1' },
  logoutButton: { backgroundColor: 'transparent', border: '1px solid #ef4444', color: '#f87171', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500', transition: 'all 0.2s' },
  mainContent: { padding: '2rem', maxWidth: '1200px', margin: '0 auto' },
  actionsBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' },
  searchInput: { flex: 1, maxWidth: '400px', padding: '0.75rem 1rem', borderRadius: '8px', backgroundColor: '#1e293b', border: '1px solid #374151', color: '#f8fafc', fontSize: '0.95rem', outline: 'none' },
  createButton: { backgroundColor: '#10b981', color: '#ffffff', border: 'none', padding: '0.75rem 1.2rem', borderRadius: '8px', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer' },
  errorBox: { padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#f87171', borderRadius: '8px', marginBottom: '1.5rem' },
  tableWrapper: { backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #374151', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' },
  th: { padding: '1rem 1.5rem', backgroundColor: '#111827', color: '#94a3b8', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #374151' },
  tr: { borderBottom: '1px solid #374151', transition: 'background-color 0.15s' },
  td: { padding: '1rem 1.5rem', color: '#e2e8f0', verticalAlign: 'middle' },
  nameCell: { fontWeight: '600', color: '#ffffff' },
  roleBadge: { padding: '0.25rem 0.5rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase' },
  statusButton: { display: 'flex', alignItems: 'center', gap: '0.4rem', border: 'none', padding: '0.35rem 0.7rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '500', transition: 'all 0.15s' },
  statusDot: { width: '6px', height: '6px', borderRadius: '50%' },
  btnGroup: { display: 'flex', gap: '0.5rem' },
  actionBtnEdit: { backgroundColor: '#3b82f6', color: '#fff', border: 'none', padding: '0.4rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '500', cursor: 'pointer' },
  actionBtnDelete: { backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '0.4rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '500', cursor: 'pointer' },
  loadingText: { padding: '3rem', textAlign: 'center', color: '#94a3b8' },
  emptyText: { padding: '3rem', textAlign: 'center', color: '#94a3b8' }
};

export default UsersTable;