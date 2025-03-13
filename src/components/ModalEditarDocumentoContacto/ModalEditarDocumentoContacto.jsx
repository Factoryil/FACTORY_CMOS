import React, { useState, useEffect } from "react";
import styles from "../../styles/ModalFormulario.module.css";
import { apiManager } from "../../api/apiManager";

function ModalEditarDocumentoContacto({ cerrarModal, documento }) {
  console.log(documento);
  

  // Inicializamos el estado usando las claves que llegan en el objeto:
  // "Tipo Documento", "Fecha Emision", "Fecha Vencimiento", "Observacion", "Estado"
  const [datosDocumento, setDatosDocumento] = useState({
    TIPO_DOCUMENTO: documento["Tipo Documento"] || "",
    FECHA_EMISION: documento["Fecha Emision"] || "",
    FECHA_VENCIMIENTO: documento["Fecha Vencimiento"] || "",
    OBSERVACION: documento["Observacion"] || "",
    ESTADO: documento["ESTADO"] || "activo",
  });
  const [soporte, setSoporte] = useState(null);

  const handleChange = (e) => {
    setDatosDocumento({
      ...datosDocumento,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setSoporte(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Construimos el FormData con los campos necesarios, incluyendo el ID del documento a editar
    const formData = new FormData();
    formData.append("ID_CONTACTO_DOCUMENTO", documento.ID_CONTACTO_DOCUMENTO);
    formData.append("TIPO_DOCUMENTO", datosDocumento.TIPO_DOCUMENTO);
    // Se toma solo la parte de la fecha (YYYY-MM-DD)
    formData.append("FECHA_EMISION", datosDocumento.FECHA_EMISION ? datosDocumento.FECHA_EMISION.split(" ")[0] : null);
    formData.append("FECHA_VENCIMIENTO", datosDocumento.FECHA_VENCIMIENTO ? datosDocumento.FECHA_VENCIMIENTO.split(" ")[0] : null);
    formData.append("OBSERVACION", datosDocumento.OBSERVACION);
    formData.append("ESTADO", datosDocumento.ESTADO);
    if (soporte) {
      formData.append("URL_SOPORTE", soporte);
    }

    // Llamamos al método de edición del API
    await apiManager.editarDocumentoContacto(formData);
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
        <h2>Editar Documento</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="TIPO_DOCUMENTO">Tipo de Documento</label>
          <input
            type="text"
            id="TIPO_DOCUMENTO"
            name="TIPO_DOCUMENTO"
            value={datosDocumento.TIPO_DOCUMENTO}
            onChange={handleChange}
            required
          />
          <label htmlFor="FECHA_EMISION">Fecha de Emisión</label>
          <input
            type="date"
            id="FECHA_EMISION"
            name="FECHA_EMISION"
            value={datosDocumento.FECHA_EMISION ? datosDocumento.FECHA_EMISION.split(" ")[0] : ""}
            onChange={handleChange}
          />
          <label htmlFor="FECHA_VENCIMIENTO">Fecha de Vencimiento</label>
          <input
            type="date"
            id="FECHA_VENCIMIENTO"
            name="FECHA_VENCIMIENTO"
            value={datosDocumento.FECHA_VENCIMIENTO ? datosDocumento.FECHA_VENCIMIENTO.split(" ")[0] : ""}
            onChange={handleChange}
          />
          <label htmlFor="ESTADO">Estado</label>
          <select
            id="ESTADO"
            name="ESTADO"
            value={datosDocumento.ESTADO}
            onChange={handleChange}
            required
          >
            <option value="activo">Activo</option>
            <option value="renovado">Inactivo</option>
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
            value={datosDocumento.OBSERVACION}
            onChange={handleChange}
            className={styles.texarean1}
          />
          <div className={styles.modalButtons}>
            <button type="submit" className={styles.saveButton}>
              Guardar Cambios
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

export default ModalEditarDocumentoContacto;
