import React, { useState } from "react";
import styles from "../../styles/ModalFormulario.module.css";
import api from "../../services/apiService";

function ModalAgregarPermiso({ cerrarModal }) {
  const [nuevoPermiso, setNuevoPermiso] = useState({
    DESCRIPCION: "",
    TIPO: "",
    MODULO: "",
  });

  const manejarCambio = (e) => {
    setNuevoPermiso({
      ...nuevoPermiso,
      [e.target.name]: e.target.value,
    });
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/permisos", nuevoPermiso);
      console.log("Nuevo permiso agregado:", response.data);
      cerrarModal();
    } catch (error) {
      console.error("Error al agregar permiso:", error);
    }
  };

  const manejarCerrarModal = (e) => {
    if (e.target === e.currentTarget) {
      cerrarModal();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={manejarCerrarModal}>
      <div className={styles.modal}>
        <h2>Agregar Nuevo Permiso</h2>
        <form onSubmit={manejarEnvio}>
          <label htmlFor="descripcion">Descripción</label>
          <input
            type="text"
            id="descripcion"
            name="DESCRIPCION"
            value={nuevoPermiso.DESCRIPCION}
            onChange={manejarCambio}
            required
          />

          <label htmlFor="tipo">Tipo</label>
          <select
            id="tipo"
            name="TIPO"
            value={nuevoPermiso.TIPO}
            onChange={manejarCambio}
            required
          >
            <option value="">Seleccionar tipo</option>
            <option value="lectura">Lectura</option>
            <option value="escritura">Escritura</option>
            <option value="eliminación">Eliminación</option>
            <option value="administración">Administración</option>
          </select>

          <label htmlFor="modulo">Módulo</label>
          <select
            id="modulo"
            name="MODULO"
            value={nuevoPermiso.MODULO}
            onChange={manejarCambio}
            required
          >
            <option value="">Seleccionar módulo</option>
            <option value="usuarios">Usuarios</option>
            <option value="reportes">Reportes</option>
            <option value="configuración">Configuración</option>
          </select>

          <div className={styles.modalButtons}>
            <button type="submit" className={styles.saveButton}>
              Guardar
            </button>
            <button type="button" className={styles.cancelButton} onClick={cerrarModal}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalAgregarPermiso;
