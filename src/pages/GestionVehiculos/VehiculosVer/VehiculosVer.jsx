import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import styles from "../../../styles/tabs.module.css";
import VehiculoInfo from "../../../components/VehiculoInfo/VehiculoInfo";
import FichaTecnica from "../../../components/FichaTecnica/FichaTecnica";
import Propietario from "../../../components/Propietario/Propietario";
import Cliente from "../../../components/Cliente/Cliente";
import MantenimientosEjecutar from "../../../components/MantenimientosEjecutar/MantenimientosEjecutar";
import OdometroSeguimiento from "../../../components/OdometroSeguimiento/OdometroSeguimiento";
import Documentacion from "../../../pages/GestionVehiculos/Documentos/DocumentosVehiculos";

function ContactosVer() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const paramsTab = new URLSearchParams(location.search).get("tab") || "ficha_tecnica";
  const [activeTab, setActiveTab] = useState(paramsTab);
  const [containerMinHeight, setContainerMinHeight] = useState(0);
  
  // Ref para el contenedor del contenido de la pestaña
  const contentRef = useRef(null);

  const changeTab = (tab) => {
    if (contentRef.current) {
      setContainerMinHeight(contentRef.current.clientHeight);
    }
    setActiveTab(tab);
    navigate(`?tab=${tab}`);
  };

  useEffect(() => {
    setActiveTab(paramsTab);
  }, [location.search, paramsTab]);

  return (
    <div className={styles.contenedor}>
      {/* Información del vehículo */}
      <div className={styles.vehiculoInfo}>
        <VehiculoInfo id={id} />
      </div>

      {/* Navegación de pestañas */}
      <div className={styles.tabs}>
        <button
          onClick={() => changeTab("ficha_tecnica")}
          className={`${styles.tab} ${activeTab === "ficha_tecnica" ? styles.active : ""}`}
        >
          <i className="fas fa-file-alt"></i> 
          <p>Ficha Técnica</p>
        </button>
        <button
          onClick={() => changeTab("propietario")}
          className={`${styles.tab} ${activeTab === "propietario" ? styles.active : ""}`}
        >
          <i className="fas fa-id-card"></i> Propietario
        </button>
        <button
          onClick={() => changeTab("cliente")}
          className={`${styles.tab} ${activeTab === "cliente" ? styles.active : ""}`}
        >
          <i className="fas fa-user"></i> Cliente
        </button>
        <button
          onClick={() => changeTab("documentacion")}
          className={`${styles.tab} ${activeTab === "documentacion" ? styles.active : ""}`}
        >
          <i className="fas fa-folder-open"></i> Documentación
        </button>
        <button
          onClick={() => changeTab("inspecciones")}
          className={`${styles.tab} ${activeTab === "inspecciones" ? styles.active : ""}`}
        >
          <i className="fas fa-search"></i> Inspecciones
        </button>
        <button
          onClick={() => changeTab("odometro")}
          className={`${styles.tab} ${activeTab === "odometro" ? styles.active : ""}`}
        >
          <i className="fas fa-tachometer-alt"></i> Seg. Odómetro
        </button>
        <button
          onClick={() => changeTab("mantenimientos")}
          className={`${styles.tab} ${activeTab === "mantenimientos" ? styles.active : ""}`}
        >
          <i className="fas fa-tools"></i> Mantenimientos
        </button>
        <button
          onClick={() => changeTab("comparendos")}
          className={`${styles.tab} ${activeTab === "comparendos" ? styles.active : ""}`}
        >
          <i className="fas fa-exclamation-triangle"></i> Comparendos
        </button>
      </div>

      {/* Contenedor del contenido con minHeight dinámico para evitar saltos */}
      <div ref={contentRef} className={styles.contenido} style={{ minHeight: containerMinHeight }}>
        {activeTab === "ficha_tecnica" && <FichaTecnica id={id} />}
        {activeTab === "cliente" && <Cliente id={id} />}
        {activeTab === "propietario" && <Propietario id={id} />}
        {activeTab === "documentacion" && <Documentacion id={id} />}
        {activeTab === "inspecciones" && <div>Aquí va la información de Inspecciones</div>}
        {activeTab === "comparendos" && <div>Aquí va la información de Comparendos</div>}
        {activeTab === "odometro" && <OdometroSeguimiento placa={id} />}
        {activeTab === "mantenimientos" && <MantenimientosEjecutar placa={id} />}
      </div>
    </div>
  );
}

export default ContactosVer;
