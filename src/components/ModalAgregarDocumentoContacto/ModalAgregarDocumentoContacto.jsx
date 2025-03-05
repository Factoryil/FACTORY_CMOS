import React, { useState } from "react";
import styles from "../../styles/ModalFormulario.module.css";
import { apiManager } from "../../api/apiManager";

function ModalAgregarDocumentoContacto({ cerrarModal, contactoID }) {
  const [nuevoDocumento, setNuevoDocumento] = useState({
    TIPO_DOCUMENTO: "",
    FECHA_EMISION: "",
    FECHA_VENCIMIENTO: "",
    OBSERVACION: "",
    ESTADO: "activo", 
  });
  const [soporte, setSoporte] = useState(null);

  const handleChange = (e) => {
    setNuevoDocumento({
      ...nuevoDocumento,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setSoporte(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      TIPO_DOCUMENTO: nuevoDocumento.TIPO_DOCUMENTO,
      FECHA_EMISION: nuevoDocumento.FECHA_EMISION || null,
      FECHA_VENCIMIENTO: nuevoDocumento.FECHA_VENCIMIENTO || null,
      OBSERVACION: nuevoDocumento.OBSERVACION,
      ESTADO: nuevoDocumento.ESTADO,
    };

    // Construimos el FormData con los campos necesarios
    const formData = new FormData();
    formData.append("ID_CONTACTOS", contactoID);
    formData.append("TIPO_DOCUMENTO", data.TIPO_DOCUMENTO);
    formData.append("FECHA_EMISION", data.FECHA_EMISION);
    formData.append("FECHA_VENCIMIENTO", data.FECHA_VENCIMIENTO);
    formData.append("OBSERVACION", data.OBSERVACION);
    formData.append("ESTADO", data.ESTADO);
    if (soporte) {
      formData.append("URL_SOPORTE", soporte);
    }

    // Enviamos los datos a través del API
    await apiManager.addDocumentoContacto(formData);
    cerrarModal();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      cerrarModal();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <h2>Agregar Nuevo Documento</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="TIPO_DOCUMENTO">Tipo de Documento</label>
          <input
            type="text"
            id="TIPO_DOCUMENTO"
            name="TIPO_DOCUMENTO"
            value={nuevoDocumento.TIPO_DOCUMENTO}
            onChange={handleChange}
            required
          />
          <label htmlFor="FECHA_EMISION">Fecha de Emisión</label>
          <input
            type="date"
            id="FECHA_EMISION"
            name="FECHA_EMISION"
            value={nuevoDocumento.FECHA_EMISION}
            onChange={handleChange}
          />
          <label htmlFor="FECHA_VENCIMIENTO">Fecha de Vencimiento</label>
          <input
            type="date"
            id="FECHA_VENCIMIENTO"
            name="FECHA_VENCIMIENTO"
            value={nuevoDocumento.FECHA_VENCIMIENTO}
            onChange={handleChange}
          />
          <label htmlFor="ESTADO">Estado</label>
          <select
            id="ESTADO"
            name="ESTADO"
            value={nuevoDocumento.ESTADO}
            onChange={handleChange}
            required
          >
            <option value="activo">Activo</option>
            <option value="renovado">Renovado</option>
          </select>
          <label htmlFor="URL_SOPORTE">Documento (opcional)</label>
          <input
            type="file"
            id="URL_SOPORTE"
            name="URL_SOPORTE"
            onChange={handleFileChange}
          />
          <label htmlFor="OBSERVACION">Observación</label>
          <textarea
            id="OBSERVACION"
            name="OBSERVACION"
            value={nuevoDocumento.OBSERVACION}
            onChange={handleChange}
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

export default ModalAgregarDocumentoContacto;
