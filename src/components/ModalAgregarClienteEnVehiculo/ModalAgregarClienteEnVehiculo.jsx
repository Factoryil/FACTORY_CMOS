import React, { useState, useEffect } from "react";
import styles from "../../styles/ModalFormulario2.module.css"; // Asegúrate de tener este archivo CSS configurado
import { apiManager } from "../../api/apiManager";

function ModalAgregarClienteEnVehiculo({ cerrarModal, vehiculoId, onUpdate }) {
  
  // Opciones disponibles
  const estadosDisponibles = [
    { value: "Actual", label: "Actual" },
    { value: "Renovado", label: "Renovado" },
  ];
  const periodosDisponibles = [
    { value: "Día", label: "Día" },
    { value: "Mes", label: "Mes" },
    { value: "Año", label: "Año" },
  ];

  // Estado general del formulario
  const [nuevoRegistro, setNuevoRegistro] = useState({
    ID_VEHICULO: "",
    ID_CONTRATO: "",
    FECHA_EMISION: "",
    FECHA_VENCIMIENTO: "",
    PERIODO: "Mes",
    VALOR: "",
    ESTADO: "Actual",
    ID_CLIENTE: ""
  });

  const [contactos, setContactos] = useState([]);
  const [activeContracts, setActiveContracts] = useState([]);
  const [pdf, setPdf] = useState(null);

  // Paso actual del formulario
  const [currentStep, setCurrentStep] = useState(0);

  // Definición de los pasos y campos a mostrar en cada uno
  const steps = [
    {
      title: "Cliente y Contrato",
      fields: ["ID_CLIENTE", , "ID_CONTRATO"],
    },
    {
      title: "Fechas, Período y Valor",
      fields: ["FECHA_EMISION", "FECHA_VENCIMIENTO", "PERIODO", "VALOR"],
    },
    {
      title: "PDF y Estado",
      fields: ["PDF", "ESTADO"],
    },
  ];

  // Prellenar la placa con vehiculoId recibido por props
  useEffect(() => {
    if (vehiculoId) {
      setNuevoRegistro((prev) => ({ ...prev, ID_VEHICULO: vehiculoId }));
    }
  }, [vehiculoId]);

  // Obtener la lista de contactos
  useEffect(() => {
    const obtenerContactos = async () => {
      try {
        const response = await apiManager.contactos();
        console.log(response);
        setContactos(response);
      } catch (error) {
        console.error("Error al obtener contactos:", error);
      }
    };
    obtenerContactos();
  }, []);

  // Consultar contratos activos para el cliente seleccionado (ID_CLIENTE)
  useEffect(() => {
    const fetchContracts = async () => {
      if (nuevoRegistro.ID_CLIENTE) {
        try {
          const response = await apiManager.getContratosActualesID(nuevoRegistro.ID_CLIENTE);
          setActiveContracts(response);
        } catch (error) {
          console.error("Error al obtener contratos activos:", error);
          setActiveContracts([]);
        }
      } else {
        setActiveContracts([]);
      }
    };
    fetchContracts();
  }, [nuevoRegistro.ID_CLIENTE]);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setNuevoRegistro((prev) => ({ ...prev, [name]: value }));
  };

  const manejarCambioPdf = (e) => {
    if (e.target.files && e.target.files[0]) setPdf(e.target.files[0]);
  };

  // Función para renderizar el input según el campo
  const renderInput = (field) => {
    switch (field) {
      case "ID_CLIENTE":
        return (
          <select
            id="ID_CLIENTE"
            name="ID_CLIENTE"
            value={nuevoRegistro.ID_CLIENTE}
            onChange={manejarCambio}
            required
            className={styles.input}
          >
            <option value="">Seleccione un cliente</option>
            {contactos.map((contacto) => (
              <option key={contacto.ID_CONTACTOS} value={contacto.ID_CONTACTOS}>
                {contacto.NOMBRE_COMPLETO}
              </option>
            ))}
          </select>
        );
      case "ID_CONTRATO":
        return (
          <select
            id="ID_CONTRATO"
            name="ID_CONTRATO"
            value={nuevoRegistro.ID_CONTRATO}
            onChange={manejarCambio}
            className={styles.input}
          >
            <option value="">-- Ninguno --</option>
            {activeContracts.map((contrato) => (
              <option key={contrato.ID_CONTRATO} value={contrato.ID_CONTRATO}>
                {contrato.NUMERO_CONTRATO} - {contrato.SUBDIVICION}
              </option>
            ))}
          </select>
        );
      case "FECHA_EMISION":
      case "FECHA_VENCIMIENTO":
        return (
          <input
            type="date"
            id={field}
            name={field}
            value={nuevoRegistro[field]}
            onChange={manejarCambio}
            required
            className={styles.input}
          />
        );
      case "PERIODO":
        return (
          <select
            id="PERIODO"
            name="PERIODO"
            value={nuevoRegistro.PERIODO}
            onChange={manejarCambio}
            required
            className={styles.input}
          >
            {periodosDisponibles.map((periodo) => (
              <option key={periodo.value} value={periodo.value}>
                {periodo.label}
              </option>
            ))}
          </select>
        );
      case "VALOR":
        return (
          <input
            type="number"
            id="VALOR"
            name="VALOR"
            value={nuevoRegistro.VALOR}
            onChange={manejarCambio}
            required
            step="0.01"
            className={styles.input}
          />
        );
      case "PDF":
        return (
          <input
            type="file"
            id="URL_PDF"
            name="URL_PDF"
            accept="application/pdf"
            onChange={manejarCambioPdf}
            className={styles.input}
          />
        );
      case "ESTADO":
        return (
          <select
            id="ESTADO"
            name="ESTADO"
            value={nuevoRegistro.ESTADO}
            onChange={manejarCambio}
            required
            className={styles.input}
          >
            {estadosDisponibles.map((estado) => (
              <option key={estado.value} value={estado.value}>
                {estado.label}
              </option>
            ))}
          </select>
        );
      default:
        return null;
    }
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    // Si no estamos en el último paso, avanzamos al siguiente
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      return;
    }
    // Armamos el formData para el envío
    const formData = new FormData();
    formData.append("PLACA", nuevoRegistro.ID_VEHICULO);
    formData.append("ID_CLIENTE", nuevoRegistro.ID_CLIENTE);
    formData.append("FECHA_EMISION", nuevoRegistro.FECHA_EMISION);
    formData.append("FECHA_VENCIMIENTO", nuevoRegistro.FECHA_VENCIMIENTO);
    formData.append("PERIODO", nuevoRegistro.PERIODO);
    formData.append("VALOR", nuevoRegistro.VALOR);
    if (nuevoRegistro.ID_CONTRATO) {
      formData.append("ID_CONTRATO", nuevoRegistro.ID_CONTRATO);
    }
    if (pdf) formData.append("URL_PDF", pdf);
    formData.append("ESTADO", nuevoRegistro.ESTADO);

    try {
      const response = await apiManager.addCliente(formData);
      console.log("Cliente asignado:", response);
      cerrarModal();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error al asignar cliente:", error);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleModalClick = (e) => {
    if (e.target === e.currentTarget) cerrarModal();
  };

  return (
    <div className={styles.modalOverlay} onClick={handleModalClick}>
      <div className={styles.modalContainer}>
        <h2 className={styles.title}>Agregar Cliente</h2>
        <form onSubmit={manejarEnvio} className={styles.form}>
          <h3 className={styles.stepTitle}>{steps[currentStep].title}</h3>
          <div className={styles.formStep}>
            {steps[currentStep].fields.map((field) => (
              <div key={field} className={styles.inputGroup}>
                <label htmlFor={field} className={styles.label}>
                  {field === "ID_VEHICULO"
                    ? "Placa"
                    : field === "ID_CONTRATO"
                    ? "Contrato"
                    : field === "ID_CLIENTE"
                    ? "Cliente"
                    : field}
                </label>
                {renderInput(field)}
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

export default ModalAgregarClienteEnVehiculo;
