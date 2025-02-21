import React, { useState } from "react";
import styles from "../../styles/ModalFormulario.module.css";
import { apiManager } from "../../api/apiManager";

function ModalAgregarPlanMantenimiento({ cerrarModal, onUpdate }) {
  // Inicializamos el estado con las claves que coinciden exactamente con los nombres de columna de la tabla
  const [nuevoRegistro, setNuevoRegistro] = useState({
    nombre_rutina: "",
    comentario: "",
    autor: "",
    fecha_registro: "",
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
    const formData = new FormData();
    // Agregamos cada campo utilizando los mismos nombres definidos en la tabla
    formData.append("nombre_rutina", nuevoRegistro.nombre_rutina);
    formData.append("comentario", nuevoRegistro.comentario);
    formData.append("autor", nuevoRegistro.autor);
    formData.append("fecha_registro", nuevoRegistro.fecha_registro);

    try {
      const response = await apiManager.addPlanMantenimiento(formData);
      console.log("Plan de mantenimiento agregado:", response);
      cerrarModal();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error al agregar plan de mantenimiento:", error);
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
        <h2>Agregar Plan de Mantenimiento</h2>
        <form onSubmit={manejarEnvio}>
          <label htmlFor="nombre_rutina">Nombre de la Rutina</label>
          <input
            type="text"
            id="nombre_rutina"
            name="nombre_rutina"
            value={nuevoRegistro.nombre_rutina}
            onChange={manejarCambio}
            required
          />

          <label htmlFor="comentario">Comentario</label>
          <textarea
            id="comentario"
            name="comentario"
            value={nuevoRegistro.comentario}
            onChange={manejarCambio}
            className={styles.texarean1}
          ></textarea>

          <label htmlFor="autor">Autor</label>
          <input
            type="text"
            id="autor"
            name="autor"
            value={nuevoRegistro.autor}
            onChange={manejarCambio}
            required
          />

          <label htmlFor="fecha_registro">Fecha de Registro</label>
          <input
            type="date"
            id="fecha_registro"
            name="fecha_registro"
            value={nuevoRegistro.fecha_registro}
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

export default ModalAgregarPlanMantenimiento;
