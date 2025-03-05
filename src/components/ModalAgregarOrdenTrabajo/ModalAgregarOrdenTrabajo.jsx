import React, { useState, useEffect, useRef } from "react";
import styles from "../../styles/ModalFormulario.module.css";
import { apiManager } from "../../api/apiManager";
import { useNavigate } from "react-router-dom";

// Componente de select personalizado con búsqueda interna
function CustomSelect({ options, value, onChange, placeholder = "Seleccione un vehículo..." }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleOptionClick = (option) => {
    onChange(option);
    setIsOpen(false);
    setSearch("");
  };

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          cursor: "pointer",
          padding: "8px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          background: "#fff",
        }}
      >
        {selectedOption ? selectedOption.label : placeholder}
      </div>
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 2px)",
            left: 0,
            right: 0,
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: "5px",
            zIndex: 1000,
          }}
        >
          <input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              boxSizing: "border-box",
              borderBottom: "1px solid #ccc",
            }}
          />
          <div style={{ maxHeight: "150px", overflowY: "auto" }}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleOptionClick(option)}
                  style={{ padding: "8px", cursor: "pointer" }}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div style={{ padding: "8px" }}>No se encontraron opciones</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

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
    fecha_creacion: defaultDateTime, // Fecha y hora en Colombia
  });

  // Estado para almacenar la lista de vehículos consultados desde la API
  const [vehiculos, setVehiculos] = useState([]);

  // Consultar vehículos al montar el componente
  useEffect(() => {
    const obtenerVehiculos = async () => {
      try {
        const response = await apiManager.vehiculos();
        setVehiculos(response);
      } catch (error) {
        console.error("Error al obtener vehículos:", error);
      }
    };

    obtenerVehiculos();
  }, []);

  // Crear las opciones para el select personalizado
  const optionsVehiculos = vehiculos.map((vehiculo) => ({
    value: vehiculo.id_vehiculo,
    label: vehiculo.placa,
  }));

  // Manejo de cambios en los inputs tradicionales
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setNuevoOrdenTrabajo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Manejo del envío del formulario.
  const manejarEnvio = async (e) => {
    e.preventDefault();

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
        console.error("Error al agregar la orden de trabajo:", response.error);
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

  // Cerrar el modal al hacer clic fuera de él
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
          <CustomSelect
            options={optionsVehiculos}
            value={nuevoOrdenTrabajo.id_vehiculo}
            onChange={(option) =>
              setNuevoOrdenTrabajo((prevState) => ({
                ...prevState,
                id_vehiculo: option.value,
                placa: option.label,
              }))
            }
            placeholder="Seleccione un vehículo..."
          />

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

          <label htmlFor="lectura">Odometro</label>
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
