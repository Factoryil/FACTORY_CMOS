import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ContactoInfo from "../../../components/ContactosInfo/ContactosInfo";
import DocumentosContacto from "../../../components/DocumentosContacto/DocumentosContacto";
import ContactoEtiquetas from "../../../components/ContactoEtiquetas/ContactoEtiquetas";
import styles from "./ContactosVer.module.css";
import PropietarioVehiculos from "../../../components/PropietarioVehiculos/PropietarioVehiculos";

function ContactosVer() {
  // Extraemos el id de la URL
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Determinar la pestaña activa desde la URL, o por defecto "Documentos"
  const paramsTab = new URLSearchParams(location.search).get("tab") || "Documentos";
  const [activeTab, setActiveTab] = useState(paramsTab);

  // Cambiar la pestaña y actualizar la URL
  const changeTab = (tab) => {
    setActiveTab(tab);
    navigate(`?tab=${tab}`); // Actualiza la URL con el parámetro 'tab'
  };

  useEffect(() => {
    // Se asegura de que el estado 'activeTab' coincida con el valor de la URL
    setActiveTab(paramsTab);
  }, [location.search]); // Se actualiza si la URL cambia

  return (
    <div className={styles.contenedor}>
      {/* Pasamos el id (o el objeto completo que incluye el id) a ContactoInfo */}
      <ContactoInfo id={id} />

      <div className={styles.tabs}>
        <button
          onClick={() => changeTab("Documentos")}
          className={`${styles.tab} ${activeTab === 'Documentos' ? styles.active : ''}`}
        >
          <i className="fas fa-file-alt"></i>
          Documentos
        </button>
        <button 
          onClick={() => changeTab("Etiquetas")}
          className={`${styles.tab} ${activeTab === 'Etiquetas' ? styles.active : ''}`}
        >
          <i className="fas fa-tags"></i>
          Etiquetas
        </button>
  
        <button 
          onClick={() => changeTab("Propietario")}
          className={`${styles.tab} ${activeTab === 'Propietario' ? styles.active : ''}`}
        >
          <i className="fas fa-users-cog"></i>
          Propietario
        </button>
      </div>

      {activeTab === "Documentos" && <DocumentosContacto />}
      {activeTab === "Etiquetas" && <ContactoEtiquetas contactoID={id} />}
      {activeTab === "Propietario" && <PropietarioVehiculos id={id} />}
    </div>
  );
}

export default ContactosVer;
