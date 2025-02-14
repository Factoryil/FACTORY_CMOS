import React, { useState, useEffect } from "react";
import styles from "./DocumentosLista.module.css";
import { useNavigate } from "react-router-dom";
import Tabla from "../../../components/Tabla/Tabla";
import ModalAgregarDocumentoContacto from "../../../components/ModalAgregarDocumentoContacto/ModalAgregarDocumentoContacto";

// Datos estáticos de ejemplo
const documentosEstaticos = [
  { id: 1, tipo_documento: "RUT", numero_documento: "213242342", fecha_emision: "2024-01-10", fecha_vencimiento: "", estado: "Vigente" },
  { id: 2, tipo_documento: "CERTIFICADO BANCARIO", numero_documento: "1231233321", fecha_emision: "2024-01-10", fecha_vencimiento: "", estado: "Vigente" },
  
];

const botonesAcciones = [
  { nombre: "Ver", link: "/gestion/documentos/ver/", icono: "fas fa-eye", color: "blue" }
];

function DocumentosLista() {
  const [documentos, setDocumentos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  
  useEffect(() => {
    setDocumentos(documentosEstaticos);
    setCargando(false);
  }, []);

  if (cargando) {
    return <div>Cargando documentos...</div>;
  }


  return (
    <div className={styles.documentos}>
      <h2 className={styles.titulo}>Lista de Documentos De Contactos</h2>

      {documentos.length > 0 ? (
        <Tabla
          datos={documentos}
          columnasOmitidas={["id"]}
          columnasVisibles={["tipo_documento", "numero_documento", "fecha_emision", "fecha_vencimiento","estado"]}
          mostrarAcciones={true}
          columnaAccion="ID_DOCUMENTO"
          botonesAccion={botonesAcciones}
          filasPorPagina={3}
          habilitarPaginacion={true}
          habilitarBusqueda={true}
          habilitarOrdenamiento={true}
          habilitarExportacion={true}
          nombreExcel={"datos_tabla"}
          habilitarTotalRegistros={true}
        >
          <button onClick={() => setMostrarModal(true)} className={styles.addButton2}>
            Agregar Documento
          </button>
        </Tabla>
      ) : (
        <p>No hay documentos disponibles.</p>
      )}

      {mostrarModal && (
        <ModalAgregarDocumentoContacto
          cerrarModal={() => setMostrarModal(false)}
        />
      )}
    </div>
  );
}

export default DocumentosLista;
