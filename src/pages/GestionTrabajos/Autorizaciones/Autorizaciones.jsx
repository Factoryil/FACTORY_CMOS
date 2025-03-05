import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "../../../styles/ModalFormulario.module.css";
import Loader from "../../../components/Loader/Loader";
import Tabla from "../../../components/Tabla/Tabla";
import { apiManager } from "../../../api/apiManager";
import ModalAgregarOrdenTrabajo from "../../../components/ModalAgregarOrdenTrabajo/ModalAgregarOrdenTrabajo";

const mapeoColumnas = {
  ID_OT: "OT",
  ESTADO: "Estado OT",
  placa: "Placa",
  estado_vehiculo: "Estado Vehiculo",
  FECHA_ORDEN: "Fecha De Orden",
  observacion: "Observacion",
  odometro: "Odometro",
  prioridad: "Prioridad",
  cliente: "Resp. Pago",
  taller: "Taller",
  AUTORIZACION: "Autorización",
  OC: "OC",
};

const botonesAcciones = [
  {
    nombre: "Ver",
    link: "/gestion/trabajos/autorizaciones/ver/",
    icono: "fas fa-eye",
    color: "blue"
  }
];

function Autorizaciones() {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get("tab") || "actual";
  const [activeTab, setActiveTab] = useState(initialTab);

  const [paginaActualActual, setPaginaActualActual] = useState(1);
  const [paginaHistorico, setPaginaHistorico] = useState(1);

  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);

  // Estado para las estadísticas de órdenes de trabajo (nuevos campos)
  const [resumenOT, setResumenOT] = useState({
    ot_rechazadas_hoy: 0,
    ot_por_aprobar: 0,
    ot_aprobadas_hoy: 0
  });

  // Obtener resumen de órdenes de trabajo para autorizaciones
  const obtenerResumenOrdenes = async () => {
    try {
      const response = await apiManager.obtenerResumenOrdenesAutorizar();
      setResumenOT(response);
    } catch (error) {
      console.error("Error al obtener resumen de órdenes:", error);
    }
  };

  const obtenerOrdenesActuales = async () => {
    try {
      setCargando(true);
      const response = await apiManager.ordenesTrabajoActualesAutorizar();
      setOrdenes(response);
      setCargando(false);
    } catch (error) {
      console.error("Error al obtener órdenes de trabajo actuales:", error);
      setCargando(false);
    }
  };

  const obtenerOrdenesHistorico = async () => {
    try {
      setCargando(true);
      const response = await apiManager.ordenesTrabajoHistorico();
      setOrdenes(response);
      setCargando(false);
    } catch (error) {
      console.error("Error al obtener órdenes de trabajo históricas:", error);
      setCargando(false);
    }
  };

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const tabFromUrl = query.get("tab") || "actual";
    setActiveTab(tabFromUrl);
  }, [location.search]);

  useEffect(() => {
    if (activeTab === "actual") {
      obtenerOrdenesActuales();
    } else if (activeTab === "historico") {
      obtenerOrdenesHistorico();
    }
    obtenerResumenOrdenes(); // Obtener el resumen al cambiar entre tabs
  }, [activeTab]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    navigate(`?tab=${tab}`);
  };

  const handleModalClose = () => {
    setMostrarModal(false);
    if (activeTab === "actual") {
      obtenerOrdenesActuales();
      obtenerResumenOrdenes(); // Actualizar resumen cuando se agrega una OT
    }
  };

  return (
    <div className="contenedor1">

      <div className={styles.cardsContainer}>
        <div className={styles.card}>
          <i className={`${styles.icon} fas fa-times-circle`}></i>
          <h3>OT Rechazadas Hoy</h3>
          <p>{resumenOT.ot_rechazadas_hoy}</p>
        </div>
        <div className={styles.card}>
          <i className={`${styles.icon} fas fa-check-circle`}></i>
          <h3>OT Aprobadas Hoy</h3>
          <p>{resumenOT.ot_aprobadas_hoy}</p>
        </div>
        <div className={styles.card}>
          <i className={`${styles.icon} fas fa-hourglass-half`}></i>
          <h3>OT por Aprobar</h3>
          <p>{resumenOT.ot_por_aprobar}</p>
        </div>
      </div>

      <div className="contenedor2">
        <h2 className={styles.titulo}>Lista de OT por Autorizar</h2>

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
              ) : ordenes.length === 0 ? (
                <div>
                  <p>No hay órdenes de trabajo.</p>
                  <button onClick={() => setMostrarModal(true)} className={styles.addButton3}>
                    Agregar Orden de Trabajo
                  </button>
                </div>
              ) : (
                <Tabla
                  datos={ordenes}
                  mapeoColumnas={mapeoColumnas}
                  columnasVisibles={Object.values(mapeoColumnas)}
                  mostrarAcciones={true}
                  columnaAccion="OT"
                  botonesAccion={botonesAcciones}
                  habilitarExportacion={true}
                  nombreExcel={"Lista_ordenes_trabajo"}
                  filasPorPagina={5}
                  incluirPaginacionEnURL={false}
                  paginaActualInicial={paginaActualActual}
                  onCambiarPagina={setPaginaActualActual}
                >
                  <button onClick={() => setMostrarModal(true)} className={styles.addButton2}>
                    Agregar Orden de Trabajo
                  </button>
                </Tabla>
              )}
            </>
          )}

          {activeTab === "historico" && (
            <>
              {cargando ? (
                <Loader />
              ) : ordenes.length === 0 ? (
                <div>
                  <p>No hay órdenes de trabajo históricas.</p>
                </div>
              ) : (
                <Tabla
                  datos={ordenes}
                  mapeoColumnas={mapeoColumnas}
                  columnasVisibles={Object.values(mapeoColumnas)}
                  mostrarAcciones={true}
                  columnaAccion="OT"
                  botonesAccion={botonesAcciones}
                  habilitarExportacion={true}
                  nombreExcel={"Historico_ordenes_trabajo"}
                  filasPorPagina={5}
                  incluirPaginacionEnURL={false}
                  paginaActualInicial={paginaHistorico}
                  onCambiarPagina={setPaginaHistorico}
                />
              )}
            </>
          )}
        </div>

        {mostrarModal && activeTab === "actual" && (
          <ModalAgregarOrdenTrabajo cerrarModal={handleModalClose} />
        )}
      </div>
    </div>
  );
}

export default Autorizaciones;
