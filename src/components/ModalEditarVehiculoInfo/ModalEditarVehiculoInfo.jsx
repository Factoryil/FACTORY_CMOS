import React, { useState } from "react";
import styles from "./ModalFormulario.module.css";
import { apiManager } from "../../api/apiManager";

function ModalEditarVehiculoInfo({ cerrarModal, vehiculoData, onUpdate = () => {} }) {
  const [formData, setFormData] = useState({
    placa: vehiculoData?.placa || "",
    licencia_transito: vehiculoData?.licencia_transito || "",
    propietario: vehiculoData?.propietario || "",
    tipo_identificacion: vehiculoData?.tipo_identificacion || "",
    identificacion: vehiculoData?.identificacion || "",
    marca: vehiculoData?.marca || "",
    linea: vehiculoData?.linea || "",
    modelo: vehiculoData?.modelo || "",
    color: vehiculoData?.color || "",
    servicio: vehiculoData?.servicio || "",
    clase_vehiculo: vehiculoData?.clase_vehiculo || "",
    tipo_carroceria: vehiculoData?.tipo_carroceria || "",
    combustible: vehiculoData?.combustible || "",
    cilindrada_cc: vehiculoData?.cilindrada_cc || "",
    capacidad: vehiculoData?.capacidad || "",
    numero_motor: vehiculoData?.numero_motor || "",
    vin: vehiculoData?.vin || "",
    numero_chasis: vehiculoData?.numero_chasis || "",
    puertas: vehiculoData?.puertas || "",
    fecha_expedicion: vehiculoData?.fecha_expedicion || "",
    fecha_matricula: vehiculoData?.fecha_matricula || "",
    organismo_transito: vehiculoData?.organismo_transito || ""
  });

  // Opciones para el campo tipo_identificacion
  const tipoIdentificacionOptions = [
    "Cédula de Ciudadanía",
    "NIT",
    "Cédula de Extranjería",
    "Pasaporte"
  ];

  // Definimos los pasos y los campos que se mostrarán en cada uno
  const steps = [
    {
      title: "Información Básica",
      fields: ["placa", "licencia_transito", "propietario", "tipo_identificacion", "identificacion"]
    },
    {
      title: "Características del Vehículo",
      fields: ["marca", "linea", "modelo", "color", "servicio", "clase_vehiculo", "tipo_carroceria", "combustible"]
    },
    {
      title: "Detalles Técnicos",
      fields: ["cilindrada_cc", "capacidad", "numero_motor", "vin", "numero_chasis", "puertas", "fecha_expedicion", "fecha_matricula", "organismo_transito"]
    }
  ];

  const [currentStep, setCurrentStep] = useState(0);

  const manejarCambio = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    // Si aún no es el último paso, avanzamos al siguiente
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      return;
    }
    try {
      const formBody = new FormData();
      Object.keys(formData).forEach((key) => {
        // Solo agregamos el campo si tiene información (después de eliminar espacios)
        if (formData[key] && formData[key].toString().trim() !== "") {
          formBody.append(key, formData[key]);
        }
      }); 
      
      
      await apiManager.editVehiculoInfo(vehiculoData.placa, formBody);
      onUpdate();
      cerrarModal();
    } catch (error) {
      console.error("Error al actualizar el vehículo:", error);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Renderizamos el input correspondiente según el campo
  const renderInput = (key) => {
    // Para campos de fecha usamos input type "date"
    if (key === "fecha_expedicion" || key === "fecha_matricula") {
      return (
        <input
          type="date"
          id={key}
          name={key}
          value={formData[key]}
          onChange={manejarCambio}
          className={styles.input}
        />
      );
    }
    // Para el campo de tipo de identificación usamos un select
    if (key === "tipo_identificacion") {
      return (
        <select
          id={key}
          name={key}
          value={formData[key]}
          onChange={manejarCambio}
          className={styles.input}
        >
          <option value="">Seleccione...</option>
          {tipoIdentificacionOptions.map((opcion, index) => (
            <option key={index} value={opcion}>
              {opcion}
            </option>
          ))}
        </select>
      );
    }
    // Para el resto de los campos se usa input type "text"
    return (
      <input
        type="text"
        id={key}
        name={key}
        value={formData[key]}
        onChange={manejarCambio}
        className={styles.input}
      />
    );
  };

  return (
    <div className={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && cerrarModal()}>
      <div className={styles.modalContainer}>
        <h2 className={styles.title}>Editar Información del Vehículo</h2>
        <form onSubmit={manejarEnvio} className={styles.form}>
          <h3 className={styles.stepTitle}>{steps[currentStep].title}</h3>
          <div className={styles.formStep}>
            {steps[currentStep].fields.map((key) => (
              <div key={key} className={styles.inputGroup}>
                <label htmlFor={key} className={styles.label}>
                  {key.replace(/_/g, " ").toUpperCase()}
                </label>
                {renderInput(key)}
              </div>
            ))}
          </div>
          <div className={styles.buttonGroup}>
            {currentStep > 0 && (
              <button type="button" className={styles.prevButton} onClick={handlePrevStep}>
                Anterior
              </button>
            )}
            <button type="submit" className={styles.nextButton}>
              {currentStep === steps.length - 1 ? "Guardar" : "Siguiente"}
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

export default ModalEditarVehiculoInfo;
