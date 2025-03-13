import React, { useState, useEffect } from 'react';
import styles from '../../styles/ModalFormulario.module.css';
import { apiManager } from '../../api/apiManager';
import Loader from '../Loader/Loader';
import ModalEditarPropietarioVehiculo from '../ModalEditarPropietarioVehiculo/ModalEditarPropietarioVehiculo';
import ModalAgregarPropietario from '../ModalAgregarPropietario/ModalAgregarPropietario';
import { url } from '../../data/url';
import Tabla from '../Tabla/Tabla';

const mapeoColumnas = {
  NOMBRE_COMPLETO: "Nombre Completo",
  ESTADO: "Estado",
  FECHA_EMISION: "Fecha Emision",
  FECHA_VENCIMIENTO: "Fecha Vencimiento",
  PERIODO: "Período",
  VALOR: "Valor"
};

const Propietario = ({ id }) => {
  const [activeTab, setActiveTab] = useState("actual");
  const [propietariosActuales, setPropietariosActuales] = useState([]);
  const [propietariosHistoricos, setPropietariosHistoricos] = useState([]);
  const [paginaActualActual, setPaginaActualActual] = useState(1);
  const [paginaHistorico, setPaginaHistorico] = useState(1);
  const [loading, setLoading] = useState(false);
  const [mostrarModalEditarInfo, setMostrarModalEditarInfo] = useState(false);
  const [mostrarModalAgregar, setMostrarModalAgregar] = useState(false);
  const [propietarioSeleccionado, setPropietarioSeleccionado] = useState(null);

  const handleTabClick = (tab) => setActiveTab(tab);

  const obtenerPropietariosActuales = async () => {
    try {
      setLoading(true);
      const response = await apiManager.getPropietariosVehiculo(id);
      setPropietariosActuales(Array.isArray(response) ? response : []);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener propietarios actuales:", error);
      setLoading(false);
    }
  };

  const obtenerPropietariosHistoricos = async () => {
    try {
      setLoading(true);
      const response = await apiManager.getPropietariosVehiculo(id);
      setPropietariosHistoricos(Array.isArray(response) ? response : []);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener propietarios históricos:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerPropietariosActuales();
    obtenerPropietariosHistoricos();
  }, [id]);

  const handleUpdate = () => {
    obtenerPropietariosActuales();
    obtenerPropietariosHistoricos();
  };

  const handleVerPdf = (propietario) => {
    if (propietario.URL_PDF) {
      window.open(url + "/" + propietario.URL_PDF, '_blank', 'noopener,noreferrer');
    } else {
      alert("No hay PDF disponible para este registro.");
    }
  };

  const handleVerContacto = (propietario) => {
    if (propietario.ID_CONTACTOS) {
      window.open("/gestion/contactos/ver/" + propietario.ID_CONTACTOS, '_blank', 'noopener,noreferrer');
    } else {
      alert("No se encontró contacto.");
    }
  };

  const handleEditarInfo = (propietario) => {
    setPropietarioSeleccionado(propietario);
    setMostrarModalEditarInfo(true);
  };

  const botonesAcciones = [
    {
      nombre: "Ver Contacto",
      icono: "fas fa-eye",
      color: "blue",
      funcionAccion: (fila) => handleVerContacto(fila),
    },
    {
      nombre: "Ver PDF",
      icono: "fas fa-eye",
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
    <div className={styles.propietariosContainer}>
      <h3 className={styles.titulo}>Propietarios</h3>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === "actual" ? styles.activeTab : ""}`}
          onClick={() => handleTabClick("actual")}
        >
          Actuales
        </button>
        <button
          className={`${styles.tab} ${activeTab === "historico" ? styles.activeTab : ""}`}
          onClick={() => handleTabClick("historico")}
        >
          Históricos
        </button>
      </div>
      <div className={styles.content}>
        {activeTab === "actual" ? (
          <>
            {loading ? (
              <Loader />
            ) : propietariosActuales.length > 0 ? (
              <Tabla
                datos={propietariosActuales}
                mapeoColumnas={mapeoColumnas}
                columnasVisibles={Object.values(mapeoColumnas)}
                habilitarExportacion={true}
                nombreExcel={"Propietarios_Actuales"}
                filasPorPagina={5}
                incluirPaginacionEnURL={false}
                paginaActualInicial={paginaActualActual}
                onCambiarPagina={setPaginaActualActual}
                mostrarAcciones={true}
                botonesAccion={botonesAcciones}
              >
                <button className={styles.addButton2} onClick={() => setMostrarModalAgregar(true)}>
                  Agregar Propietario
                </button>
              </Tabla>
            ) : (
              <div>
                <p>No hay propietarios actuales.</p>
                <button className={styles.addButton3} onClick={() => setMostrarModalAgregar(true)}>
                  Agregar Propietario
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            {loading ? (
              <Loader />
            ) : propietariosHistoricos.length > 0 ? (
              <Tabla
                datos={propietariosHistoricos}
                mapeoColumnas={mapeoColumnas}
                columnasVisibles={Object.values(mapeoColumnas)}
                habilitarExportacion={true}
                nombreExcel={"Propietarios_Historicos"}
                filasPorPagina={5}
                incluirPaginacionEnURL={false}
                paginaActualInicial={paginaHistorico}
                onCambiarPagina={setPaginaHistorico}
                mostrarAcciones={true}
                botonesAccion={botonesAcciones}
              />
            ) : (
              <div>
                <p>No hay propietarios históricos.</p>
              </div>
            )}
          </>
        )}
      </div>

      {mostrarModalEditarInfo && propietarioSeleccionado && (
        <ModalEditarPropietarioVehiculo
          cerrarModal={() => {
            setMostrarModalEditarInfo(false);
            handleUpdate();
          }}
          propietarioData={propietarioSeleccionado}
        />
      )}

      {mostrarModalAgregar && (
        <ModalAgregarPropietario
          cerrarModal={() => {
            setMostrarModalAgregar(false);
            handleUpdate();
          }}
          vehiculoId={id}
        />
      )}
    </div>
  );
};

export default Propietario;
