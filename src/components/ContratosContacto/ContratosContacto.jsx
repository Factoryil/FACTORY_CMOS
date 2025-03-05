import React, { useState, useEffect } from 'react';
import styles from '../../styles/ModalFormulario.module.css';
import { apiManager } from '../../api/apiManager';
import Loader from '../Loader/Loader';
import ModalEditarContrato from '../ModalEditarContrato/ModalEditarContrato';
import ModalAgregarContrato from '../ModalAgregarContrato/ModalAgregarContrato';
import { url } from '../../data/url';
import Tabla from '../Tabla/Tabla';

// Mapeo de columnas para los contratos
const mapeoColumnasContrato = {
  NUMERO_CONTRATO: "Contrato",
  SUBDIVICION: "Subdivision",
  OBSERVACION: "Obervacion",
  FECHA_EMISION: "Fecha de Inicio",
  FECHA_VENCIMIENTO: "Fecha de Finalización",
};


const ContratosContacto = ({ id }) => {
  const [activeTab, setActiveTab] = useState("actual");
  const [contratosActuales, setContratosActuales] = useState([]);
  const [contratosHistoricos, setContratosHistoricos] = useState([]);
  const [paginaActualActual, setPaginaActualActual] = useState(1);
  const [paginaHistorico, setPaginaHistorico] = useState(1);
  const [loading, setLoading] = useState(false);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [mostrarModalAgregar, setMostrarModalAgregar] = useState(false);
  const [contratoSeleccionado, setContratoSeleccionado] = useState(null);

  const handleTabClick = (tab) => setActiveTab(tab);

  // Obtener contratos actuales
  const obtenerContratosActuales = async () => {
    try {
      setLoading(true);
      const response = await apiManager.getContratosActualesID(id);
      console.log(response);
      
      setContratosActuales(Array.isArray(response) ? response : []);
      
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener contratos actuales:", error);
      setLoading(false);
    }
  };

  // Obtener contratos históricos
  const obtenerContratosHistoricos = async () => {
    try {
      setLoading(true);
      const response = await apiManager.getContratosHistoricosID(id);
      setContratosHistoricos(Array.isArray(response) ? response : []);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener contratos históricos:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerContratosActuales();
    obtenerContratosHistoricos();
  }, [id]);

  const handleUpdate = () => {
    obtenerContratosActuales();
    obtenerContratosHistoricos();
  };

  const handleVerPdf = (contrato) => {
    if (contrato.URL_CONTRATO) {
      window.open(url + "/" + contrato.URL_CONTRATO, '_blank', 'noopener,noreferrer');
    } else {
      alert("No hay PDF disponible para este registro.");
    }
  };

  const handleEditar = (contrato) => {    
    setContratoSeleccionado(contrato);
    setMostrarModalEditar(true);
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
      funcionAccion: (fila) => handleEditar(fila),
    },
  ];

  return (
    <div className={styles.contenedor2}>
      <h3 className={styles.titulo}>Contratos</h3>
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
            {loading ? (
              <Loader />
            ) : contratosActuales.length > 0 ? (
              <Tabla
                datos={contratosActuales}
                mapeoColumnas={mapeoColumnasContrato}
                columnasVisibles={Object.values(mapeoColumnasContrato)}
                habilitarExportacion={true}
                nombreExcel={"Contratos_Actuales"}
                filasPorPagina={5}
                incluirPaginacionEnURL={false}
                paginaActualInicial={paginaActualActual}
                onCambiarPagina={setPaginaActualActual}
                mostrarAcciones={true}
                botonesAccion={botonesAcciones}
              >
                <button className={styles.addButton2} onClick={() => setMostrarModalAgregar(true)}>
                  Agregar Contrato
                </button>
              </Tabla>
            ) : (
              <div>
                <p>No hay contratos actuales.</p>
                <button className={styles.addButton3} onClick={() => setMostrarModalAgregar(true)}>
                  Agregar Contrato
                </button>
              </div>
            )}
          </>
        )}

        {activeTab === "historico" && (
          <>
            {loading ? (
              <Loader />
            ) : contratosHistoricos.length > 0 ? (
              <Tabla
                datos={contratosHistoricos}
                mapeoColumnas={mapeoColumnasContrato}
                columnasVisibles={Object.values(mapeoColumnasContrato)}
                habilitarExportacion={true}
                nombreExcel={"Contratos_Historicos"}
                filasPorPagina={5}
                incluirPaginacionEnURL={false}
                paginaActualInicial={paginaHistorico}
                onCambiarPagina={setPaginaHistorico}
                mostrarAcciones={true}
                botonesAccion={botonesAcciones}
              />
            ) : (
              <div>
                <p>No hay contratos históricos.</p>
              </div>
            )}
          </>
        )}
      </div>

    {mostrarModalEditar && contratoSeleccionado && (
      <ModalEditarContrato
        cerrarModal={() => {
          setMostrarModalEditar(false);
          setContratoSeleccionado(null);
        }}
        contratoData={contratoSeleccionado}
        handleUpdate={handleUpdate}  // Se pasa la función aquí
      />
    )}
    

      {mostrarModalAgregar && (
        <ModalAgregarContrato
          cerrarModal={() => {
            setMostrarModalAgregar(false);
            handleUpdate();
          }}
          contactoID={id} 
        />
      )}
    </div>
  );
};

export default ContratosContacto;
