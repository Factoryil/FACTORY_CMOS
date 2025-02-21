import React, { useState, useEffect } from "react";
import styles from "../../styles/ModalFormulario.module.css";
import { apiManager } from "../../api/apiManager";

function ModalEditarGrupoMantenimientos({ grupoId, placa, cerrarModal, onUpdate }) {
  const [items, setItems] = useState([]);
  const [cargando, setCargando] = useState(false);

  // Cargar los ítems del grupo usando el grupoId; se utiliza el endpoint que obtiene las asignaciones de un plan
  useEffect(() => {
    const obtenerItems = async () => {
      if (!grupoId) return;
      try {
        setCargando(true);
        // Usamos el mismo endpoint que obtiene asignaciones de un plan, pasando grupoId como plan_mantenimiento_id
        const response = await apiManager.obtenerAsignacionesPlan(grupoId);
        // response.asignaciones es la lista de ítems en el grupo
        setItems(response.asignaciones || []);
        setCargando(false);
      } catch (error) {
        console.error("Error al obtener ítems del grupo:", error);
        setCargando(false);
      }
    };
    obtenerItems();
  }, [grupoId]);

  // Permite actualizar un campo de un ítem en la lista
  const manejarCambioItem = (index, campo, valor) => {
    const nuevosItems = [...items];
    nuevosItems[index][campo] = valor;
    setItems(nuevosItems);
  };

  // Permite eliminar un ítem de la lista
  const eliminarItem = (index) => {
    const nuevosItems = [...items];
    nuevosItems.splice(index, 1);
    setItems(nuevosItems);
  };

  // Al guardar, se envía cada ítem individualmente
  const manejarGuardar = async () => {
    try {
      for (let item of items) {
        const formData = new FormData();
        formData.append("vehiculo_id", placa);
        formData.append("mantenimiento_id", item.mantenimiento_id);
        formData.append("periodicidad_km", item.periodicidad_km);
        // Se puede enviar odometro_ultima si el usuario lo modificó
        formData.append("odometro_ultima", item.odometro_ultima || "");
        await apiManager.addMantenimientoEjecutar(formData);
      }
      cerrarModal();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error al guardar ítems del grupo:", error);
    }
  };

  const manejarCerrarModal = (e) => {
    if (e.target === e.currentTarget) {
      cerrarModal();
    }
  };

  if (cargando) {
    return <div className={styles.modalOverlay}><div className={styles.modal}><p>Cargando...</p></div></div>;
  }

  return (
    <div className={styles.modalOverlay} onClick={manejarCerrarModal}>
      <div className={styles.modal}>
        <h2>Editar Ítems del Grupo</h2>
        {items.length === 0 ? (
          <p>No se encontraron ítems en este grupo.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Mantenimiento</th>
                <th>Periodicidad (km)</th>
                <th>Odómetro Último</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.plan_mantenimiento_ejecutar_id}>
                  <td>{item.trabajo} - {item.tipo_mantenimiento}</td>
                  <td>
                    <input
                      type="number"
                      value={item.periodicidad_km}
                      onChange={(e) => manejarCambioItem(index, "periodicidad_km", e.target.value)}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.odometro_ultima || ""}
                      onChange={(e) => manejarCambioItem(index, "odometro_ultima", e.target.value)}
                    />
                  </td>
                  <td>
                    <button type="button" onClick={() => eliminarItem(index)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className={styles.modalButtons}>
          <button type="button" className={styles.saveButton} onClick={manejarGuardar}>
            Guardar
          </button>
          <button type="button" className={styles.cancelButton} onClick={cerrarModal}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalEditarGrupoMantenimientos;
