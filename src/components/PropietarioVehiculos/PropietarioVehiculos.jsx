import React, { useState, useEffect } from "react";
import styles from "../../styles/ModalFormulario.module.css";
import Loader from "../Loader/Loader";
import ModalEditarPropietarioVehiculo from "../ModalEditarPropietarioVehiculo/ModalEditarPropietarioVehiculo";
import ModalAgregarPropietario from "../ModalAgregarPropietario/ModalAgregarPropietario";
import Tabla from "../Tabla/Tabla";
import { apiManager } from "../../api/apiManager";
import { url } from "../../data/url";

// Mapeo de columnas para la tabla de propietarios
const mapeoColumnas = {
  placa: "Placa",
  PERIODO: "Periodo",
  VALOR: "Valor",
  FECHA_EMISION: "Fecha Emision",
  FECHA_VENCIMIENTO: "Fecha Vencimiento",
  dias_faltantes: "Dias Faltantes",
};

const PropietarioVehiculos = ({ id }) => {
  // Estados para pestañas y paginación
  const [activeTab, setActiveTab] = useState("actual");
  const [paginaActualActual, setPaginaActualActual] = useState(1);
  const [paginaHistorico, setPaginaHistorico] = useState(1);

  // Estados para almacenar datos
  const [propietariosActuales, setPropietariosActuales] = useState([]);
  const [propietariosHistoricos, setPropietariosHistoricos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Estados para modales
  const [mostrarModalEditarInfo, setMostrarModalEditarInfo] = useState(false);
  const [mostrarModalAgregar, setMostrarModalAgregar] = useState(false);
  const [propietarioSeleccionado, setPropietarioSeleccionado] = useState(null);

  // Cambio de pestaña
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // Obtener propietarios actuales
  const obtenerPropietariosActuales = async () => {
    try {
      setLoading(true);
      const response = await apiManager.getPropietariosActualesID(id);
      setPropietariosActuales(Array.isArray(response) ? response : []);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener propietarios actuales:", error);
      setLoading(false);
    }
  };

  // Obtener propietarios históricos
  const obtenerPropietariosHistoricos = async () => {
    try {
      setLoading(true);
      const response = await apiManager.getPropietariosHistoricosID(id);
      setPropietariosHistoricos(Array.isArray(response) ? response : []);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener propietarios históricos:", error);
      setLoading(false);
    }
  };

  // Cargar datos al montar o al cambiar el id del vehículo
  useEffect(() => {
    obtenerPropietariosActuales();
    obtenerPropietariosHistoricos();
  }, [id]);

  // Función para refrescar ambas listas (por ejemplo, tras editar o agregar)
  const handleUpdate = () => {
    obtenerPropietariosActuales();
    obtenerPropietariosHistoricos();
  };

  // Funciones para las acciones en la tabla
  const handleEditarInfo = (propietario) => {
    setPropietarioSeleccionado(propietario);
    setMostrarModalEditarInfo(true);
  };

  const handleVerPdf = (propietario) => {
    if (propietario.URL_PDF) {
      window.open(url + "/" + propietario.URL_PDF, "_blank", "noopener,noreferrer");
    } else {
      alert("No hay PDF disponible para este registro.");
    }
  };

  const handleVerVehiculo = (propietario) => {
    if (propietario.placa) {
      window.open("/gestion/vehiculos/ver/" + propietario.placa, "_blank", "noopener,noreferrer");
    } else {
      alert("No se encontró vehículo.");
    }
  };

  const botonesAcciones = [
    {
      nombre: "Ver Vehículo",
      icono: "fas fa-car",
      color: "blue",
      funcionAccion: (fila) => handleVerVehiculo(fila),
    },
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
    <div className={styles.contenedor2}>
      <h3 className={styles.titulo}>Propietarios</h3>
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
        )}

        {activeTab === "historico" && (
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
            setPropietarioSeleccionado(null);
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

export default PropietarioVehiculos;
