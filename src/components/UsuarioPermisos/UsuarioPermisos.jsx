import React, { useState, useEffect } from "react";
import styles from "./UsuarioPermisos.module.css";
import api from "../../services/apiService"; // Asegúrate de que este archivo API esté configurado

function UsuarioPermisos({ usuarioID }) {
  console.log(usuarioID);
  
  const [permisos, setPermisos] = useState([]); // Todos los permisos disponibles
  const [permisosUsuario, setPermisosUsuario] = useState([]); // Permisos asignados al usuario
  const [cargando, setCargando] = useState(true);

  // Función para obtener todos los permisos disponibles
  const obtenerPermisos = async () => {
    try {
      const response = await api.get("/permisos"); // Endpoint para obtener todos los permisos
      setPermisos(response.data);
    } catch (error) {
      console.error("Error al obtener los permisos:", error);
    }
  };

  // Función para obtener los permisos asignados al usuario
  const obtenerPermisosUsuario = async () => {
    try {
      const response = await api.get(`/union-usuarios-permisos/usuario/${usuarioID}`); // Endpoint para obtener los permisos de un usuario
      setPermisosUsuario(response.data); // Establecer los permisos activos para este usuario
      console.log("Permisos del usuario:", response.data);
    } catch (error) {
      console.error("Error al obtener los permisos del usuario:", error);
    }
  };

  // Función para cambiar el estado de un permiso para el usuario
  const togglePermiso = async (idPermiso) => {
    try {
      const existePermiso = permisosUsuario.some((permiso) => permiso.ID_PERMISO === idPermiso);
      
      if (existePermiso) {
        // Desactivar permiso
        await api.delete(`/union-usuarios-permisos/${idPermiso}/${usuarioID}`);

        // Actualizar la lista local de permisos del usuario eliminando el permiso
        setPermisosUsuario(prevPermisos => prevPermisos.filter(permiso => permiso.ID_PERMISO !== idPermiso));
      } else {
        // Activar permiso
        await api.post("/union-usuarios-permisos", { id_permiso: idPermiso, id_usuario: usuarioID });

        // Actualizar la lista local de permisos del usuario agregando el permiso
        setPermisosUsuario(prevPermisos => [...prevPermisos, { ID_PERMISO: idPermiso }]);
      }
    } catch (error) {
      console.error("Error al cambiar el estado del permiso:", error);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    obtenerPermisos(); // Obtener todos los permisos
    obtenerPermisosUsuario(); // Obtener los permisos del usuario
    setCargando(false); // Finaliza el estado de carga
  }, [usuarioID]); // Solo se recarga si cambia el usuario

  if (cargando) {
    return <div>Cargando...</div>; // Cargando mientras obtenemos los datos
  }

  return (
    <div className={styles.container}>
      <br />
      <h3 className={styles.title}>Gestión de Permisos</h3>
      <br />
      <ul className={styles.lista}>
        {permisos.map((permiso) => {
          const estaActivo = permisosUsuario.some(
            (permisoUsuario) => permisoUsuario.ID_PERMISO === permiso.ID_PERMISO
          );
          return (
            <li key={permiso.ID_PERMISO} className={styles.item}>
              {permiso.DESCRIPCION}  {/* Descripción del permiso */}
              <button
                className={`${styles.toggleButton} ${estaActivo ? styles.on : styles.off}`}
                onClick={() => togglePermiso(permiso.ID_PERMISO)}
              >
                {estaActivo ? "ON" : "OFF"}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default UsuarioPermisos;
