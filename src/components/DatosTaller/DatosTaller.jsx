import React, { useState } from "react";
import "./DatosTaller.css";

const DatosTaller = () => {
  // Datos estáticos iniciales
  const [tallerSeleccionado, setTallerSeleccionado] = useState("");
  const [responsableSeleccionado, setResponsableSeleccionado] = useState("");

  // Listas de ejemplo para los select
  const talleresDisponibles = [
    { id: 1, nombre: "ALFREDO D.D RECTIFICADORA" },
    { id: 2, nombre: "Taller Mecánico La 45" },
    { id: 3, nombre: "Rectificadora El Progreso" },
  ];

  const responsablesPago = [
    { id: 1, nombre: "PROYECTOS Y SERVICIOS HANXA" },
    { id: 2, nombre: "SERVICIOS INDUSTRIALES LTDA" },
    { id: 3, nombre: "CLIENTE DIRECTO" },
  ];

  // Manejadores de cambio en los select
  const handleChangeTaller = (e) => {
    setTallerSeleccionado(e.target.value);
  };

  const handleChangeResponsable = (e) => {
    setResponsableSeleccionado(e.target.value);
  };

  // Ejemplo de acciones al hacer clic en los botones
  const handleRemitirAprobacion = () => {
    alert("Aprobación remitida");
  };

  const handleCrear = () => {
    alert("Creado correctamente");
  };

  const handleAsignar = () => {
    alert(
      `Taller asignado: ${tallerSeleccionado}\nResponsable de pago: ${responsableSeleccionado}`
    );
  };

  return (
    <div className="datos-taller-card">
      <h2>
        <i className="fa fa-wrench" aria-hidden="true"></i> Datos Taller
      </h2>

      {/* Sección de datos del taller */}
      <div className="datos-taller-seccion">
        <div className="dato">
          <span className="dato-label">Razón Social:</span>
          <span className="dato-valor">
            ALFREDO D.D RECTIFICADORA DE MOTORES DIESEL Y
          </span>
        </div>
        <div className="dato">
          <span className="dato-label">Teléfono - Correo:</span>
          <span className="dato-valor">
            3011574954 - delarosadiazalfredo21@gmail.com
          </span>
        </div>
        <div className="dato">
          <span className="dato-label">Dirección:</span>
          <span className="dato-valor">CARRERA 36# 42-66</span>
        </div>
        <div className="dato">
          <span className="dato-label">Ubicación:</span>
          <span className="dato-valor">BARRANQUILLA</span>
        </div>
        <div className="dato">
          <span className="dato-label">Contacto:</span>
          <span className="dato-valor">3011574954</span>
        </div>
        <div className="dato">
          <span className="dato-label">Método pago:</span>
          <span className="dato-valor">INMEDIATO</span>
        </div>
        <div className="dato">
          <span className="dato-label">Referenciado por:</span>
          <span className="dato-valor">FACTORY INTEGRATE SAS</span>
        </div>
      </div>

      {/* Sección de asignación */}
      <div className="asignacion-container">
        <div className="select-container">
          <label htmlFor="taller-select">Asignar Taller:</label>
          <select
            id="taller-select"
            value={tallerSeleccionado}
            onChange={handleChangeTaller}
          >
            <option value="">-- Seleccionar --</option>
            {talleresDisponibles.map((t) => (
              <option key={t.id} value={t.nombre}>
                {t.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="select-container">
          <label htmlFor="responsable-select">Responsable Pago:</label>
          <select
            id="responsable-select"
            value={responsableSeleccionado}
            onChange={handleChangeResponsable}
          >
            <option value="">-- Seleccionar --</option>
            {responsablesPago.map((r) => (
              <option key={r.id} value={r.nombre}>
                {r.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sección de cita asignada */}
      <h3>
        <i className="fa fa-calendar" aria-hidden="true"></i> Cita asignada
      </h3>
      <div className="cita-asignada">
        <div className="dato">
          <span className="dato-label">Fecha y hora:</span>
          <span className="dato-valor">2024-12-12 12:15:00</span>
        </div>
      </div>

      {/* Botones de acciones */}
      <div className="botones-acciones">
        <button className="btn-aprobacion" onClick={handleRemitirAprobacion}>
          <i className="fa fa-paper-plane" aria-hidden="true"></i> Remitir aprobación
        </button>
        <button className="btn-crear" onClick={handleCrear}>
          <i className="fa fa-plus" aria-hidden="true"></i> Crear
        </button>
        <button className="btn-asignar" onClick={handleAsignar}>
          <i className="fa fa-check" aria-hidden="true"></i> Asignar
        </button>
      </div>
    </div>
  );
};

export default DatosTaller;
