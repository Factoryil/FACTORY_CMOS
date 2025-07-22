import React, { useState, useEffect } from "react";
import styles from "./DocumentosOrdenTrabajo.module.css";
import { apiManager } from "../../api/apiManager";

function DocumentosOrdenTrabajo({ otId }) {
  const [documentos, setDocumentos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [observacion, setObservacion] = useState("");
  const [archivo, setArchivo] = useState(null);

  const tiposDocumentosDisponibles = [
    "Soporte de Diagnóstico",
    "Cotización",
    "Orden de Compra",
    "Factura",
    "Otro",
  ];

  // Cargar los documentos de la OT al montar el componente o al cambiar otId
  useEffect(() => {
    fetchDocumentos();
  }, [otId]);

  const fetchDocumentos = async () => {
    try {
      const response = await apiManager.getDocumentosOTByOT(otId);
      if (response && Array.isArray(response)) {
        setDocumentos(response);
      } else {
        setDocumentos([]);
      }
    } catch (error) {
      console.error("Error al cargar documentos:", error);
    }
  };

  const handleArchivoChange = (e) => {
    setArchivo(e.target.files[0]);
  };

  const agregarDocumento = async (e) => {
    e.preventDefault();
    if (!tipoDocumento || !archivo) {
      alert("Por favor selecciona un tipo, agrega una observación y sube el archivo.");
      return;
    }

    const formData = new FormData();
    formData.append("ID_OT", otId);
    formData.append("TIPO_DOCUMENTO", tipoDocumento);
    formData.append("OBSERVACION", observacion);
    formData.append("URL_ARCHIVO", archivo);

    try {
      const response = await apiManager.addDocumentoOT(formData);
      if (response.error) {
        alert("Error al agregar el documento: " + response.error);
        return;
      }
      // Se asume que la API retorna el nuevo documento; refrescamos la lista
      fetchDocumentos();
      // Limpiar formulario y cerrar modal
      setTipoDocumento("");
      setObservacion("");
      setArchivo(null);
      setModalVisible(false);
    } catch (error) {
      console.error("Error al agregar documento:", error);
    }
  };

  const eliminarDocumento = async (documentoId) => {
    try {
      const response = await apiManager.deleteDocumentoOT(documentoId);
      if (response.error) {
        alert("Error al eliminar el documento: " + response.error);
        return;
      }
      fetchDocumentos();
    } catch (error) {
      console.error("Error al eliminar documento:", error);
    }
  };

  const verDocumento = (urlArchivo) => {
    window.open("http://localhost/api_cmos/" + urlArchivo, "_blank");
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.titulo}>Documentos de la OT</h2>
      <button className={styles.botonAgregar} onClick={() => setModalVisible(true)}>
        ➕ Agregar Documento
      </button>

      {modalVisible && (
        <div
          className={styles.modalOverlay}
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalVisible(false);
          }}
        >
          <div className={styles.modal}>
            <h2>Agregar Documento</h2>
            <form onSubmit={agregarDocumento}>
              <label htmlFor="tipoDocumento">Tipo de Documento:</label>
              <select
                id="tipoDocumento"
                value={tipoDocumento}
                onChange={(e) => setTipoDocumento(e.target.value)}
                required
              >
                <option value="">Selecciona un tipo</option>
                {tiposDocumentosDisponibles.map((tipo, index) => (
                  <option key={index} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>

              <label htmlFor="observacion">Observación:</label>
              <input
                type="text"
                id="observacion"
                value={observacion}
                onChange={(e) => setObservacion(e.target.value)}
                placeholder="Agrega una observación"
              />

              <label htmlFor="archivo">Archivo:</label>
              <input
                type="file"
                id="archivo"
                onChange={handleArchivoChange}
                required
              />

              <div className={styles.modalButtons}>
                <button type="submit" className={styles.saveButton}>
                  ➕ Agregar Documento
                </button>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setModalVisible(false)}
                >
                  ❌ Cerrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {documentos.length > 0 ? (
        <table className={styles.tabla}>
          <thead>
            <tr>
              <th>#</th>
              <th>Documento</th>
              <th>Observación</th>
              <th>Tipo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {documentos.map((doc, index) => (
              <tr key={doc.ID_DOCUMENTO || index}>
                <td>{index + 1}</td>
                <td>{doc.TIPO_DOCUMENTO}</td>
                <td>{doc.OBSERVACION}</td>
                <td>{doc.URL_ARCHIVO.split('.').pop()}</td>
                <td>
                  <button className={styles.verBtn} onClick={() => verDocumento(doc.URL_ARCHIVO)}>
                    👁 Ver
                  </button>
                  <button className={styles.eliminarBtn} onClick={() => eliminarDocumento(doc.ID_DOCUMENTO)}>
                    🗑 Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay documentos registrados para esta OT.</p>
      )}
    </div>
  );
}

export default DocumentosOrdenTrabajo;
