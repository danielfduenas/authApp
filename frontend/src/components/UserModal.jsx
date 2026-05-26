import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import API from '../services/api';

const UserModal = ({ isOpen, onClose, onSuccess, userToEdit }) => {
  const isEdit = !!userToEdit;
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Resetear el formulario cuando se abre el modal o cambia el usuario a editar
  useEffect(() => {
    if (userToEdit) {
      reset({
        name: userToEdit.name,
        email: userToEdit.email,
        role: userToEdit.role
      });
    } else {
      reset({ name: '', email: '', role: 'user', password: '' });
    }
  }, [userToEdit, reset, isOpen]);

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        // PUT /api/users/{id}
        await API.put(`/users/${userToEdit.id}`, data);
      } else {
        // POST /api/users
        await API.post('/users', data);
      }
      onSuccess(); // Recargar la tabla
      onClose();   // Cerrar el modal
    } catch (error) {
      alert(error.response?.data?.message || 'Error al procesar la solicitud');
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3 style={styles.title}>{isEdit ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Nombre Completo</label>
            <input
              style={styles.input}
              {...register('name', { required: 'El nombre es obligatorio' })}
            />
            {errors.name && <span style={styles.error}>{errors.name.message}</span>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Correo Electrónico</label>
            <input
              style={styles.input}
              type="email"
              {...register('email', { required: 'El correo es obligatorio' })}
            />
            {errors.email && <span style={styles.error}>{errors.email.message}</span>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Contraseña {isEdit && '(Dejar en blanco para no cambiar)'}</label>
            <input
              style={styles.input}
              type="password"
              {...register('password', { required: !isEdit && 'La contraseña es obligatoria' })}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Rol</label>
            <select style={styles.input} {...register('role')}>
              <option value="user">Usuario (user)</option>
              <option value="admin">Administrador (admin)</option>
            </select>
          </div>

          <div style={styles.actions}>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>Cancelar</button>
            <button type="submit" style={styles.saveBtn}>{isEdit ? 'Actualizar' : 'Crear'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modal: { backgroundColor: '#1e293b', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '450px', border: '1px solid #374151' },
  title: { marginTop: 0, marginBottom: '1.5rem', color: '#fff' },
  formGroup: { marginBottom: '1rem', display: 'flex', flexDirection: 'column' },
  label: { fontSize: '0.875rem', marginBottom: '0.5rem', color: '#94a3b8' },
  input: { padding: '0.7rem', borderRadius: '6px', backgroundColor: '#0f172a', border: '1px solid #374151', color: '#fff' },
  error: { color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' },
  actions: { display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' },
  cancelBtn: { padding: '0.6rem 1.2rem', borderRadius: '6px', backgroundColor: 'transparent', color: '#94a3b8', border: '1px solid #374151', cursor: 'pointer' },
  saveBtn: { padding: '0.6rem 1.2rem', borderRadius: '6px', backgroundColor: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer' }
};

export default UserModal;