import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ContactoInfo from "../../../components/ContactosInfo/ContactosInfo";
import DocumentosContacto from "../../../components/DocumentosContacto/DocumentosContacto";
import ContactoEtiquetas from "../../../components/ContactoEtiquetas/ContactoEtiquetas";
import PropietarioVehiculos from "../../../components/PropietarioVehiculos/PropietarioVehiculos";
import PermisosContacto from "../../../components/PermisosContacto/PermisosContacto";
import styles from "./ContactosVer.module.css";
import { apiManager } from "../../../api/apiManager";

function ContactosVer() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const paramsTab = new URLSearchParams(location.search).get("tab") || "Documentos";
  const [activeTab, setActiveTab] = useState(paramsTab);
  const [etiquetasUsuario, setEtiquetasUsuario] = useState([]);

  useEffect(() => {
    setActiveTab(paramsTab);
  }, [location.search]);

  const changeTab = (tab) => {
    setActiveTab(tab);
    navigate(`?tab=${tab}`);
  };

  useEffect(() => {
    const obtenerEtiquetasUsuario = async () => {
      try {
        const response = await apiManager.unionDeEtiquetaContactoID(id);
        console.log(response);
        setEtiquetasUsuario(response);
      } catch (error) {
        console.error("Error al obtener las etiquetas del usuario:", error);
      }
    };
    if (id) {
      obtenerEtiquetasUsuario();
    }
  }, [id]);

  const mostrarPropietario = etiquetasUsuario.some(
    (etiqueta) => etiqueta.etiqueta_nombre === "Propietario"
  );
  const mostrarPermiso = etiquetasUsuario.some(
    (etiqueta) => etiqueta.etiqueta_nombre === "usuario"
  );

  return (
    <div className={styles.contenedor}>
      <ContactoInfo id={id} />

      <div className={styles.tabs}>
        <button
          onClick={() => changeTab("Documentos")}
          className={`${styles.tab} ${activeTab === "Documentos" ? styles.active : ""}`}
        >
          <i className="fas fa-file-alt"></i>
          Documentos
        </button>
        <button
          onClick={() => changeTab("Etiquetas")}
          className={`${styles.tab} ${activeTab === "Etiquetas" ? styles.active : ""}`}
        >
          <i className="fas fa-tags"></i>
          Etiquetas
        </button>

        {mostrarPropietario && (
          <button
            onClick={() => changeTab("Propietario")}
            className={`${styles.tab} ${activeTab === "Propietario" ? styles.active : ""}`}
          >
            <i className="fas fa-users-cog"></i>
            Propietario
          </button>
        )}

        {mostrarPermiso && (
          <button
            onClick={() => changeTab("Permiso")}
            className={`${styles.tab} ${activeTab === "Permiso" ? styles.active : ""}`}
          >
            <i className="fas fa-tags"></i>
            Permiso
          </button>
        )}
      </div>

      {activeTab === "Documentos" && <DocumentosContacto />}
      {activeTab === "Etiquetas" && (
        <ContactoEtiquetas 
          contactoID={id} 
          onEtiquetasUpdate={(nuevasEtiquetas) => setEtiquetasUsuario(nuevasEtiquetas)}
        />
      )}
      {activeTab === "Propietario" && mostrarPropietario && <PropietarioVehiculos id={id} />}
      {activeTab === "Permiso" && mostrarPermiso && <PermisosContacto contactoID={id} />}
    </div>
  );
}

export default ContactosVer;
