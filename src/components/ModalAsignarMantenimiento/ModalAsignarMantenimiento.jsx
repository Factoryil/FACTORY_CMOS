import React, { useState, useEffect } from "react";
import styles from "../../styles/ModalFormulario.module.css";
import { apiManager } from "../../api/apiManager";

function ModalAsignarMantenimiento({ cerrarModal, planId, onUpdate }) {
  // Estado para el nuevo registro
  const [nuevoRegistro, setNuevoRegistro] = useState({
    plan_mantenimiento_id: planId,
    mantenimiento_id: "",
    periodicidad_km: "",
  });
  const [mantenimientos, setMantenimientos] = useState([]);
  // Estado para guardar los IDs de mantenimientos ya asignados al plan
  const [assignedIds, setAssignedIds] = useState([]);

  // Cargar mantenimientos disponibles
  useEffect(() => {
    const obtenerMantenimientos = async () => {
      try {
        const response = await apiManager.mantenimientos();
        setMantenimientos(response);
      } catch (error) {
        console.error("Error al obtener mantenimientos:", error);
      }
    };
    obtenerMantenimientos();
  }, []);

  // Cargar los mantenimientos ya asignados al plan
  useEffect(() => {
    const obtenerAsignaciones = async () => {
      try {
        // Se asume que este método retorna un objeto con { planInfo, asignaciones }
        const response = await apiManager.obtenerAsignacionesPlan(planId);
        const idsAsignados = response.asignaciones.map(
          (asig) => asig.mantenimiento_id
        );
        setAssignedIds(idsAsignados);
      } catch (error) {
        console.error("Error al obtener asignaciones:", error);
      }
    };
    obtenerAsignaciones();
  }, [planId]);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setNuevoRegistro((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("plan_mantenimiento_id", nuevoRegistro.plan_mantenimiento_id);
    formData.append("mantenimiento_id", nuevoRegistro.mantenimiento_id);
    formData.append("periodicidad_km", nuevoRegistro.periodicidad_km);
    try {
      // Se asume que apiManager.asignarMantenimientoPlan realiza el POST a /plan-mantenimiento/ver/asignar
      const response = await apiManager.asignarMantenimientoPlan(formData);
      console.log("Mantenimiento asignado:", response);
      cerrarModal();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error al asignar mantenimiento:", error);
    }
  };

  const manejarCerrarModal = (e) => {
    if (e.target === e.currentTarget) {
      cerrarModal();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={manejarCerrarModal}>
      <div className={styles.modal}>
        <h2>Asignar Mantenimiento</h2>
        <form onSubmit={manejarEnvio}>
          <label htmlFor="mantenimiento_id">Mantenimiento</label>
          <select
            id="mantenimiento_id"
            name="mantenimiento_id"
            value={nuevoRegistro.mantenimiento_id}
            onChange={manejarCambio}
            required
          >
            <option value="">Seleccione un mantenimiento</option>
            {mantenimientos
              .filter(
                (mant) => !assignedIds.includes(mant.mantenimiento_id)
              )
              .map((mant) => (
                <option
                  key={mant.mantenimiento_id}
                  value={mant.mantenimiento_id}
                >
                  {mant.trabajo} - {mant.tipo_mantenimiento}
                </option>
              ))}
          </select>

          {mantenimientos.filter(
            (mant) => !assignedIds.includes(mant.mantenimiento_id)
          ).length === 0 && (
            <p style={{ color: "red", fontSize: "14px" }}>
              No hay mantenimientos disponibles para asignar.
            </p>
          )}

          <label htmlFor="periodicidad_km">Periodicidad (km)</label>
          <input
            type="number"
            id="periodicidad_km"
            name="periodicidad_km"
            value={nuevoRegistro.periodicidad_km}
            onChange={manejarCambio}
            required
          />

          <div className={styles.modalButtons}>
            <button type="submit" className={styles.saveButton}>
              Asignar
            </button>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={cerrarModal}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalAsignarMantenimiento;
