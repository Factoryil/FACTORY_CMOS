import React, { useState, useEffect } from "react";
import styles from "../../styles/ModalFormulario.module.css";
import Loader from "../Loader/Loader";
import { apiManager } from "../../api/apiManager.js";
import ModalAgregarDocumentoContacto from "../ModalAgregarDocumentoContacto/ModalAgregarDocumentoContacto.jsx";
import ModalEditarDocumentoContacto from "../ModalEditarDocumentoContacto/ModalEditarDocumentoContacto.jsx";
import Tabla from "../Tabla/Tabla.jsx";
import { url } from '../../data/url.js';

const mapeoColumnas = {
  TIPO_DOCUMENTO: "Tipo Documento",
  FECHA_EMISION: "Fecha Emision",
  FECHA_VENCIMIENTO: "Fecha Vencimiento",
  OBSERVACION: "Observacion",
  dias_faltantes: "Dias Faltantes",
};

function DocumentosContacto({ contactoID }) {
  const [paginaActualActual, setPaginaActualActual] = useState(1);
  const [paginaHistorico, setPaginaHistorico] = useState(1);
  const [activeTab, setActiveTab] = useState("actual");
  const [documentosActuales, setDocumentosActuales] = useState([]);
  const [documentosHistoricos, setDocumentosHistoricos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [documentoEditar, setDocumentoEditar] = useState(null);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const obtenerdocumentosActuales = async () => {
    try {
      setCargando(true);
      const response = await apiManager.documentosContactoActuales(contactoID);
      console.log(response);
      
      setDocumentosActuales(Array.isArray(response) ? response : []);
      setCargando(false);
    } catch (error) {
      console.error("Error al obtener documentos actuales:", error);
      setCargando(false);
    }
  };

  const obtenerdocumentosHistorico = async () => {
    try {
      setCargando(true);
      const response = await apiManager.documentosContactoHistorico(contactoID);
      setDocumentosHistoricos(Array.isArray(response) ? response : []);
      setCargando(false);
    } catch (error) {
      console.error("Error al obtener documentos históricos:", error);
      setCargando(false);
    }
  };

  // Cargar los datos una única vez al montar el componente o al cambiar el contacto
  useEffect(() => {
    obtenerdocumentosActuales();
    obtenerdocumentosHistorico();
  }, [contactoID]);

  // Al cerrar el modal de agregar, se refrescan ambas listas de documentos
  const handleModalClose = () => {
    setMostrarModal(false);
    obtenerdocumentosActuales();
    obtenerdocumentosHistorico();
  };

  // Abre el modal para editar información del registro
  const handleEditarInfo = (documento) => {
    setDocumentoEditar(documento);
    setMostrarModalEditar(true);
  };

  // Abre PDF en una nueva pestaña (si existe)
  const handleVerPdf = (documento) => {
    if (documento.URL_SOPORTE) {
      window.open(url + "/" + documento.URL_SOPORTE, '_blank', 'noopener,noreferrer');
    } else {
      alert("No hay PDF disponible para este registro.");
    }
  };

  const botonesAcciones = [
    {
      nombre: "Ver PDF",
      icono: "fas fa-file-pdf",
      color: "blue",
      funcionAccion: (fila) => handleVerPdf(fila),
    },
    {
      nombre: "Editar",
      icono: "fas fa-edit",
      color: "blue",
      funcionAccion: (fila) => handleEditarInfo(fila),
    },
  ];

  return (
    <div className="contenedor2">
      <h3 className={styles.titulo}>Lista de Documentos</h3>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === "actual" ? styles.activeTab : ""}`}
          onClick={() => handleTabClick("actual")}
        >
          Actual
        </button>
        <button
          className={`${styles.tab} ${activeTab === "historico" ? styles.activeTab : ""}`}
          onClick={() => handleTabClick("historico")}
        >
          Histórico
        </button>
      </div>
      <div className={styles.content}>
        {activeTab === "actual" && (
          <>
            {cargando ? (
              <Loader />
            ) : documentosActuales && documentosActuales.length > 0 ? (
              <Tabla
                datos={documentosActuales}
                mapeoColumnas={mapeoColumnas}
                columnasVisibles={Object.values(mapeoColumnas)}
                habilitarExportacion={true}
                nombreExcel={"Lista_documentos_actuales"}
                filasPorPagina={5}
                incluirPaginacionEnURL={false}
                paginaActualInicial={paginaActualActual}
                onCambiarPagina={setPaginaActualActual}
                mostrarAcciones={true}
                botonesAccion={botonesAcciones}
              >
                <button onClick={() => setMostrarModal(true)} className={styles.addButton2}>
                  Agregar Documento
                </button>
              </Tabla>
            ) : (
              <div>
                <p>No hay documentos actuales.</p>
                <button onClick={() => setMostrarModal(true)} className={styles.addButton3}>
                  Agregar Documento
                </button>
              </div>
            )}
          </>
        )}

        {activeTab === "historico" && (
          <>
            {cargando ? (
              <Loader />
            ) : documentosHistoricos && documentosHistoricos.length > 0 ? (
              <Tabla
                datos={documentosHistoricos}
                mapeoColumnas={mapeoColumnas}
                columnasVisibles={Object.values(mapeoColumnas)}
                habilitarExportacion={true}
                nombreExcel={"Lista_documentos_historicos"}
                filasPorPagina={5}
                incluirPaginacionEnURL={false}
                paginaActualInicial={paginaHistorico}
                onCambiarPagina={setPaginaHistorico}
                mostrarAcciones={true}
                botonesAccion={botonesAcciones}
              />
            ) : (
              <div>
                <p>No hay documentos históricos.</p>
              </div>
            )}
          </>
        )}
      </div>

      {mostrarModal && activeTab === "actual" && (
        <ModalAgregarDocumentoContacto contactoID={contactoID} cerrarModal={handleModalClose} />
      )}

      {mostrarModalEditar && (
        <ModalEditarDocumentoContacto
          documento={documentoEditar}
          cerrarModal={() => {
            setMostrarModalEditar(false);
            setDocumentoEditar(null);
            // Refrescar listas tras editar
            obtenerdocumentosActuales();
            obtenerdocumentosHistorico();
          }}
        />
      )}
    </div>
  );
}

export default DocumentosContacto;
