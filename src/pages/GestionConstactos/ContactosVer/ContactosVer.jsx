import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import DocumentosContacto from "../../../components/DocumentosContacto/DocumentosContacto";
import ContactoEtiquetas from "../../../components/ContactoEtiquetas/ContactoEtiquetas";
import PropietarioVehiculos from "../../../components/PropietarioVehiculos/PropietarioVehiculos";
import PermisosContacto from "../../../components/PermisosContacto/PermisosContacto";
import ClienteVehiculo from "../../../components/ClienteVehiculo/ClienteVehiculo";
import { apiManager } from "../../../api/apiManager";
import styles from "../../../styles/tabs.module.css";
import ContactosInfo from "../../../components/ContactosInfo/ContactosInfo";
import ContratosContacto from "../../../components/ContratosContacto/ContratosContacto";

function ContactosVer() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const paramsTab = new URLSearchParams(location.search).get("tab") || "Documentos";
  const [activeTab, setActiveTab] = useState(paramsTab);
  const [etiquetasUsuario, setEtiquetasUsuario] = useState([]);
  const [containerMinHeight, setContainerMinHeight] = useState(0);
  
  // Ref para el contenedor de contenido
  const contentRef = useRef(null);

  // Al cambiar de pestaña, medimos la altura actual para conservarla
  const changeTab = (tab) => {
    if (contentRef.current) {
      setContainerMinHeight(contentRef.current.clientHeight);
    }
    setActiveTab(tab);
    navigate(`?tab=${tab}`);
  };

  useEffect(() => {
    // Actualizamos la pestaña activa según la URL
    setActiveTab(paramsTab);
  }, [location.search, paramsTab]);

  useEffect(() => {
    const obtenerEtiquetasUsuario = async () => {
      try {
        const response = await apiManager.unionDeEtiquetaContactoID(id);
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
    (etiqueta) => etiqueta.etiqueta_nombre === "propietario"
  );
  const mostrarPermiso = etiquetasUsuario.some(
    (etiqueta) => etiqueta.etiqueta_nombre === "usuario"
  );
  const mostrarCliente = etiquetasUsuario.some(
    (etiqueta) => etiqueta.etiqueta_nombre === "cliente"
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "Documentos":
        return <DocumentosContacto contactoID={id} />;
      case "Etiquetas":
        return (
          <ContactoEtiquetas
            contactoID={id}
            onEtiquetasUpdate={(nuevasEtiquetas) => setEtiquetasUsuario(nuevasEtiquetas)}
          />
        );
      case "Propietario":
        return mostrarPropietario && <PropietarioVehiculos id={id} />;
      case "Alquiler-y-Servicios":
        return mostrarCliente && <ClienteVehiculo id={id} />;
      case "Permiso":
        return mostrarPermiso && <PermisosContacto contactoID={id} />;
      case "Contratos":
        return <ContratosContacto id={id} />;
      case "Servicios-y-Productos":
        return <div>Servicios y Productos (contenido a implementar)</div>;
      default:
        return null;
    }
  };

  return (
    <div className={styles.contenedor}>
      <ContactosInfo id={id} />

      <div className={styles.tabs}>
        <button
          onClick={() => changeTab("Documentos")}
          className={`${styles.tab} ${activeTab === "Documentos" ? styles.active : ""}`}
        >
          <i className="fas fa-file-alt"></i> Documentos
        </button>
        <button
          onClick={() => changeTab("Etiquetas")}
          className={`${styles.tab} ${activeTab === "Etiquetas" ? styles.active : ""}`}
        >
          <i className="fas fa-tags"></i> Etiquetas
        </button>
        <button
          onClick={() => changeTab("Contratos")}
          className={`${styles.tab} ${activeTab === "Contratos" ? styles.active : ""}`}
        >
          <i className="fas fa-file-contract"></i> Contratos
        </button>
        {mostrarPropietario && (
          <button
            onClick={() => changeTab("Propietario")}
            className={`${styles.tab} ${activeTab === "Propietario" ? styles.active : ""}`}
          >
            <i className="fas fa-user-tie"></i> Propietario
          </button>
        )}
        {mostrarCliente && (
          <button
            onClick={() => changeTab("Alquiler-y-Servicios")}
            className={`${styles.tab} ${activeTab === "Alquiler-y-Servicios" ? styles.active : ""}`}
          >
            <i className="fas fa-user"></i> Alquiler y Servicios
          </button>
        )}
        {mostrarPermiso && (
          <button
            onClick={() => changeTab("Permiso")}
            className={`${styles.tab} ${activeTab === "Permiso" ? styles.active : ""}`}
          >
            <i className="fas fa-user-shield"></i> Usuario
          </button>
        )}
        <button
          onClick={() => changeTab("Servicios-y-Productos")}
          className={`${styles.tab} ${activeTab === "Servicios-y-Productos" ? styles.active : ""}`}
        >
          <i className="fas fa-tools"></i> Servicios y Productos
        </button>
      </div>

      {/* Contenedor con minHeight fijo según el valor almacenado */}
      <div
        ref={contentRef}
        className={styles.content}
        style={{ minHeight: containerMinHeight }}
      >
        {renderTabContent()}
      </div>
    </div>
  );
}

export default ContactosVer;
