import React, { useState, useEffect } from 'react';
import styles from './OrdentrabajoInfo.module.css';
import { apiManager } from "../../api/apiManager";

// Función para obtener la fecha actual en hora de Bogotá y formatearla como "YYYY-MM-DD HH:MM:SS"
const formatFechaCierreColombiano = (date) => {
  // Convertir la fecha a la zona horaria de Bogotá
  const dtBogota = new Date(date).toLocaleString("en-US", { timeZone: "America/Bogota" });
  const localDate = new Date(dtBogota);
  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, '0');
  const day = String(localDate.getDate()).padStart(2, '0');
  const hours = String(localDate.getHours()).padStart(2, '0');
  const minutes = String(localDate.getMinutes()).padStart(2, '0');
  const seconds = String(localDate.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// Función para obtener solo la parte de la fecha en formato "yyyy-MM-dd" para el input date
const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  // Si el string contiene hora, separamos y tomamos solo la parte de la fecha
  return dateString.split(" ")[0];
};

const OrdentrabajoInfo = ({ data, onUpdate }) => {
  // Estados iniciales de cada campo
  const [estadoOT, setEstadoOT] = useState(data.ESTADO);
  const [estadoVehiculo, setEstadoVehiculo] = useState(data.estado_vehiculo);
  const [taller, setTaller] = useState(data.TALLER);
  const [responsablePago, setResponsablePago] = useState(data.RESPONSABLE_PAGO);
  const [oc, setOc] = useState(data.OC);
  const [fechaProgramada, setFechaProgramada] = useState(data.FECHA_PROGRAMADA);
  const [estadoAutorizacion, setEstadoAutorizacion] = useState(data.AUTORIZACION);
  
  // Estado para los contactos (lista de talleres y responsables)
  const [contactos, setContactos] = useState([]);

  // Estados para controlar los modales:
  // mostrarModalOpciones: muestra las opciones ("Editar OT" y "Remitir Aprobación")
  // mostrarModalEdicion: muestra el formulario de edición completo
  const [mostrarModalOpciones, setMostrarModalOpciones] = useState(false);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);

  useEffect(() => {
    // Cargar la lista de contactos al montar el componente
    const fetchContactos = async () => {
      try {
        const response = await apiManager.contactos();
        setContactos(response);
      } catch (error) {
        console.error("Error fetching contactos:", error);
      }
    };
    fetchContactos();
  }, []);

  // Función genérica para actualizar un campo
  const updateField = async (fieldName, value) => {
    const formData = new FormData();
    formData.append(fieldName, value);
    try {
      await apiManager.updateEstado(data.ID_OT, formData);
    } catch (error) {
      console.error(`Error al actualizar ${fieldName}:`, error);
    }
  };

  // Acción adicional si se cierra la OT
  const accionAdicionalCerrada = async () => {
    try {
      const response = await apiManager.realizarAccionCerrada(data.ID_OT);
      console.log("Acción adicional ejecutada para OT cerrada:", response);
    } catch (error) {
      console.error("Error ejecutando acción adicional para OT cerrada:", error);
    }
  };

  // Función para confirmar y enviar el formulario de edición
  const handleConfirmarFormulario = async (e) => {
    e.preventDefault();
    
    // Si se cambia el estado a "Cerrada", se ejecuta la acción adicional y se actualiza la fecha de cierre
    if (estadoOT === "Cerrada") {
      await accionAdicionalCerrada();
      const fechaCierreColombiana = formatFechaCierreColombiano(new Date());
      await updateField("FECHA_CIERRE", fechaCierreColombiana);
    }
    await updateField("ESTADO", estadoOT);
    await updateField("estado_vehiculo", estadoVehiculo);
    await updateField("ID_TALLER", taller);
    await updateField("ID_CLIENTE", responsablePago);
    await updateField("OC", oc);
    await updateField("FECHA_PROGRAMADA", fechaProgramada);

    if (onUpdate) onUpdate();
    setMostrarModalEdicion(false);
    setMostrarModalOpciones(false);
  };

// Función para remitir la autorización y actualizar la info mostrada
const handleRemitirAutorizacion = async () => {
  if (estadoAutorizacion !== "Sin Enviar") {
    alert("La autorización ya ha sido enviada o procesada.");
    return;
  }
  const nuevoEstado = "Enviada";
  setEstadoAutorizacion(nuevoEstado);
  await updateField("AUTORIZACION", nuevoEstado);
  if (onUpdate) onUpdate();
  setMostrarModalOpciones(false);
};


  // Función para ver la información del vehículo en otra pestaña
  const handleVerClick = () => {
    if (data && data.placa) {
      window.open(`/gestion/vehiculos/ver/${data.placa}`, '_blank');
    }
  };

  // Campos para mostrar la información de la OT
  const orderFields = [
    { label: "Fecha Orden", key: "FECHA_ORDEN" },
    { label: "Prioridad", key: "prioridad" },
    { label: "Odómetro", key: "odometro" },
    { label: "Estado Vehiculo", key: "estado_vehiculo" },
    { label: "Taller", key: "taller" },
    { label: "Fecha Programada", key: "FECHA_PROGRAMADA" },
    { label: "Responsable de Pago", key: "cliente" },
    { label: "Autorización", key: "AUTORIZACION" },
    { label: "OC", key: "OC" }
  ];

  // Función para obtener la clase según el estado de la OT
  const getEstadoClass = (estado) => {
    switch (estado) {
      case "Pendiente":
        return styles.pendiente;
      case "En Ejecucion":
        return styles.enEjecucion;
      case "Ejecutado":
        return styles.ejecutado;
      case "Cerrada":
        return styles.cerrada;
      case "Anulado":
        return styles.anulado;
      default:
        return "";
    }
  };

  if (!data) {
    return <div>Cargando información de la orden de trabajo...</div>;
  }

  return (
    <div className={styles['contenedor-info-vehiculo']}>
      <div className={styles['contenedor-info-contenido']}>
        <div className={styles.headerTop}>
          <div className={styles.invoiceNumber}>
            <button onClick={handleVerClick} className={styles.boton_editar1}>
              <i className="fas fa-eye"></i>
            </button>
            {data.placa} Orden trabajo # {data.ID_OT}{" "}
            - <span className={getEstadoClass(estadoOT)}>{estadoOT}</span> 
            <button 
              className={styles.moreOptionsButton} 
              onClick={() => setMostrarModalOpciones(true)}
            >
              <i className="fas fa-edit"></i> Editar
            </button>
          </div>
        </div>
        <div className={styles['contenedor-info-contenido-detalles']}>
          {orderFields.map(({ label, key }) => (
            <div className={styles['contenedor-info-contenido-detalles-item']} key={key}>
              <span>{label}</span>
              <span>
                {data[key] !== null && data[key] !== "" ? data[key] : 'Sin información'}
              </span>
            </div>
          ))}
        </div>
        <div>
          <div className={styles.observacion}>
            <span>Observación:</span>
            <p>{data.observacion}</p>
          </div>
        </div>
      </div>

      {/* Modal de opciones: Editar OT o Remitir Aprobación */}
      {mostrarModalOpciones && (
        <div className={styles.modalOverlay} onClick={() => setMostrarModalOpciones(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>Opciones</h2>
            <div className={styles.optionsContainer}>
              <button onClick={() => { setMostrarModalEdicion(true); }}>Editar OT</button>
              <button onClick={handleRemitirAutorizacion}>Remitir Aprobación</button>
            </div>
            <button className={styles.closeModalButton} onClick={() => setMostrarModalOpciones(false)}>
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Modal de edición completo */}
      {mostrarModalEdicion && (
        <div className={styles.modalOverlay} onClick={() => setMostrarModalEdicion(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleConfirmarFormulario} className={styles.formulario}>
              <div className={styles.formGroup}>
                <label>Estado OT:</label>
                <select value={estadoOT} onChange={(e) => setEstadoOT(e.target.value)}>
                  <option value="Pendiente">Pendiente</option>
                  <option value="En Ejecucion">En Ejecucion</option>
                  <option value="Ejecutado">Ejecutado</option>
                  <option value="Cerrada">Cerrada</option>
                  <option value="Anulado">Anulado</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Estado Vehículo:</label>
                <select value={estadoVehiculo} onChange={(e) => setEstadoVehiculo(e.target.value)}>
                  <option value="Operativo">Operativo</option>
                  <option value="Taller">Taller</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Taller:</label>
                <select value={taller} onChange={(e) => setTaller(e.target.value)}>
                  <option value="">Seleccionar</option>
                  {contactos.map((contacto) => (
                    <option key={contacto.ID_CONTACTOS} value={contacto.ID_CONTACTOS}>
                      {contacto.NOMBRE_COMPLETO}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Fecha Programada:</label>
                <input
                  type="date"
                  value={formatDateForInput(fechaProgramada)}
                  onChange={(e) => setFechaProgramada(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Responsable de Pago:</label>
                <select value={responsablePago} onChange={(e) => setResponsablePago(e.target.value)}>
                  <option value="">Seleccionar</option>
                  {contactos.map((contacto) => (
                    <option key={contacto.ID_CONTACTOS} value={contacto.ID_CONTACTOS}>
                      {contacto.NOMBRE_COMPLETO}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>OC:</label>
                <input
                  type="text"
                  value={oc}
                  onChange={(e) => setOc(e.target.value)}
                  placeholder="Ingrese OC"
                />
              </div>
              <div className={styles.modalButtons}>
                <button type="submit">Confirmar</button>
                <button type="button" onClick={() => setMostrarModalEdicion(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdentrabajoInfo;
