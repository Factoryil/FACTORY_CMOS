import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import ContactoInfo from "../../../components/ContactosInfo/ContactosInfo";
import DocumentosContacto from "../../../components/DocumentosContacto/DocumentosContacto";
import ContactoEtiquetas from "../../../components/ContactoEtiquetas/ContactoEtiquetas";
import PermisosContacto from "../../../components/PermisosContacto/PermisosContacto";
import styles from "./ContactosVer.module.css";
import Cliente from "../../../components/Cliente/Cliente";
import Proveedor from "../../../components/Proveedor/Proveedor";

function ContactosVer() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("Documentos");

  const contacto = {
    id,
    nombre: "Juan Pérez",
    correo: "juan.perez@example.com",
    telefono: "123456789",
    permisos: [1, 3] // IDs de permisos asignados
  };

  const usuario = {
    username: "javiechat",
    nombre: "Juan Pérez",
    correo: "puedeserotrocorreo@gmail.com",
    rol: "cliente"
  };

  return (
    <div className={styles.contenedor}>
      <ContactoInfo data={contacto} />

      <div className={styles.tabs}>
        
        <button
          onClick={() => setActiveTab("Documentos")}
          className={`${styles.tab} ${activeTab === 'Documentos' ? styles.active : ''}`}
        >
          <i className="fas fa-file-alt"></i>
          Documentos
        </button>
        <button 
          onClick={() => setActiveTab("Etiquetas")}
          className={`${styles.tab} ${activeTab === 'Etiquetas' ? styles.active : ''}`}
        >
          <i className="fas fa-tags"></i>
          Etiquetas
        </button>
        <button 
          onClick={() => setActiveTab("Permisos")}
          className={`${styles.tab} ${activeTab === 'Permisos' ? styles.active : ''}`}
        >
          <i className="fas fa-user-shield"></i> 
          Permisos
        </button>

        <button 
          onClick={() => setActiveTab("Cliente")}
          className={`${styles.tab} ${activeTab === 'Cliente' ? styles.active : ''}`}
        >
         <i className="fas fa-user"></i>
          Cliente
        </button>
        <button 
          onClick={() => setActiveTab("Proveedor")}
          className={`${styles.tab} ${activeTab === 'Proveedor' ? styles.active : ''}`}
        >
         <i className="fas fa-user"></i>
         Proveedor
        </button>
      </div>

      {activeTab === "Documentos" && <DocumentosContacto />}
      {activeTab === "Etiquetas" && <ContactoEtiquetas usuario={usuario} permisosAsignados={contacto.permisos}  />}
      {activeTab === "Permisos" && <PermisosContacto usuario={usuario} permisosAsignados={contacto.permisos} />}
      {activeTab === "Cliente" && <Cliente />}
      {activeTab === "Proveedor" && <Proveedor />}
    </div>
  );
}

export default ContactosVer;
