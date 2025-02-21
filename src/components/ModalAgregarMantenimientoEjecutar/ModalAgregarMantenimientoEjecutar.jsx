import React, { useState, useEffect } from "react";
import styles from "../../styles/ModalFormulario.module.css";
import { apiManager } from "../../api/apiManager";

function ModalAgregarMantenimientoEjecutar({ cerrarModal, placa, onUpdate }) {
  // Estado para elegir el tipo de asignación: "individual" o "grupo"
  const [tipoAsignacion, setTipoAsignacion] = useState("individual");

  // Estado para el nuevo registro; se usan dos campos: mantenimiento_id para individual y grupo_id para grupo
  const [nuevoRegistro, setNuevoRegistro] = useState({
    vehiculo_id: placa, // Usamos la placa como identificador del vehículo
    mantenimiento_id: "",
    grupo_id: "",
    periodicidad_km: "",
    odometro_ultima: ""
  });
  const [mantenimientos, setMantenimientos] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [assignedIds, setAssignedIds] = useState([]);

  // Cargar la lista de mantenimientos individuales disponibles
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

  // Cargar la lista de grupos (planes de mantenimiento)
  useEffect(() => {
    const obtenerGrupos = async () => {
      try {
        const response = await apiManager.planesMantenimiento();
        setGrupos(response);
      } catch (error) {
        console.error("Error al obtener grupos de mantenimiento:", error);
      }
    };
    obtenerGrupos();
  }, []);

  // Cargar las ejecuciones ya asignadas a este vehículo para filtrar opciones
  useEffect(() => {
    const obtenerEjecuciones = async () => {
      try {
        const response = await apiManager.ejecucionesMantenimiento();
        const filtrados = response.filter(ejec => ejec.vehiculo_id === placa);
        const idsAsignados = filtrados.map(ejec => ejec.mantenimiento_id);
        setAssignedIds(idsAsignados);
      } catch (error) {
        console.error("Error al obtener ejecuciones asignadas:", error);
      }
    };
    obtenerEjecuciones();
  }, [placa]);

  const handleTipoChange = (e) => {
    const value = e.target.value;
    setTipoAsignacion(value);
    // Reiniciamos los campos de selección según el tipo elegido
    setNuevoRegistro(prev => ({
      ...prev,
      mantenimiento_id: "",
      grupo_id: "",
      // Reiniciamos también los campos opcionales si se cambia de tipo
      periodicidad_km: "",
      odometro_ultima: ""
    }));
  };

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setNuevoRegistro(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("vehiculo_id", nuevoRegistro.vehiculo_id);
    formData.append("tipo_asignacion", tipoAsignacion);
    if (tipoAsignacion === "individual") {
      formData.append("mantenimiento_id", nuevoRegistro.mantenimiento_id);
      formData.append("periodicidad_km", nuevoRegistro.periodicidad_km);
      formData.append("odometro_ultima", nuevoRegistro.odometro_ultima);
    } else {
      formData.append("grupo_id", nuevoRegistro.grupo_id);
    }
    try {
      const response = await apiManager.addMantenimientoEjecutar(formData);
      console.log("Ejecución de mantenimiento asignada:", response);
      cerrarModal();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error al asignar ejecución de mantenimiento:", error);
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
          <label htmlFor="tipoAsignacion">Tipo de Asignación</label>
          <select
            id="tipoAsignacion"
            name="tipoAsignacion"
            value={tipoAsignacion}
            onChange={handleTipoChange}
            required
          >
            <option value="individual">Mantenimiento Individual</option>
            <option value="grupo">Grupo de Mantenimiento</option>
          </select>

          {tipoAsignacion === "individual" ? (
            <>
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
                  .filter(mant => !assignedIds.includes(mant.mantenimiento_id))
                  .map(mant => (
                    <option key={mant.mantenimiento_id} value={mant.mantenimiento_id}>
                      {mant.trabajo} - {mant.tipo_mantenimiento}
                    </option>
                  ))}
              </select>
              {mantenimientos.filter(mant => !assignedIds.includes(mant.mantenimiento_id)).length === 0 && (
                <p style={{ color: "red", fontSize: "14px" }}>
                  No hay mantenimientos individuales disponibles para asignar.
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

              <label htmlFor="odometro_ultima">Odómetro Último</label>
              <input
                type="number"
                id="odometro_ultima"
                name="odometro_ultima"
                value={nuevoRegistro.odometro_ultima}
                onChange={manejarCambio}
              />
            </>
          ) : (
            <>
              <label htmlFor="grupo_id">Grupo de Mantenimiento</label>
              <select
                id="grupo_id"
                name="grupo_id"
                value={nuevoRegistro.grupo_id}
                onChange={manejarCambio}
                required
              >
                <option value="">Seleccione un grupo de mantenimiento</option>
                {grupos
                  .filter(grupo => !assignedIds.includes(grupo.plan_mantenimiento_id))
                  .map(grupo => (
                    <option key={grupo.plan_mantenimiento_id} value={grupo.plan_mantenimiento_id}>
                      {grupo.nombre_rutina}
                    </option>
                  ))}
              </select>
              {grupos.filter(grupo => !assignedIds.includes(grupo.plan_mantenimiento_id)).length === 0 && (
                <p style={{ color: "red", fontSize: "14px" }}>
                  No hay grupos de mantenimiento disponibles para asignar.
                </p>
              )}
            </>
          )}

          <div className={styles.modalButtons}>
            <button type="submit" className={styles.saveButton}>
              Asignar
            </button>
            <button type="button" className={styles.cancelButton} onClick={cerrarModal}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalAgregarMantenimientoEjecutar;
