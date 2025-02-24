import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "../../../styles/ModalFormulario.module.css";
import Loader from "../../../components/Loader/Loader";
import Tabla from "../../../components/Tabla/Tabla";
import { apiManager } from "../../../api/apiManager";
import ModalAgregarOrdenTrabajo from "../../../components/ModalAgregarOrdenTrabajo/ModalAgregarOrdenTrabajo";

// Mapeo de claves para mostrar en la tabla (clave original → nombre deseado)
const mapeoColumnas = {
  ID_OT: "OT",
  ESTADO: "estado ot",
  placa: "placa",
  FECHA_ORDEN: "Fecha de orden",
  observacion: "observacion",
  odometro: "odometro",
  AUTORIZACION: "autorizacion",
  prioridad: "prioridad",
  ID_CLIENTE: "resp. pago",
  ID_TALLER: "Taller",
  estado_vehiculo: "estado vehiculo"
};

// Botones de acción para la tabla
const botonesAcciones = [
  {
    nombre: "Ver",
    link: "/gestion/trabajos/ordenes-trabajo/ver/",
    icono: "fas fa-eye",
    color: "blue"
  }
];

function OrdenesTrabajo() {
  const navigate = useNavigate();
  const location = useLocation();

  // Tab activo (por defecto "actual")
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get("tab") || "actual";
  const [activeTab, setActiveTab] = useState(initialTab);

  // Estados para mantener la posición (página) de cada tabla
  const [paginaActualActual, setPaginaActualActual] = useState(1);
  const [paginaHistorico, setPaginaHistorico] = useState(1);

  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);

  // Función para obtener órdenes de trabajo actuales
  const obtenerOrdenesActuales = async () => {
    try {
      setCargando(true);
      const response = await apiManager.ordenesTrabajoActuales();
      setOrdenes(response);
      setCargando(false);
    } catch (error) {
      console.error("Error al obtener órdenes de trabajo actuales:", error);
      setCargando(false);
    }
  };

  // Función para obtener órdenes de trabajo históricas
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

  // Actualizar el tab activo cuando cambia la URL
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const tabFromUrl = query.get("tab") || "actual";
    setActiveTab(tabFromUrl);
  }, [location.search]);

  // Cargar datos según el tab activo
  useEffect(() => {
    if (activeTab === "actual") {
      obtenerOrdenesActuales();
    } else if (activeTab === "historico") {
      obtenerOrdenesHistorico();
    }
  }, [activeTab]);

  // Cambiar tab y actualizar la URL
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    navigate(`?tab=${tab}`);
  };

  // Actualizar datos al cerrar el modal (solo en el tab "actual")
  const handleModalClose = () => {
    setMostrarModal(false);
    if (activeTab === "actual") {
      obtenerOrdenesActuales();
    }
  };

  return (
    <div className="contenedor1">
      <div className="contenedor2">
        <h2 className={styles.titulo}>Lista de Órdenes de Trabajo</h2>

        {/* Menú de Tabs */}
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

        {/* Área de contenido */}
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
                  columnasVisibles={[ "OT", "placa", "Fecha de orden", "observacion", "odometro", "autorizacion", "estado ot", "prioridad", "resp. pago", "taller", "estado vehiculo"]}
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
                  columnasVisibles={["OT", "placa", "Fecha de orden", "observacion", "odometro", "autorizacion", "estado ot", "prioridad", "resp. pago", "taller", "estado vehiculo"]}
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

export default OrdenesTrabajo;
