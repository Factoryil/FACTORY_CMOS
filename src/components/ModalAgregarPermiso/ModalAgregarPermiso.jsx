import React, { useState } from "react";
import styles from "../../styles/ModalFormulario.module.css";
import { apiManager } from "../../api/apiManager";

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
      const response = await apiManager.addPermiso(nuevoPermiso);
      console.log("Nuevo permiso agregado:", response);
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
          <label htmlFor="modulo">Módulo</label>
          <input
            type="text"
            id="modulo"
            name="MODULO"
            value={nuevoPermiso.MODULO}
            onChange={manejarCambio}
            required
          />
          
          <label htmlFor="tipo">Tipo</label>
          <input
            type="text"
            id="tipo"
            name="TIPO"
            value={nuevoPermiso.TIPO}
            onChange={manejarCambio}
            required
          />


          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            name="DESCRIPCION"
            value={nuevoPermiso.DESCRIPCION}
            onChange={manejarCambio}
            required
            className={styles.texarean1}
          />

          <div className={styles.modalButtons}>
            <button type="submit" className={styles.saveButton}>
              Guardar
            </button>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={cerrarModal}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalAgregarPermiso;
