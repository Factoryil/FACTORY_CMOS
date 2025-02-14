import React, { useState } from "react";
import styles from "./PermisosContacto.module.css";

function PermisosContacto({ usuario, permisosAsignados }) {
  // Simulamos permisos disponibles en el sistema
  const permisosDisponibles = [
    { id: 1, nombre: "Ver Reportes" },
    { id: 2, nombre: "Editar Usuarios" },
    { id: 3, nombre: "Eliminar Registros" },
    { id: 4, nombre: "Administrar Configuración" }
  ];

  const [permisos, setPermisos] = useState(permisosDisponibles);

  const togglePermiso = (id) => {
    setPermisos((prev) =>
      prev.map((permiso) =>
        permiso.id === id ? { ...permiso, activo: !permiso.activo } : permiso
      )
    );
  };

  return (
    <div className={styles.container}>
      {/* Información del Usuario */}
      <div className={styles.usuarioInfo}>
        <h3 className={styles.title}>Usuario Asociado</h3>
        <p><strong>👤 Username:</strong> {usuario.username}</p>
        <p><strong>📧 Correo:</strong> {usuario.correo}</p>
        <p><strong>📞 Teléfono:</strong> {usuario.telefono}</p>
        <p><strong>🔰 Rol:</strong> {usuario.rol}</p>
      </div>

      {/* Gestión de Permisos */}
      <h3 className={styles.title}>Gestión de Permisos</h3>
      <ul className={styles.lista}>
        {permisos.map((permiso) => (
          <li key={permiso.id} className={styles.item}>
            {permiso.nombre}
            <button
              className={`${styles.toggleButton} ${permiso.activo ? styles.on : styles.off}`}
              onClick={() => togglePermiso(permiso.id)}
            >
              {permiso.activo ? "ON" : "OFF"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PermisosContacto;
