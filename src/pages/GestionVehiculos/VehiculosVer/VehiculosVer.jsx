import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import styles from "./VehiculosVer.module.css";
import VehiculoInfo from "../../../components/VehiculoInfo/VehiculoInfo";
import FichaTecnica from "../../../components/FichaTecnica/FichaTecnica";
import Propietario from "../../../components/Propietario/Propietario";
import Cliente from "../../../components/Cliente/Cliente";

function ContactosVer() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const paramsTab = new URLSearchParams(location.search).get("tab") || "ficha_tecnica";
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
      <VehiculoInfo id={id} />
      <div className={styles.tabs}>
        <button onClick={() => changeTab("ficha_tecnica")} className={`${styles.tab} ${activeTab === 'ficha_tecnica' ? styles.active : ''}`}>
          <i className="fas fa-file-alt"></i> ficha tecnica
        </button>
        <button onClick={() => changeTab("Propietario")} className={`${styles.tab} ${activeTab === 'Propietario' ? styles.active : ''}`}>
          <i className="fas fa-file-alt"></i> Propietario
        </button>
        <button onClick={() => changeTab("Cliente")} className={`${styles.tab} ${activeTab === 'Cliente' ? styles.active : ''}`}>
          <i className="fas fa-user"></i> Cliente
        </button>
      </div>

      {activeTab === "ficha_tecnica" && <FichaTecnica id={id} />}
      {activeTab === "Propietario" && <Propietario id={id} />}
      {activeTab === "Cliente" && <Cliente id={id} />}
    </div>
  );
}

export default ContactosVer;