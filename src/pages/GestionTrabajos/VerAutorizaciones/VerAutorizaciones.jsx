import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import styles from "./VerAutorizaciones.module.css";
import ComentariosOrdenTrabajo from "../../../components/ComentariosOrdenTrabajo/ComentariosOrdenTrabajo";
import { apiManager } from "../../../api/apiManager";
import DatosTaller from "../../../components/DatosTaller/DatosTaller";
import TrabajosSinEdicion from "../../../components/TrabajosSinEdicion/TrabajosSinEdicion";
import SoportesOrtdenTrabajoSinEdicion from "../../../components/SoportesOrtdenTrabajoSinEdicion/SoportesOrtdenTrabajoSinEdicion";
import DocumentosOrdenTrabajoSinEdicion from "../../../components/DocumentosOrdenTrabajoSinEdicion/DocumentosOrdenTrabajoSinEdicion";
import OrdentrabajoInfoAutorizacion from "../../../components/OrdentrabajoInfoAutorizacion/OrdentrabajoInfoAutorizacion";

function VerAutorizaciones() {
  const { OT } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const paramsTab = new URLSearchParams(location.search).get("tab") || "Trabajos";
  const [activeTab, setActiveTab] = useState(paramsTab);
  const [ordenData, setOrdenData] = useState(null);
  const [loadingData, setLoadingData] = useState(true);

  // Función para obtener los datos de la OT
  const fetchOrdenTrabajo = useCallback(async () => {
    try {
      setLoadingData(true);
      const response = await apiManager.ordenTrabajoID(OT);
      setOrdenData(response);
      setLoadingData(false);
    } catch (error) {
      console.error("Error al obtener la orden de trabajo:", error);
      setLoadingData(false);
    }
  }, [OT]);

  useEffect(() => {
    fetchOrdenTrabajo();
  }, [fetchOrdenTrabajo]);

  const changeTab = (tab) => {
    setActiveTab(tab);
    navigate(`?tab=${tab}`);
  };

  useEffect(() => {
    setActiveTab(paramsTab);
  }, [location.search, paramsTab]);

  return (
    <div className={styles.contenedor}>
      {/* Se pasa la función onUpdate al componente hijo */}
      {ordenData ? (
        <OrdentrabajoInfoAutorizacion data={ordenData} onUpdate={fetchOrdenTrabajo} />
      ) : (
        <div>Cargando datos...</div>
      )}

      <div className={styles.tabs}>
        <button
          onClick={() => changeTab("Trabajos")}
          className={`${styles.tab} ${activeTab === "Trabajos" ? styles.active : ""}`}
        >
          <i className="fas fa-tasks"></i> Trabajos
        </button>
        <button
          onClick={() => changeTab("Soportes")}
          className={`${styles.tab} ${activeTab === "Soportes" ? styles.active : ""}`}
        >
          <i className="fas fa-life-ring"></i> Soportes
        </button>
        <button
          onClick={() => changeTab("Comentarios")}
          className={`${styles.tab} ${activeTab === "Comentarios" ? styles.active : ""}`}
        >
          <i className="fas fa-comment"></i> Comentarios
        </button>
        <button
          onClick={() => changeTab("Taller")}
          className={`${styles.tab} ${activeTab === "Taller" ? styles.active : ""}`}
        >
          <i className="fas fa-comment"></i> Taller
        </button>
      </div>

      {activeTab === "Trabajos" &&
        (ordenData ? (
          <TrabajosSinEdicion ot={OT} placa={ordenData.placa} />
        ) : (
          <div>Cargando datos...</div>
        ))}

      {activeTab === "Soportes" && (
        <div className={styles.contenedorSoportes}>
          <DocumentosOrdenTrabajoSinEdicion otId={OT} />
          <SoportesOrtdenTrabajoSinEdicion OT={OT} />
        </div>
      )}
      {activeTab === "Comentarios" && <ComentariosOrdenTrabajo OT={OT} />}
      {activeTab === "Taller" && <DatosTaller />}
    </div>
  );
}

export default VerAutorizaciones;
