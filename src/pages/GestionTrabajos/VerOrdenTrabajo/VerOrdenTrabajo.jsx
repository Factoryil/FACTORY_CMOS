import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import styles from "./VerOrdenTrabajo.module.css";
import OrdentrabajoInfo from "../../../components/OrdentrabajoInfo/OrdentrabajoInfo";
import Trabajos from "../../../components/Trabajos/Trabajos";
import SoportesOrtdenTrabajo from "../../../components/SoportesOrtdenTrabajo/SoportesOrtdenTrabajo";
import ComentariosOrdenTrabajo from "../../../components/ComentariosOrdenTrabajo/ComentariosOrdenTrabajo";
import EncabezadoFactura from "../../../components/EncabezadoFactura/EncabezadoFactura";
import DocumentosOrdenTrabajo from "../../../components/DocumentosOrdenTrabajo/DocumentosOrdenTrabajo";
import Estados from "../../../components/Estados/Estados";
import { apiManager } from "../../../api/apiManager";

function VerOrdenTrabajo() {
  const { OT } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const paramsTab = new URLSearchParams(location.search).get("tab") || "Trabajos";
  const [activeTab, setActiveTab] = useState(paramsTab);
  const [ordenData, setOrdenData] = useState(null);
  const [loadingData, setLoadingData] = useState(true);

  // Definir la función fetchOrdenTrabajo para obtener los datos de la OT
  const fetchOrdenTrabajo = useCallback(async () => {
    try {
      setLoadingData(true);
      const response = await apiManager.ordenTrabajoID(OT);
      console.log(response);
      setOrdenData(response);
      setLoadingData(false);
    } catch (error) {
      console.error("Error al obtener la orden de trabajo:", error);
      setLoadingData(false);
    }
  }, [OT]);

  // Llamar a fetchOrdenTrabajo en el montaje y cuando OT cambie
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
      {/* Se pasa la data ya obtenida a OrdentrabajoInfo */}
      <OrdentrabajoInfo data={ordenData} OT={OT} />

      <div className={styles.tabs}>
        <button
          onClick={() => changeTab("Trabajos")}
          className={`${styles.tab} ${activeTab === "Trabajos" ? styles.active : ""}`}
        >
          <i className="fas fa-tasks"></i> Trabajos
        </button>
        <button
          onClick={() => changeTab("Prestador")}
          className={`${styles.tab} ${activeTab === "Prestador" ? styles.active : ""}`}
        >
          <i className="fas fa-file-alt"></i> Prestador
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
          onClick={() => changeTab("Estado")}
          className={`${styles.tab} ${activeTab === "Estado" ? styles.active : ""}`}
        >
          <i className="fas fa-cog"></i> Estados
        </button>
      </div>

      {activeTab === "Trabajos" &&
        (ordenData ? (
          <Trabajos ot={OT} placa={ordenData.placa} />
        ) : (
          <div>Cargando datos...</div>
        ))}

      {activeTab === "Soportes" && (
        <div>
          <DocumentosOrdenTrabajo otId={OT} />
          <SoportesOrtdenTrabajo OT={OT} />
        </div>
      )}
      {activeTab === "Comentarios" && <ComentariosOrdenTrabajo OT={OT} />}
      {activeTab === "Prestador" && <EncabezadoFactura otNumber={OT} />}
      {activeTab === "Estado" &&
        (ordenData ? (
          <Estados
            otNumber={OT}
            estado_vehiculo={ordenData.estado_vehiculo}
            estado_ot={ordenData.ESTADO}
            estado_autorizacion={ordenData.AUTORIZACION}
            onUpdate={fetchOrdenTrabajo} // Llama a la función para refrescar la data en el padre
          />
        ) : (
          <div>Cargando datos...</div>
        ))}
    </div>
  );
}

export default VerOrdenTrabajo;
