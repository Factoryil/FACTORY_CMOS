import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import styles from "./VehiculosVer.module.css";
import VehiculoInfo from "../../../components/VehiculoInfo/VehiculoInfo";
import Operatividad from "../../../components/Operatividad/Operatividad";
import VehiculoProveedor from "../../../components/VehiculoProveedor/VehiculoProveedor";

function VehiculosVer() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("FichaTecnica");

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
      <VehiculoInfo data={contacto} />

      <div className={styles.tabs}>
        
        <button
          onClick={() => setActiveTab("FichaTecnica")}
          className={`${styles.tab} ${activeTab === 'FichaTecnica' ? styles.active : ''}`}
        >
          <i className="fas fa-file-alt"></i>
          Ficha Tecnica
        </button>
        <button 
          onClick={() => setActiveTab("Documentacion")}
          className={`${styles.tab} ${activeTab === 'Documentacion' ? styles.active : ''}`}
        >
          <i className="fas fa-tags"></i>
          Documentacion
        </button>
        <button 
          onClick={() => setActiveTab("operatividad")}
          className={`${styles.tab} ${activeTab === 'operatividad' ? styles.active : ''}`}
        >
          <i className="fas fa-user-shield"></i> 
          operatividad
        </button>

        <button 
          onClick={() => setActiveTab("Proveedor")}
          className={`${styles.tab} ${activeTab === 'Proveedor' ? styles.active : ''}`}
        >
         <i className="fas fa-user"></i>
         Proveedor
        </button>
      </div>

      {activeTab === "FichaTecnica" && <div> </div>}
      {activeTab === "Documentacion" && <div> </div>}
      {activeTab === "operatividad" && <Operatividad />}
      {activeTab === "Proveedor" && <VehiculoProveedor />}
    </div>
  );
}

export default VehiculosVer;
