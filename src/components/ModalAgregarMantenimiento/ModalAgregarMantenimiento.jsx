import React, { useState } from "react";
import styles from "../../styles/ModalFormulario.module.css";
import { apiManager } from "../../api/apiManager";

function ModalAgregarMantenimiento({ cerrarModal, onUpdate }) {
  // Inicializamos el estado con las claves que coinciden con los nombres de columna de la tabla "mantenimiento"
  const [nuevoRegistro, setNuevoRegistro] = useState({
    trabajo: "",
    tipo_mantenimiento: "",
  });

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setNuevoRegistro((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    // Usamos FormData para mantener el formato del ejemplo, aunque para este caso se podría enviar JSON
    const formData = new FormData();
    formData.append("trabajo", nuevoRegistro.trabajo);
    formData.append("tipo_mantenimiento", nuevoRegistro.tipo_mantenimiento);

    try {
      const response = await apiManager.addMantenimiento(formData);
      console.log("Nuevo mantenimiento agregado:", response);
      cerrarModal();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error al agregar mantenimiento:", error);
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
        <h2>Agregar Mantenimiento</h2>
        <form onSubmit={manejarEnvio}>
          <label htmlFor="trabajo">Trabajo</label>
          <input
            type="text"
            id="trabajo"
            name="trabajo"
            value={nuevoRegistro.trabajo}
            onChange={manejarCambio}
            required
          />

          <label htmlFor="tipo_mantenimiento">Tipo de Mantenimiento</label>
          <input
            type="text"
            id="tipo_mantenimiento"
            name="tipo_mantenimiento"
            value={nuevoRegistro.tipo_mantenimiento}
            onChange={manejarCambio}
            required
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

export default ModalAgregarMantenimiento;
