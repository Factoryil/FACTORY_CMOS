import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import styles from "./VerOrdenTrabajo.module.css";
import OrdentrabajoInfo from "../../../components/OrdentrabajoInfo/OrdentrabajoInfo";
import Trabajos from "../../../components/Trabajos/Trabajos";
import DocumentosOrtdenTrabajo from "../../../components/DocumentosOrtdenTrabajo/DocumentosOrtdenTrabajo";
import SoportesOrtdenTrabajo from "../../../components/SoportesOrtdenTrabajo/SoportesOrtdenTrabajo";
import ComentariosOrdenTrabajo from "../../../components/ComentariosOrdenTrabajo/ComentariosOrdenTrabajo";
import EncabezadoFactura from "../../../components/EncabezadoFactura/EncabezadoFactura";
import DocumentosOrdenTrabajo from "../../../components/DocumentosOrtdenTrabajo/DocumentosOrtdenTrabajo";

function VerOrdenTrabajo() {
  const { OT } = useParams();
  
  const location = useLocation();
  const navigate = useNavigate();

  const paramsTab = new URLSearchParams(location.search).get("tab") || "Trabajos";
  const [activeTab, setActiveTab] = useState(paramsTab);

  const changeTab = (tab) => {
    setActiveTab(tab);
    navigate(`?tab=${tab}`);
  };

  useEffect(() => {
    setActiveTab(paramsTab);
  }, [location.search]);

  return (
    <div className={styles.contenedor}>
      <OrdentrabajoInfo OT={OT} />
      <div className={styles.tabs}>
        <button onClick={() => changeTab("Trabajos")} className={`${styles.tab} ${activeTab === 'Trabajos' ? styles.active : ''}`}>
          <i className="fas fa-tasks"></i> Trabajos
        </button>
        <button onClick={() => changeTab("Prestador")} className={`${styles.tab} ${activeTab === 'Prestador' ? styles.active : ''}`}>
          <i className="fas fa-file-alt"></i> Prestador
        </button>
        <button onClick={() => changeTab("Soportes")} className={`${styles.tab} ${activeTab === 'Soportes' ? styles.active : ''}`}>
          <i className="fas fa-life-ring"></i> Soportes
        </button>
        <button onClick={() => changeTab("Comentarios")} className={`${styles.tab} ${activeTab === 'Comentarios' ? styles.active : ''}`}>
          <i className="fas fa-comment"></i> Comentarios
        </button>
      </div>

      {activeTab === "Trabajos" &&  <Trabajos OT={OT} />}
      
      {activeTab === "Soportes" && <div ><DocumentosOrdenTrabajo otId={OT} /><SoportesOrtdenTrabajo OT={OT} /></div> }
      {activeTab === "Comentarios" && <ComentariosOrdenTrabajo OT={OT} /> }
      {activeTab === "Prestador" && <EncabezadoFactura otNumber={OT} /> }
    </div>
  );
}

export default VerOrdenTrabajo;