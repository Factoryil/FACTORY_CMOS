import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "../../../styles/ModalFormulario.module.css";
import Loader from "../../../components/Loader/Loader";
import Tabla from "../../../components/Tabla/Tabla";
import { transformarDatos } from "../../../utils/transformarDatos";
import { apiManager } from "../../../api/apiManager";
import ModalAgregarOrdenTrabajo from "../../../components/ModalAgregarOrdenTrabajo/ModalAgregarOrdenTrabajo";

// Mapeo de las claves para mostrar en la tabla
const mapeoColumnas = {
  ID_OT: "OT",
  placa: "placa",
  FECHA_ORDEN: "Fecha de orden",
  observacion: "observacion",
  odometro: "odometro",
  AUTORIZACION: "autorizacion",
  ESTADO: "estado",
  ID_CLIENTE: "resp. pago",
  ID_TALLER: "Taller",
  prioridad: "prioridad",
  // FECHA_PROGRAMADA: "cita programada"
};

const botonesAcciones = [
  { nombre: "Ver", link: "/gestion/trabajos/ordenes-trabajo/ver/", icono: "fas fa-eye", color: "blue" },
  // { nombre: "Editar", link: "/gestion/ordenes/editar/", icono: "fas fa-edit", color: "orange" }
];

function OrdenesTrabajo() {
  const navigate = useNavigate();
  const location = useLocation();

  // Determinar el tab activo desde la URL (por defecto "actual")
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get("tab") || "actual";
  const [activeTab, setActiveTab] = useState(initialTab);

  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);

  // Función para obtener órdenes de trabajo actuales
  const obtenerOrdenesActuales = async () => {
    try {
      setCargando(true);
      const response = await apiManager.ordenesTrabajoActuales();
      console.log(response);
      
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

  // Actualizar el estado del tab según la URL
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const tabFromUrl = query.get("tab") || "actual";
    setActiveTab(tabFromUrl);
  }, [location.search]);

  // Cargar datos cuando cambie el tab activo
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

  // Actualizar datos cuando se cierra el modal (solo en el tab "actual")
  const handleModalClose = () => {
    setMostrarModal(false);
    if (activeTab === "actual") {
      obtenerOrdenesActuales();
    }
  };

  return (
    <div className={styles.ordenes}>
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
      
      {/* Área de contenido: el Loader se muestra solo en esta sección */}
      <div className={styles.content}>
        {/* Contenido para el tab "Actual" */}
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
              (() => {
                const datosTransformados = transformarDatos(ordenes, mapeoColumnas);
                const columnasVisibles = Object.values(mapeoColumnas);

                return (
                  <Tabla
                    datos={datosTransformados}
                    columnasVisibles={columnasVisibles}
                    mostrarAcciones={true}
                    columnaAccion="OT"
                    botonesAccion={botonesAcciones}
                    habilitarExportacion={true}
                    nombreExcel={"Lista_ordenes_trabajo"}
                    filasPorPagina={5}
                  >
                    <button onClick={() => setMostrarModal(true)} className={styles.addButton2}>
                      Agregar Orden de Trabajo
                    </button>
                  </Tabla>
                );
              })()
            )}
          </>
        )}

        {/* Contenido para el tab "Histórico" */}
        {activeTab === "historico" && (
          <>
            {cargando ? (
              <Loader />
            ) : ordenes.length === 0 ? (
              <div>
                <p>No hay órdenes de trabajo históricas.</p>
              </div>
            ) : (
              (() => {
                const datosTransformados = transformarDatos(ordenes, mapeoColumnas);
                const columnasVisibles = Object.values(mapeoColumnas);
                
                return (
                  <Tabla
                    datos={datosTransformados}
                    columnasVisibles={columnasVisibles}
                    mostrarAcciones={true}
                    columnaAccion="OT"
                    botonesAccion={botonesAcciones}
                    habilitarExportacion={true}
                    nombreExcel={"Historico_ordenes_trabajo"}
                    filasPorPagina={5}
                  />
                );
              })()
            )}
          </>
        )}
      </div>

      {/* Modal de agregar, solo en el tab "Actual" */}
      {mostrarModal && activeTab === "actual" && (
        <ModalAgregarOrdenTrabajo cerrarModal={handleModalClose} />
      )}
    </div>
  );
}

export default OrdenesTrabajo;
