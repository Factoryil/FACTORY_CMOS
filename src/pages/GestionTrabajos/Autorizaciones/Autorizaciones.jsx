import styles from "./Autorizaciones.module.css";

function Autorizaciones() {
  return (
    <div className={styles.container}>
      {/* Sección de tarjetas */}
      <div className={styles.cardsContainer}>
        <div className={styles.card}>
          <h3>OT Autorizadas Hoy</h3>
          <p>12</p>
        </div>
        <div className={styles.card}>
          <h3>OT Pendientes de Autorización</h3>
          <p>7</p>
        </div>
        <div className={styles.card}>
          <h3>OT Rechazadas Hoy</h3>
          <p>2</p>
        </div>
      </div>

      {/* Sección de tabla */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Placa</th>
              <th>Taller</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>17/02/2025</td>
              <td>XYZ789</td>
              <td>Taller B</td>
              <td>Autorizada</td>
              <td>
                <button className={styles.actionButton}>Ver</button>
                <button className={styles.actionButton}>Editar</button>
              </td>
            </tr>
            {/* Más filas se pueden agregar aquí */}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Autorizaciones;
