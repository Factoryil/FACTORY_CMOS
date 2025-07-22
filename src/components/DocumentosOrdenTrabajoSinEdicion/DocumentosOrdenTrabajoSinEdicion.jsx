import React, { useState, useEffect } from "react"; 
import styles from "./DocumentosOrdenTrabajoSinEdicion.module.css";
import { apiManager } from "../../api/apiManager";

function DocumentosOrdenTrabajoSinEdicion({ otId }) {
  const [documentos, setDocumentos] = useState([]);

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

  const verDocumento = (urlArchivo) => {
    window.open("http://localhost/api_cmos/" + urlArchivo, "_blank");
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.titulo}>Documentos de la OT</h2>
      
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
                  <button 
                    className={styles.verBtn} 
                    onClick={() => verDocumento(doc.URL_ARCHIVO)}
                  >
                    👁 Ver
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

export default DocumentosOrdenTrabajoSinEdicion;
