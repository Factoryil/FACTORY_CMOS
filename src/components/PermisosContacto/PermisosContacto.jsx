import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "./PermisosContacto.module.css";
import { apiManager } from "../../api/apiManager";

function PermisosContacto({ contactoID, onPermisosUpdate }) {
  const [permisos, setPermisos] = useState([]); // Todos los permisos disponibles
  const [permisosUsuario, setPermisosUsuario] = useState([]); // Permisos asignados al contacto
  const [infoContacto, setInfoContacto] = useState(null); // Información del contacto
  const [cargando, setCargando] = useState(true);
  const location = useLocation();

  // Obtener todos los permisos disponibles
  const obtenerPermisos = async () => {
    try {
      const response = await apiManager.permisos();
      setPermisos(response);
    } catch (error) {
      console.error("Error al obtener los permisos:", error);
    }
  };

  // Obtener los permisos asignados al usuario/contacto y su información
  const obtenerPermisosUsuario = async () => {
    try {
      const response = await apiManager.unionDePermisosContactoID(contactoID);
      console.log("Respuesta API:", response);

      // Extraer datos de usuario y permisos de la respuesta
      const permisosAsignados = Array.isArray(response?.permisos) ? response.permisos : [];
      const datosUsuario = response?.usuario || null;

      setPermisosUsuario(permisosAsignados);
      setInfoContacto(datosUsuario);

      if (onPermisosUpdate) onPermisosUpdate(permisosAsignados);
    } catch (error) {
      console.error("Error al obtener los permisos del usuario:", error);
      setPermisosUsuario([]);
      setInfoContacto(null);
    }
  };

  // Alternar (toggle) el estado del permiso
  const togglePermiso = async (idPermiso) => {
    try {
      const existePermiso = permisosUsuario.some(
        (permiso) => permiso.ID_PERMISO === idPermiso
      );

      if (existePermiso) {
        await apiManager.desactivarPermisoContacto(idPermiso, contactoID);
      } else {
        await apiManager.activarPermisoContacto({ id_permiso: idPermiso, id_usuario: contactoID });
      }

      // Recargar permisos asignados y datos de usuario
      obtenerPermisosUsuario();
    } catch (error) {
      console.error("Error al cambiar el estado del permiso:", error);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab === "Permiso") {
      obtenerPermisos();
      obtenerPermisosUsuario();
      setCargando(false);
    }
  }, [contactoID, location.search]);

  if (cargando) {
    return <div>Cargando...</div>;
  }

  return (
    <div className={styles.container}>
      {infoContacto ? (
        <>
          <div className={styles.contactCard}>
            <div className={styles.cardHeader}>
              <h3>Información del Usuario</h3>
            </div>
            <div className={styles.cardBody}>
              <p>
                <i className="fas fa-user"></i>
                <span><strong>Usuario:</strong> {infoContacto.USERNAME}</span>
              </p>
              <p>
                <i className="fas fa-envelope"></i>
                <span><strong>Correo:</strong> {infoContacto.CORREO_ELECTRONICO}</span>
              </p>
              <p>
                <i className="fas fa-user-tag"></i>
                <span><strong>Rol:</strong> {infoContacto.NOMBRE_ROL}</span>
              </p>
            </div>
          </div>
          <h3 className={styles.title}>Gestión de Permisos</h3>
          <ul className={styles.lista}>
            {permisos.map((permiso) => {
              // Verificar si el permiso está asignado al usuario
              const estaActivo = permisosUsuario.some(
                (permisoUsuario) => permisoUsuario.ID_PERMISO === permiso.ID_PERMISO
              );
              return (
                <li key={permiso.ID_PERMISO} className={styles.item}>
                  <div>
                    <strong>{permiso.MODULO}: {permiso.TIPO}</strong> <br />
                    <small>{permiso.DESCRIPCION}</small>
                  </div>
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
        </>
      ) : (
        <div className={styles.error}>No se encontró información del contacto.</div>
      )}
    </div>
  );
}

export default PermisosContacto;
