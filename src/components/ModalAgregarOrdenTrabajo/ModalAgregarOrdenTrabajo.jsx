import React, { useState, useEffect } from "react";
import styles from "../../styles/ModalFormulario.module.css";
import { apiManager } from "../../api/apiManager";
import { useNavigate } from "react-router-dom";

// Función para obtener la fecha y hora actual en hora colombiana (America/Bogota)
function obtenerFechaColombiana() {
  
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "America/Bogota",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = formatter.formatToParts(now);
  let year, month, day, hour, minute;
  parts.forEach((part) => {
    switch (part.type) {
      case "year":
        year = part.value;
        break;
      case "month":
        month = part.value;
        break;
      case "day":
        day = part.value;
        break;
      case "hour":
        hour = part.value;
        break;
      case "minute":
        minute = part.value;
        break;
      default:
        break;
    }
  });
  return `${year}-${month}-${day}T${hour}:${minute}`;
}

function ModalAgregarOrdenTrabajo({ cerrarModal }) {
  const navigate = useNavigate();

  const defaultDateTime = obtenerFechaColombiana();

  // Estado para almacenar los datos del nuevo registro de orden de trabajo.
  const [nuevoOrdenTrabajo, setNuevoOrdenTrabajo] = useState({
    id_vehiculo: "",
    placa: "",
    prioridad: "Media",
    observacion: "",
    lectura: "",
    estado_vehiculo: "Operativo", // Valor por defecto "Operativo"
    fecha_creacion: defaultDateTime, // Valor por defecto: fecha y hora en Colombia
  });

  // Estado para almacenar la lista de vehículos consultados desde la API
  const [vehiculos, setVehiculos] = useState([]);

  // Consultar vehículos al montar el componente
  useEffect(() => {
    const obtenerVehiculos = async () => {
      try {
        const response = await apiManager.vehiculos();
        console.log(response);
        setVehiculos(response);
      } catch (error) {
        console.error("Error al obtener vehículos:", error);
      }
    };

    obtenerVehiculos();
  }, []);

  // Manejo de cambios en los inputs
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    // Si el campo es id_vehiculo, buscamos la placa correspondiente
    if (name === "id_vehiculo") {
      const vehiculoSeleccionado = vehiculos.find(
        (vehiculo) => vehiculo.id_vehiculo.toString() === value
      );
      setNuevoOrdenTrabajo((prevState) => ({
        ...prevState,
        id_vehiculo: value,
        placa: vehiculoSeleccionado ? vehiculoSeleccionado.placa : "",
      }));
    } else {
      setNuevoOrdenTrabajo((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  // Manejo del envío del formulario.
  const manejarEnvio = async (e) => {
    e.preventDefault();

    // Validar campos requeridos.
    if (
      !nuevoOrdenTrabajo.observacion ||
      !nuevoOrdenTrabajo.id_vehiculo ||
      !nuevoOrdenTrabajo.prioridad ||
      !nuevoOrdenTrabajo.fecha_creacion ||
      !nuevoOrdenTrabajo.lectura ||
      !nuevoOrdenTrabajo.estado_vehiculo
    ) {
      alert("Por favor, completa todos los campos requeridos.");
      return;
    }

    // Utilizamos FormData para enviar los datos
    const formData = new FormData();
    formData.append("id_vehiculo", nuevoOrdenTrabajo.id_vehiculo);
    formData.append("placa", nuevoOrdenTrabajo.placa);
    formData.append("observacion", nuevoOrdenTrabajo.observacion);
    formData.append("prioridad", nuevoOrdenTrabajo.prioridad);
    formData.append("FECHA_ORDEN", nuevoOrdenTrabajo.fecha_creacion);
    formData.append("ODOMETRO", nuevoOrdenTrabajo.lectura);
    formData.append("estado_vehiculo", nuevoOrdenTrabajo.estado_vehiculo);

    try {
      const response = await apiManager.addOrdenTrabajo(formData);

      if (response.error) {
        console.error("Error al agregar el ot:", response.error);
        return;
      }

      if (response.id) {
        navigate(`/gestion/trabajos/ordenes-trabajo/ver/${response.id}`);
      }
      

      cerrarModal();
    } catch (error) {
      console.error("Error al agregar registro de orden de trabajo:", error);
    }
  };

  // Permite cerrar el modal si se hace clic fuera de la caja del modal.
  const manejarCerrarModal = (e) => {
    if (e.target === e.currentTarget) {
      cerrarModal();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={manejarCerrarModal}>
      <div className={styles.modal}>
        <h2>Agregar Orden de Trabajo</h2>
        <form onSubmit={manejarEnvio}>
          <label htmlFor="id_vehiculo">Vehículo</label>
          <select
            id="id_vehiculo"
            name="id_vehiculo"
            value={nuevoOrdenTrabajo.id_vehiculo}
            onChange={manejarCambio}
            required
          >
            <option value="">Seleccione un vehículo</option>
            {vehiculos.map((vehiculo) => (
              <option key={vehiculo.id_vehiculo} value={vehiculo.id_vehiculo}>
                {vehiculo.placa}
              </option>
            ))}
          </select>

          <label htmlFor="prioridad">Prioridad</label>
          <select
            id="prioridad"
            name="prioridad"
            value={nuevoOrdenTrabajo.prioridad}
            onChange={manejarCambio}
            required
          >
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </select>

          <label htmlFor="fecha_creacion">Fecha y Hora</label>
          <input
            type="datetime-local"
            id="fecha_creacion"
            name="fecha_creacion"
            value={nuevoOrdenTrabajo.fecha_creacion}
            onChange={manejarCambio}
            required
          />

          <label htmlFor="lectura">Lectura</label>
          <input
            type="number"
            id="lectura"
            name="lectura"
            value={nuevoOrdenTrabajo.lectura}
            onChange={manejarCambio}
            required
          />

          <label htmlFor="observacion">Observación</label>
          <textarea
            className={styles.texarean1}
            id="observacion"
            name="observacion"
            value={nuevoOrdenTrabajo.observacion}
            onChange={manejarCambio}
            required
          />

          <label htmlFor="estado_vehiculo">Estado del Vehículo</label>
          <select
            id="estado_vehiculo"
            name="estado_vehiculo"
            value={nuevoOrdenTrabajo.estado_vehiculo}
            onChange={manejarCambio}
            required
          >
            <option value="Operativo">Operativo</option>
            <option value="Taller">Taller</option>
          </select>

          <div className={styles.modalButtons}>
            <button type="submit" className={styles.saveButton}>
              Guardar
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

export default ModalAgregarOrdenTrabajo;
