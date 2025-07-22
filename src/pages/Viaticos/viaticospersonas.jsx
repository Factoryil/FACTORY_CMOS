import React, { useEffect, useState } from 'react';
import { apiManager } from '../../api/apiManager';
import styles from './Viaticos.module.css';
import Agregarviaticos from '../../components/ModalAgregarViaticos/Guardarviaticos';

const BASE_URL = "http://localhost/api_cmos";

const Viaticospersonas = () => {
  const [viaticos, setViaticos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    cargarViaticos();
  }, []);

  const cargarViaticos = () => {
    apiManager.viaticosListar()
      .then(data => setViaticos(data))
      .catch(err => console.error('Error cargando viáticos:', err));
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Listado General de Viáticos por Persona</h2>

      <div className={styles.barraSuperior}>
        <button className={styles.botonAgregar} onClick={() => setMostrarModal(true)}>
          Agregar Viático
        </button>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>#</th>
            <th>Persona</th>
            <th>Tipo de Gasto</th>
            <th>Valor</th>
            <th>Fecha del Gasto</th>
            <th>Soporte</th>
          </tr>
        </thead>
        <tbody>
          {viaticos.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.nombre || 'Sin nombre'}</td>
              <td>{item.tipo}</td>
              <td>${Number(item.valor).toLocaleString('es-CO')}</td>
              <td>{item.fecha_soporte}</td>
              <td>
                {item.soporte_imagen ? (
                  <a
                    href={`${BASE_URL}/${item.soporte_imagen}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver soporte
                  </a>
                ) : (
                  'Sin soporte'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de agregar */}
      {mostrarModal && (
        <Agregarviaticos
          onClose={() => {
            setMostrarModal(false);
            cargarViaticos(); // Recargar lista después de agregar
          }}
        />
      )}
    </div>
  );
};

export default Viaticospersonas;
