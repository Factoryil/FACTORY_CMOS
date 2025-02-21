import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "../../../styles/ModalFormulario.module.css";
import Loader from "../../../components/Loader/Loader";
import ModalAgregarOdometro from "../../../components/ModalAgregarOdometro/ModalAgregarOdometro";
import Tabla from "../../../components/Tabla/Tabla";
import { transformarDatos } from "../../../utils/transformarDatos";
import { apiManager } from "../../../api/apiManager";

// Mapeo de las claves para mostrar en la tabla
const mapeoColumnas = {
  placa: "Placa",
  LECTURA: "Lectura",
  url_imagen: "Imagen",
  FECHA_REGISTRO: "Fecha de Registro",
  km_promedio: "km diario promedio"
};

const botonesAcciones = [
  { nombre: "Ver", link: "/gestion/vehiculos/ver/", icono: "fas fa-eye", color: "blue" },
  { nombre: "Ver", link: "/gestion/vehiculos/ver/", icono: "fas fa-eye", color: "blue" },
  { nombre: "Ver", link: "/gestion/vehiculos/ver/", icono: "fas fa-eye", color: "blue" },
];

function Odometros() {
  const navigate = useNavigate();
  const location = useLocation();

  // Determinar el tab activo desde la URL (por defecto "actual")
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get("tab") || "actual";
  const [activeTab, setActiveTab] = useState(initialTab);

  const [odometros, setOdometros] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);

  // Función para obtener registros actuales (odometroUltimos)
  const obtenerOdometrosActuales = async () => {
    try {
      setCargando(true);
      const response = await apiManager.odometroUltimos();
      console.log(response);
      
      setOdometros(response);
      setCargando(false);
    } catch (error) {
      console.error("Error al obtener odómetros actuales:", error);
      setCargando(false);
    }
  };

  // Función para obtener registros históricos (odometro)
  const obtenerOdometrosHistorico = async () => {
    try {
      setCargando(true);
      const response = await apiManager.odometros();
      setOdometros(response);
      setCargando(false);
    } catch (error) {
      console.error("Error al obtener odómetros históricos:", error);
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
      obtenerOdometrosActuales();
    } else if (activeTab === "historico") {
      obtenerOdometrosHistorico();
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
      obtenerOdometrosActuales();
    }
  };

  return (
    <div className={styles.odometros}>
      <h2 className={styles.titulo}>Lista de Registros de Odómetro</h2>
      
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
            ) : odometros.length === 0 ? (
              <div>
                <p>No hay registros de odómetro.</p>
                <button onClick={() => setMostrarModal(true)} className={styles.addButton3}>
                  Agregar Registro de Odómetro
                </button>
              </div>
            ) : (
              (() => {
                const datosTransformados = transformarDatos(odometros, mapeoColumnas);
                const columnasVisibles = Object.values(mapeoColumnas);
                return (
                  <Tabla
                    datos={datosTransformados}
                    columnasVisibles={columnasVisibles}
                    mostrarAcciones={true}
                    columnaAccion="Placa"
                    botonesAccion={botonesAcciones}
                    habilitarExportacion={true}
                    nombreExcel={"Lista_odometros"}
                    filasPorPagina={5}
                  >
                    <button onClick={() => setMostrarModal(true)} className={styles.addButton2}>
                      Agregar Registro de Odómetro
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
            ) : odometros.length === 0 ? (
              <div>
                <p>No hay registros históricos de odómetro.</p>
              </div>
            ) : (
              (() => {
                const datosTransformados = transformarDatos(odometros, mapeoColumnas);
                const columnasVisibles = Object.values(mapeoColumnas);
                return (
                  <Tabla
                    datos={datosTransformados}
                    columnasVisibles={columnasVisibles}
                    mostrarAcciones={true}
                    columnaAccion="Placa"
                    botonesAccion={botonesAcciones}
                    habilitarExportacion={true}
                    nombreExcel={"Historico_odometros"}
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
        <ModalAgregarOdometro cerrarModal={handleModalClose} />
      )}
    </div>
  );
}

export default Odometros;
