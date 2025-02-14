import React, { useState } from "react";
import styles from "./Operatividad.module.css";
import Tabla from "../Tabla/Tabla";

function Operatividad() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [documentos, setDocumentos] = useState([
    { id: 1, consecutivo: 1, cliente: "INMEL", fecha_emision: "2024-01-10", fecha_vencimiento: "2024-08-27", estado: "Vigente" },
  ]);

  const botonesAcciones = [
    { nombre: "Ver", link: "/gestion/documentos/ver/", icono: "fas fa-eye", color: "blue" }
  ];

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Operatividad</h3>
      

      {documentos.length > 0 ? (
        <Tabla
          datos={documentos}
          columnasOmitidas={["id"]}
          columnasVisibles={["consecutivo", "cliente", "fecha_emision", "fecha_vencimiento","estado"]}
          mostrarAcciones={false}
          columnaAccion="ID_DOCUMENTO"
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
      ) : (
        <p>No hay documentos disponibles.</p>
      )}


      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Añadir Documento</h2>
            <form>
             <div className={styles.divselector} >
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

export default Operatividad;
