import React, { useState } from "react";
import styles from "../../styles/ModalFormulario.module.css";
import { apiManager } from "../../api/apiManager";

function ModalAgregarEtiqueta({ cerrarModal }) {
  const [nuevaEtiqueta, setNuevaEtiqueta] = useState({
    nombre: "",
    descripcion: "",
  });

  const manejarCambio = (e) => {
    setNuevaEtiqueta({
      ...nuevaEtiqueta,
      [e.target.name]: e.target.value,
    });
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();

    try {
      const response = await apiManager.addEtiqueta(nuevaEtiqueta);
      console.log("Nueva etiqueta agregada:", response);
      cerrarModal();
    } catch (error) {
      console.error("Error al agregar etiqueta:", error);
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
        <h2>Agregar Nueva Etiqueta</h2>
        <form onSubmit={manejarEnvio}>
          <label htmlFor="nombre">Nombre</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={nuevaEtiqueta.nombre}
            onChange={manejarCambio}
            required
          />

          <label htmlFor="descripcion">Descripción</label>
          <input
            type="text"
            id="descripcion"
            name="descripcion"
            value={nuevaEtiqueta.descripcion}
            onChange={manejarCambio}
            required
          />

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

export default ModalAgregarEtiqueta;
