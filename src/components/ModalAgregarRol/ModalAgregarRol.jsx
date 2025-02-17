import React, { useState } from "react";
import styles from "../../styles/ModalFormulario.module.css";
import { apiManager } from "../../api/apiManager";

function ModalAgregarRol({ cerrarModal }) {
  const [nuevoRol, setNuevoRol] = useState({
    NOMBRE_ROL: "",
    DESCRIPCION: "",
  });

  const manejarCambio = (e) => {
    setNuevoRol({
      ...nuevoRol,
      [e.target.name]: e.target.value,
    });
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    try {
      const response = await apiManager.addRol(nuevoRol);
      console.log("Nuevo rol agregado:", response);
      cerrarModal();
    } catch (error) {
      console.error("Error al agregar rol:", error);
    }
  };

  const manejarCerrarModal = (e) => {
    if (e.target === e.currentTarget) cerrarModal();
  };

  return (
    <div className={styles.modalOverlay} onClick={manejarCerrarModal}>
      <div className={styles.modal}>
        <h2>Agregar Nuevo Rol</h2>
        <form onSubmit={manejarEnvio}>
          <label htmlFor="nombre_rol">Nombre del Rol</label>
          <input
            type="text"
            id="nombre_rol"
            name="NOMBRE_ROL"
            value={nuevoRol.NOMBRE_ROL}
            onChange={manejarCambio}
            required
          />

          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            name="DESCRIPCION"
            value={nuevoRol.DESCRIPCION}
            onChange={manejarCambio}
            required
          />

          <div className={styles.modalButtons}>
            <button type="submit" className={styles.saveButton}>Guardar</button>
            <button type="button" className={styles.cancelButton} onClick={cerrarModal}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalAgregarRol;
