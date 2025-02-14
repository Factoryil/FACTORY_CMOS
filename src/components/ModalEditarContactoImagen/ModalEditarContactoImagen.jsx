import React, { useState } from "react";
import styles from "../../styles/ModalFormulario.module.css";
import { apiManager } from "../../api/apiManager";

function ModalEditarContactoImagen({ cerrarModal, contactId, onUpdate = () => {} }) {
  const [imagen, setImagen] = useState(null);

  const manejarCambioImagen = (e) => {
    setImagen(e.target.files[0]);
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
  
    if (!imagen) {
      alert("Por favor, selecciona una imagen.");
      return;
    }
  
    const formData = new FormData();
    formData.append("URL_IMAGEN", imagen);
  
    try {
      const response = await apiManager.editContactosImagen(contactId, formData);
  
      console.log("Imagen actualizada con éxito:", response);
  
      // Llamar a onUpdate después de actualizar la imagen
      onUpdate();
  
      // Cerrar el modal
      cerrarModal();
    } catch (error) {
      console.error("Error al actualizar la imagen:", error);
    }
  };
  
  

  // Cerrar el modal al hacer clic en el overlay (si se clickea fuera del modal)
  const manejarCerrarModal = (e) => {
    if (e.target === e.currentTarget) {
      cerrarModal();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={manejarCerrarModal}>
      <div className={styles.modal}>
        <h2>Editar Imagen Contacto</h2>
        <form onSubmit={manejarEnvio}>
          <label htmlFor="URL_IMAGEN">Imagen</label>
          <input
            type="file"
            id="URL_IMAGEN"
            name="URL_IMAGEN"
            accept="image/*" // Aceptar solo imágenes
            onChange={manejarCambioImagen}
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

export default ModalEditarContactoImagen;
