import  { useEffect, useState } from 'react';
import { apiManager } from '../../api/apiManager';
import styles from './Viaticos.module.css';
import Agregarviaticos from '../../components/ModalAgregarViaticos/Guardarviaticos';

const BASE_URL = "http://localhost/api_cmos";

const Viaticospersonas = () => {
  const [viaticos, setViaticos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [filtroNombre, setFiltroNombre] = useState('');
  const [categoria, setCategoria] = useState('todos'); // 'todos', 'peaje', 'combustible', 'hospedaje', 'alimentacion'

  useEffect(() => {
    cargarViaticos();
  }, []);

  const cargarViaticos = () => {
    apiManager.viaticosListar()
      .then(data => setViaticos(data))
      .catch(err => console.error('Error cargando viáticos:', err));
  };

  const filtrarViaticos = () => {
    return viaticos.filter((v) => {
      const coincideNombre = v.nombre?.toLowerCase().includes(filtroNombre.toLowerCase());
      const coincideTipo = categoria === 'todos' || v.tipo === categoria;
      return coincideNombre && coincideTipo;
    });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Listado de Viáticos</h2>

      <div className={styles.barraSuperior}>
        <button className={styles.botonAgregar} onClick={() => setMostrarModal(true)}>
          Agregar Viático
        </button>

        <input
          type="text"
          placeholder="Buscar por nombre..."
          className={styles.searchInput}
          value={filtroNombre}
          onChange={(e) => setFiltroNombre(e.target.value)}
        />

        <select
          className={styles.selectFiltro}
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        >
          <option value="todos">Todos</option>
          <option value="combustible">Combustible</option>
          <option value="hospedaje">Hospedaje</option>
          <option value="alimentacion">Alimentación</option>
          <option value="transporte">Transporte</option>
        </select>
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
          {filtrarViaticos().map((item, index) => (
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

      {mostrarModal && (
        <Agregarviaticos
          onClose={() => {
            setMostrarModal(false);
            cargarViaticos();
          }}
        />
      )}
    </div>
  );
};

export default Viaticospersonas;
