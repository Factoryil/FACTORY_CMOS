import React, { useEffect, useState } from 'react';
import { apiManager } from '../../api/apiManager';
import styles from './Viaticos.module.css';
import Agregarviaticos from '../../components/ModalAgregarViaticos/Guardarviaticosvehiculos';

const BASE_URL = "http://localhost/API_FACTORY";

const ViaticosVehiculo = () => {
  const [viaticos, setViaticos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    cargarViaticosVehiculo();
  }, []);

  const cargarViaticosVehiculo = () => {
    apiManager.viaticosVehiculoListar()
      .then(data => setViaticos(data))
      .catch(err => console.error('Error cargando viáticos de vehículos:', err));
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Listado de Viáticos por Vehículo</h2>

      <div className={styles.barraSuperior}>
        <button className={styles.botonAgregar} onClick={() => setMostrarModal(true)}>
          Agregar Viático
        </button>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>#</th>
            <th>Placa</th>
            <th>Tipo de Gasto</th>
            <th>Nombre Peaje</th>
            <th>Valor</th>
            <th>Fecha del Gasto</th>
            <th>Soporte</th>
          </tr>
        </thead>
        <tbody>
          {viaticos.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.placa}</td>
              <td>{item.tipo}</td>
              <td>{item.tipo === "peaje" ? item.nombre_peaje : '-'}</td>
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

      {mostrarModal && (
        <Agregarviaticos
          onClose={() => {
            setMostrarModal(false);
            cargarViaticosVehiculo(); // Refrescar tabla al cerrar modal
          }}
        />
      )}
    </div>
  );
};

export default ViaticosVehiculo;