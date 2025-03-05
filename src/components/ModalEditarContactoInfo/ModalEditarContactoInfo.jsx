import React, { useState } from "react";
import styles from "../../styles/ModalFormulario.module.css";
import { apiManager } from "../../api/apiManager";

function ModalEditarContactoInfo({ cerrarModal, contactData, onUpdate = () => {} }) {
  console.log(contactData);
  
  const [clicFuera, setClicFuera] = useState(false);

  const manejarMouseDown = (e) => {
    if (e.target.classList.contains(styles.modalOverlay)) {
      setClicFuera(true);
    } else {
      setClicFuera(false);
    }
  };

  const manejarMouseUp = (e) => {
    if (e.target.classList.contains(styles.modalOverlay) && clicFuera) {
      cerrarModal();
    }
  };

  const tiposIdentificacion = [
    { value: "CC", label: "Cédula" },
    { value: "NIT", label: "Número de Identificación Tributaria" },
  ];

  // Inicializamos el estado con la información actual del contacto
  const [formData, setFormData] = useState({
    NOMBRE_COMPLETO: contactData?.NOMBRE_COMPLETO || "",
    CORREO_ELECTRONICO: contactData?.CORREO_ELECTRONICO || "",
    TELEFONO: contactData?.TELEFONO || "",
    TIPO_IDENTIFICACION: contactData?.TIPO_IDENTIFICACION || "",
    NUMERO_IDENTIFICACION: contactData?.NUMERO_IDENTIFICACION || "",
    DIRECCION: contactData?.DIRECCION || "",
    UBICACION: contactData?.UBICACION || "",
  });

  const manejarCambio = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();

    // Enviar los datos como un objeto JSON
    const dataToUpdate = {
      NOMBRE_COMPLETO: formData.NOMBRE_COMPLETO,
      CORREO_ELECTRONICO: formData.CORREO_ELECTRONICO,
      TELEFONO: formData.TELEFONO,
      TIPO_IDENTIFICACION: formData.TIPO_IDENTIFICACION,
      NUMERO_IDENTIFICACION: formData.NUMERO_IDENTIFICACION,
      direccion: formData.DIRECCION,
      ubicacion: formData.UBICACION,
    };

    try {
      // Se asume que el ID del contacto se encuentra en contactData.ID_CONTACTOS
      const response = await apiManager.editContactosInfo(contactData.ID_CONTACTOS, dataToUpdate);
      console.log(response);

      // Actualizamos la información en el componente padre y cerramos el modal
      onUpdate();
      cerrarModal();
    } catch (error) {
      console.error("Error al actualizar el contacto:", error);
      // Aquí se podría mostrar un mensaje de error si se desea
    }
  };

  // Cierra el modal si se hace clic en el overlay
  const manejarCerrarModal = (e) => {
    if (e.target === e.currentTarget) {
      cerrarModal();
    }
  };

  return (
    <div
      className={styles.modalOverlay}
      onMouseDown={manejarMouseDown}
      onMouseUp={manejarMouseUp}
    >
      <div className={styles.modal}>
        <h2>Editar Contacto</h2>
        <form onSubmit={manejarEnvio}>
          <label htmlFor="NOMBRE_COMPLETO">Nombre Completo</label>
          <input
            type="text"
            id="NOMBRE_COMPLETO"
            name="NOMBRE_COMPLETO"
            value={formData.NOMBRE_COMPLETO}
            onChange={manejarCambio}
            required
          />
          <label htmlFor="CORREO_ELECTRONICO">Correo Electrónico</label>
          <input
            type="email"
            id="CORREO_ELECTRONICO"
            name="CORREO_ELECTRONICO"
            value={formData.CORREO_ELECTRONICO}
            onChange={manejarCambio}
            required
          />
          <label htmlFor="TELEFONO">Teléfono</label>
          <input
            type="text"
            id="TELEFONO"
            name="TELEFONO"
            value={formData.TELEFONO}
            onChange={manejarCambio}
            required
          />
          <label htmlFor="TIPO_IDENTIFICACION">Tipo de Identificación</label>
          <select
            id="TIPO_IDENTIFICACION"
            name="TIPO_IDENTIFICACION"
            value={formData.TIPO_IDENTIFICACION}
            onChange={manejarCambio}
            required
          >
            <option value="">Seleccione un tipo</option>
            {tiposIdentificacion.map((tipo) => (
              <option key={tipo.value} value={tipo.value}>
                {tipo.label}
              </option>
            ))}
          </select>
          <label htmlFor="NUMERO_IDENTIFICACION">Número de Identificación</label>
          <input
            type="text"
            id="NUMERO_IDENTIFICACION"
            name="NUMERO_IDENTIFICACION"
            value={formData.NUMERO_IDENTIFICACION}
            onChange={manejarCambio}
            required
          />
          <label htmlFor="DIRECCION">Dirección</label>
          <input
            type="text"
            id="DIRECCION"
            name="DIRECCION"
            value={formData.DIRECCION}
            onChange={manejarCambio}
            required
          />
          <label htmlFor="UBICACION">Ubicación</label>
          <input
            type="text"
            id="UBICACION"
            name="UBICACION"
            value={formData.UBICACION}
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

export default ModalEditarContactoInfo;
