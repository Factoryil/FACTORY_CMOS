import React, { useState } from "react";
import styles from "./EncabezadoFactura.module.css";

const EncabezadoFactura = ({ otNumber }) => {
  const [selectedTaller, setSelectedTaller] = useState("");
  const [selectedResponsable, setSelectedResponsable] = useState("");

  const [modalTallerOpen, setModalTallerOpen] = useState(false);
  const [modalResponsableOpen, setModalResponsableOpen] = useState(false);

  const [searchTaller, setSearchTaller] = useState("");
  const [searchResponsable, setSearchResponsable] = useState("");

  const tallerOptions = [
    { id: "t1", nombre: "Taller 1", nit: "123456789", ubicacion: "Calle 1", metodoPago: "Efectivo" },
    { id: "t2", nombre: "Tienda ABC", nit: "987654321", ubicacion: "Avenida 2", metodoPago: "Transferencia" },
  ];

  const responsableOptions = [
    { id: "r1", nombre: "Juan Pérez", identificacion: "CC 123456789" },
    { id: "r2", nombre: "María Gómez", identificacion: "NIT 987654321" },
  ];

  const selectedTallerObj = tallerOptions.find((option) => option.id === selectedTaller);
  const selectedResponsableObj = responsableOptions.find((option) => option.id === selectedResponsable);

  const filteredTallerOptions = tallerOptions.filter((option) => {
    const searchLower = searchTaller.toLowerCase();
    return (
      option.nombre.toLowerCase().includes(searchLower) ||
      option.nit.toLowerCase().includes(searchLower) ||
      option.ubicacion.toLowerCase().includes(searchLower) ||
      option.metodoPago.toLowerCase().includes(searchLower)
    );
  });

  const filteredResponsableOptions = responsableOptions.filter((option) => {
    const searchLower = searchResponsable.toLowerCase();
    return (
      option.nombre.toLowerCase().includes(searchLower) ||
      option.identificacion.toLowerCase().includes(searchLower)
    );
  });

  const handleSelectTaller = (optionId) => {
    setSelectedTaller(optionId);
    setModalTallerOpen(false);
    setSearchTaller("");
  };

  const handleSelectResponsable = (optionId) => {
    setSelectedResponsable(optionId);
    setModalResponsableOpen(false);
    setSearchResponsable("");
  };

  return (
    <div className={styles.encabezadoFactura}>
      <div className={styles.detailSections}>
        <div className={styles.section}>
          <div className={styles.contenedorh3}>
            <h3>Responsable de Pago</h3>
            <button onClick={() => setModalResponsableOpen(true)} className={styles.asignarButton}>
              <i className="fas fa-plus"></i> Asignar
            </button>
          </div>
          {selectedResponsableObj && (
            <div className={styles.detailInfo}>
              <p><span>Nombre:</span> {selectedResponsableObj.nombre}</p>
              <p><span>Identificación:</span> {selectedResponsableObj.identificacion}</p>
            </div>
          )}
        </div>

        <div className={styles.section}>
          <div className={styles.contenedorh3}>
            <h3>Taller / Tienda</h3>
            <button onClick={() => setModalTallerOpen(true)} className={styles.asignarButton}>
              <i className="fas fa-plus"></i> Asignar
            </button>
          </div>
          {selectedTallerObj && (
            <div className={styles.detailInfo}>
              <p><span>Nombre:</span> {selectedTallerObj.nombre}</p>
              <p><span>NIT:</span> {selectedTallerObj.nit}</p>
              <p><span>Ubicación:</span> {selectedTallerObj.ubicacion}</p>
              <p><span>Método de Pago:</span> {selectedTallerObj.metodoPago}</p>
            </div>
          )}
        </div>
      </div>

      {modalTallerOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h4>Seleccione Taller / Tienda</h4>
              <button onClick={() => setModalTallerOpen(false)} className={styles.closeButton}>
                &times;
              </button>
            </div>
            <div className={styles.modalBody}>
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTaller}
                onChange={(e) => setSearchTaller(e.target.value)}
                className={styles.searchInput}
              />
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>NIT</th>
                    <th>Ubicación</th>
                    <th>Método de Pago</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTallerOptions.map((option) => (
                    <tr
                      key={option.id}
                      onClick={() => handleSelectTaller(option.id)}
                      className={styles.tableRow}
                    >
                      <td>{option.nombre}</td>
                      <td>{option.nit}</td>
                      <td>{option.ubicacion}</td>
                      <td>{option.metodoPago}</td>
                    </tr>
                  ))}
                  {filteredTallerOptions.length === 0 && (
                    <tr>
                      <td colSpan="4" className={styles.noResults}>No se encontraron resultados</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {modalResponsableOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h4>Seleccione Responsable de Pago</h4>
              <button onClick={() => setModalResponsableOpen(false)} className={styles.closeButton}>
                &times;
              </button>
            </div>
            <div className={styles.modalBody}>
              <input
                type="text"
                placeholder="Buscar..."
                value={searchResponsable}
                onChange={(e) => setSearchResponsable(e.target.value)}
                className={styles.searchInput}
              />
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Identificación</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResponsableOptions.map((option) => (
                    <tr
                      key={option.id}
                      onClick={() => handleSelectResponsable(option.id)}
                      className={styles.tableRow}
                    >
                      <td>{option.nombre}</td>
                      <td>{option.identificacion}</td>
                    </tr>
                  ))}
                  {filteredResponsableOptions.length === 0 && (
                    <tr>
                      <td colSpan="2" className={styles.noResults}>No se encontraron resultados</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EncabezadoFactura;
