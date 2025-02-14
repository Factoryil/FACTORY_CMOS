import React, { useState } from "react";
import styles from "./DocumentosContacto.module.css";
import Tabla from "../Tabla/Tabla";
import { transformarDatos } from "../../utils/transformarDatos";

const datos = [
  { id: 1, tipo_documento: "RUT", numero_documento: "213242342", fecha_emision: "2024-01-10", fecha_vencimiento: "", estado: "Vigente" },
  { id: 2, tipo_documento: "CERTIFICADO BANCARIO", numero_documento: "1231233321", fecha_emision: "2024-01-10", fecha_vencimiento: "", estado: "Vigente" },
];

const datos2 = [
  { id: 1, tipo_documento: "RUT", numero_documento: "213242342", fecha_emision: "2024-01-10", fecha_vencimiento: "", estado: "Vigente" },
];

const mapeoColumnas = {
  tipo_documento: "tipo documento",
  numero_documento: "numero documento",
  fecha_emision: "fecha emision",
  fecha_vencimiento: "fecha vencimiento",
};

function DocumentosContacto() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("vigentes");

  const datosTransformados = transformarDatos(datos, mapeoColumnas);
  const datosTransformados2 = transformarDatos(datos2, mapeoColumnas);
  const columnasVisibles = Object.values(mapeoColumnas);

  const botonesAcciones = [
    { nombre: "Ver", link: "/gestion/documentos/ver/", icono: "fas fa-eye", color: "blue" }
  ];

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Documentos del Contacto</h3>
      <div className={styles.tabsContainer}>
        <button className={`${styles.tab} ${activeTab === "vigentes" ? styles.activeTab : ""}`} onClick={() => setActiveTab("vigentes")}>
          Vigentes
        </button>
        <button className={`${styles.tab} ${activeTab === "vencidos" ? styles.activeTab : ""}`} onClick={() => setActiveTab("vencidos")}>
          Vencidos
        </button>
      </div>

      <div className={styles.tabContent}>
        {activeTab === "vigentes" && (
          <Tabla
            datos={datosTransformados}
            columnasOmitidas={["id"]}
            columnasVisibles={columnasVisibles}
            mostrarAcciones={true}
            columnaAccion="id"
            botonesAccion={botonesAcciones}
            filasPorPagina={3}
            habilitarPaginacion={true}
            habilitarBusqueda={true}
            habilitarOrdenamiento={true}
            habilitarExportacion={true}
            nombreExcel={"datos_tabla"}
            habilitarTotalRegistros={true}
          >
            <button className={styles.addButton2} onClick={() => setIsModalOpen(true)}>
              Añadir Documento
            </button>
          </Tabla>
        )}
        
        {activeTab === "vencidos" && (
          <Tabla
            datos={datosTransformados2} // Aquí deberías filtrar los vencidos
            columnasOmitidas={["id"]}
            columnasVisibles={columnasVisibles}
            mostrarAcciones={true}
            columnaAccion="id"
            botonesAccion={botonesAcciones}
            filasPorPagina={3}
            habilitarPaginacion={true}
            habilitarBusqueda={true}
            habilitarOrdenamiento={true}
            habilitarExportacion={true}
            nombreExcel={"datos_tabla"}
            habilitarTotalRegistros={true}
          >
            <button className={styles.addButton2} onClick={() => setIsModalOpen(true)}>
              Añadir Documento
            </button>
          </Tabla>
        )}
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Añadir Documento</h2>
            <form>
              <div className={styles.divselector}>
                <label>Tipo de Documento:</label>
                <select className={styles.input} required>
                  <option value="">Seleccione</option>
                  <option value="DNI">DNI</option>
                  <option value="Contrato">Contrato</option>
                  <option value="Otros">Otros</option>
                </select>
              </div>
              <label>Anexar Documento:</label>
              <input type="file" className={styles.input} required />
              <div className={styles.modalButtons}>
                <button type="submit" className={styles.saveButton}>Guardar</button>
                <button type="button" className={styles.cancelButton} onClick={() => setIsModalOpen(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DocumentosContacto;
