import React, { useRef, useState, useEffect } from "react";
import html2pdf from "html2pdf.js";
import styles from "./InspeccionCompletaVehiculos.module.css";

// Simulated data - in a real app, this would come from an API
const vehiclesData = [
  {
    placa: "ABC-123",
    modelo: "Civic",
    marca: "Honda",
    anio: "2020",
    cliente: {
      nombre: "Juan Perez",
      cedula: "123456789",
      telefono: "3001112233",
      direccion: "Calle 10 # 5-15",
    },
  },
  {
    placa: "XYZ-789",
    modelo: "Corolla",
    marca: "Toyota",
    anio: "2022",
    cliente: {
      nombre: "Maria Garcia",
      cedula: "987654321",
      telefono: "3104445566",
      direccion: "Carrera 20 # 8-20",
    },
  },
  {
    placa: "DEF-456",
    modelo: "Mustang",
    marca: "Ford",
    anio: "1969",
    cliente: {
      nombre: "Pedro Rodriguez",
      cedula: "112233445",
      telefono: "3207778899",
      direccion: "Avenida 30 # 12-30",
    },
  },
];

const InspeccionCompletaVehiculos = () => {
  const [formData, setFormData] = useState({
    // Datos del vehículo
    placa: "",
    modelo: "",
    marca: "",
    anio: "",
    // Datos del cliente
    nombreCliente: "",
    cedulaCliente: "",
    telefonoCliente: "",
    direccionCliente: "",
    // Datos de inspección
    fechaInspeccion: "",
    inspector: "",
    // Sección Mecánica (radio: Bien, Regular, Mal; escala 1-5 o comentarios)
    frenos: "",
    motor: "",
    nivelAceite: "",
    sistemaEscape: "",
    sistemaTransmision: "",
    // Sección Exterior
    llantas: "",
    parabrisas: "",
    espejos: "",
    faros: "",
    pintura: "",
    // Sección Interior
    asientos: "",
    tapiceria: "",
    panelInstrumentos: "",
    aireAcondicionado: "",
    sistemaSonido: "",
    // Sección Seguridad
    cinturones: "",
    airbags: "",
    alarmas: "",
    // Evidencias (URL o descripción de fotos)
    evidencias: "",
    // Observaciones generales
    observaciones: "",
  });

  const contentRef = useRef();

  // Function to update a specific field in formData
  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle vehicle selection
  const handleVehicleSelect = (e) => {
    const selectedPlaca = e.target.value;
    const selectedVehicle = vehiclesData.find(
      (vehicle) => vehicle.placa === selectedPlaca
    );

    if (selectedVehicle) {
      setFormData((prev) => ({
        ...prev,
        placa: selectedVehicle.placa,
        modelo: selectedVehicle.modelo,
        marca: selectedVehicle.marca,
        anio: selectedVehicle.anio,
        nombreCliente: selectedVehicle.cliente.nombre,
        cedulaCliente: selectedVehicle.cliente.cedula,
        telefonoCliente: selectedVehicle.cliente.telefono,
        direccionCliente: selectedVehicle.cliente.direccion,
      }));
    } else {
      // Clear vehicle and client data if no vehicle is selected (e.g., "Seleccione un vehículo")
      setFormData((prev) => ({
        ...prev,
        placa: "",
        modelo: "",
        marca: "",
        anio: "",
        nombreCliente: "",
        cedulaCliente: "",
        telefonoCliente: "",
        direccionCliente: "",
      }));
    }
  };

  // Function to generate the PDF
  const handlePrint = async () => {
    const content = contentRef.current;
    const originalTransform = content.style.transform;
    // Make content visible (remove transform)
    content.style.transform = "none";
    const opt = {
      margin: 0.2,
      filename: `inspeccion_vehiculo_${formData.placa}.pdf`, // Dynamic filename
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    await html2pdf().set(opt).from(content).save();
    content.style.transform = originalTransform;
  };

  return (
    <div className={styles["container-root"]}>
      <h1 className={styles["form-title"]}>Inspección Completa de Vehículo</h1>
      <form className={styles["inspeccion-form"]}>
        {/* Selector de Vehículo */}
        <fieldset className={styles["form-fieldset"]}>
          <legend className={styles["form-legend"]}>Selección de Vehículo</legend>
          <div className={styles["form-group"]}>
            <label className={styles["form-label"]}>
              Seleccionar Placa:
              <select
                className={styles["input-field"]}
                value={formData.placa}
                onChange={handleVehicleSelect}
              >
                <option value="">-- Seleccione un vehículo --</option>
                {vehiclesData.map((vehicle) => (
                  <option key={vehicle.placa} value={vehicle.placa}>
                    {vehicle.placa}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </fieldset>

        {/* Datos del vehículo */}
        <fieldset className={styles["form-fieldset"]}>
          <legend className={styles["form-legend"]}>Datos del Vehículo</legend>
          <div className={styles["form-group"]}>
            <label className={styles["form-label"]}>
              Placa:
              <input
                type="text"
                className={styles["input-field"]}
                value={formData.placa}
                readOnly // Make it read-only as it's selected
              />
            </label>
            <label className={styles["form-label"]}>
              Modelo:
              <input
                type="text"
                className={styles["input-field"]}
                value={formData.modelo}
                readOnly // Make it read-only
              />
            </label>
            <label className={styles["form-label"]}>
              Marca:
              <input
                type="text"
                className={styles["input-field"]}
                value={formData.marca}
                readOnly // Make it read-only
              />
            </label>
            <label className={styles["form-label"]}>
              Año:
              <input
                type="text"
                className={styles["input-field"]}
                value={formData.anio}
                readOnly // Make it read-only
              />
            </label>
          </div>
        </fieldset>

        {/* Datos del Cliente */}
        <fieldset className={styles["form-fieldset"]}>
          <legend className={styles["form-legend"]}>Datos del Cliente</legend>
          <div className={styles["form-group"]}>
            <label className={styles["form-label"]}>
              Nombre:
              <input
                type="text"
                className={styles["input-field"]}
                value={formData.nombreCliente}
                readOnly
              />
            </label>
            <label className={styles["form-label"]}>
              Cédula:
              <input
                type="text"
                className={styles["input-field"]}
                value={formData.cedulaCliente}
                readOnly
              />
            </label>
            <label className={styles["form-label"]}>
              Teléfono:
              <input
                type="text"
                className={styles["input-field"]}
                value={formData.telefonoCliente}
                readOnly
              />
            </label>
            <label className={styles["form-label"]}>
              Dirección:
              <input
                type="text"
                className={styles["input-field"]}
                value={formData.direccionCliente}
                readOnly
              />
            </label>
          </div>
        </fieldset>

        {/* Datos de inspección */}
        <fieldset className={styles["form-fieldset"]}>
          <legend className={styles["form-legend"]}>Datos de Inspección</legend>
          <div className={styles["form-group"]}>
            <label className={styles["form-label"]}>
              Fecha de Inspección:
              <input
                type="date"
                className={styles["input-field"]}
                value={formData.fechaInspeccion}
                onChange={(e) => updateField("fechaInspeccion", e.target.value)}
              />
            </label>
            <label className={styles["form-label"]}>
              Inspector:
              <input
                type="text"
                className={styles["input-field"]}
                value={formData.inspector}
                onChange={(e) => updateField("inspector", e.target.value)}
              />
            </label>
          </div>
        </fieldset>

        {/* Sección Mecánica */}
        <fieldset className={styles["form-fieldset"]}>
          <legend className={styles["form-legend"]}>Inspección Mecánica</legend>
          <div className={styles["form-group"]}>
            <label className={styles["form-label"]}>
              Frenos:
              <div className={styles["radio-group"]}>
                <label>
                  <input
                    type="radio"
                    name="frenos"
                    value="Bien"
                    checked={formData.frenos === "Bien"}
                    onChange={(e) => updateField("frenos", e.target.value)}
                  />
                  Bien
                </label>
                <label>
                  <input
                    type="radio"
                    name="frenos"
                    value="Regular"
                    checked={formData.frenos === "Regular"}
                    onChange={(e) => updateField("frenos", e.target.value)}
                  />
                  Regular
                </label>
                <label>
                  <input
                    type="radio"
                    name="frenos"
                    value="Mal"
                    checked={formData.frenos === "Mal"}
                    onChange={(e) => updateField("frenos", e.target.value)}
                  />
                  Mal
                </label>
              </div>
            </label>
            <label className={styles["form-label"]}>
              Motor:
              <div className={styles["radio-group"]}>
                <label>
                  <input
                    type="radio"
                    name="motor"
                    value="Bien"
                    checked={formData.motor === "Bien"}
                    onChange={(e) => updateField("motor", e.target.value)}
                  />
                  Bien
                </label>
                <label>
                  <input
                    type="radio"
                    name="motor"
                    value="Regular"
                    checked={formData.motor === "Regular"}
                    onChange={(e) => updateField("motor", e.target.value)}
                  />
                  Regular
                </label>
                <label>
                  <input
                    type="radio"
                    name="motor"
                    value="Mal"
                    checked={formData.motor === "Mal"}
                    onChange={(e) => updateField("motor", e.target.value)}
                  />
                  Mal
                </label>
              </div>
            </label>
            <label className={styles["form-label"]}>
              Nivel de Aceite:
              <div className={styles["radio-group"]}>
                <label>
                  <input
                    type="radio"
                    name="nivelAceite"
                    value="1"
                    checked={formData.nivelAceite === "1"}
                    onChange={(e) => updateField("nivelAceite", e.target.value)}
                  />
                  1
                </label>
                <label>
                  <input
                    type="radio"
                    name="nivelAceite"
                    value="2"
                    checked={formData.nivelAceite === "2"}
                    onChange={(e) => updateField("nivelAceite", e.target.value)}
                  />
                  2
                </label>
                <label>
                  <input
                    type="radio"
                    name="nivelAceite"
                    value="3"
                    checked={formData.nivelAceite === "3"}
                    onChange={(e) => updateField("nivelAceite", e.target.value)}
                  />
                  3
                </label>
                <label>
                  <input
                    type="radio"
                    name="nivelAceite"
                    value="4"
                    checked={formData.nivelAceite === "4"}
                    onChange={(e) => updateField("nivelAceite", e.target.value)}
                  />
                  4
                </label>
                <label>
                  <input
                    type="radio"
                    name="nivelAceite"
                    value="5"
                    checked={formData.nivelAceite === "5"}
                    onChange={(e) => updateField("nivelAceite", e.target.value)}
                  />
                  5
                </label>
              </div>
            </label>
            <label className={styles["form-label"]}>
              Sistema de Escape:
              <div className={styles["radio-group"]}>
                <label>
                  <input
                    type="radio"
                    name="sistemaEscape"
                    value="Bien"
                    checked={formData.sistemaEscape === "Bien"}
                    onChange={(e) => updateField("sistemaEscape", e.target.value)}
                  />
                  Bien
                </label>
                <label>
                  <input
                    type="radio"
                    name="sistemaEscape"
                    value="Regular"
                    checked={formData.sistemaEscape === "Regular"}
                    onChange={(e) => updateField("sistemaEscape", e.target.value)}
                  />
                  Regular
                </label>
                <label>
                  <input
                    type="radio"
                    name="sistemaEscape"
                    value="Mal"
                    checked={formData.sistemaEscape === "Mal"}
                    onChange={(e) => updateField("sistemaEscape", e.target.value)}
                  />
                  Mal
                </label>
              </div>
            </label>
            <label className={styles["form-label"]}>
              Sistema de Transmisión:
              <div className={styles["radio-group"]}>
                <label>
                  <input
                    type="radio"
                    name="sistemaTransmision"
                    value="Bien"
                    checked={formData.sistemaTransmision === "Bien"}
                    onChange={(e) => updateField("sistemaTransmision", e.target.value)}
                  />
                  Bien
                </label>
                <label>
                  <input
                    type="radio"
                    name="sistemaTransmision"
                    value="Regular"
                    checked={formData.sistemaTransmision === "Regular"}
                    onChange={(e) => updateField("sistemaTransmision", e.target.value)}
                  />
                  Regular
                </label>
                <label>
                  <input
                    type="radio"
                    name="sistemaTransmision"
                    value="Mal"
                    checked={formData.sistemaTransmision === "Mal"}
                    onChange={(e) => updateField("sistemaTransmision", e.target.value)}
                  />
                  Mal
                </label>
              </div>
            </label>
          </div>
        </fieldset>

        {/* Sección Exterior */}
        <fieldset className={styles["form-fieldset"]}>
          <legend className={styles["form-legend"]}>Inspección Exterior</legend>
          <div className={styles["form-group"]}>
            <label className={styles["form-label"]}>
              Estado de Llantas:
              <div className={styles["radio-group"]}>
                <label>
                  <input
                    type="radio"
                    name="llantas"
                    value="Bien"
                    checked={formData.llantas === "Bien"}
                    onChange={(e) => updateField("llantas", e.target.value)}
                  />
                  Bien
                </label>
                <label>
                  <input
                    type="radio"
                    name="llantas"
                    value="Regular"
                    checked={formData.llantas === "Regular"}
                    onChange={(e) => updateField("llantas", e.target.value)}
                  />
                  Regular
                </label>
                <label>
                  <input
                    type="radio"
                    name="llantas"
                    value="Mal"
                    checked={formData.llantas === "Mal"}
                    onChange={(e) => updateField("llantas", e.target.value)}
                  />
                  Mal
                </label>
              </div>
            </label>
            <label className={styles["form-label"]}>
              Parabrisas:
              <div className={styles["radio-group"]}>
                <label>
                  <input
                    type="radio"
                    name="parabrisas"
                    value="Bien"
                    checked={formData.parabrisas === "Bien"}
                    onChange={(e) => updateField("parabrisas", e.target.value)}
                  />
                  Bien
                </label>
                <label>
                  <input
                    type="radio"
                    name="parabrisas"
                    value="Regular"
                    checked={formData.parabrisas === "Regular"}
                    onChange={(e) => updateField("parabrisas", e.target.value)}
                  />
                  Regular
                </label>
                <label>
                  <input
                    type="radio"
                    name="parabrisas"
                    value="Mal"
                    checked={formData.parabrisas === "Mal"}
                    onChange={(e) => updateField("parabrisas", e.target.value)}
                  />
                  Mal
                </label>
              </div>
            </label>
            <label className={styles["form-label"]}>
              Espejos:
              <div className={styles["radio-group"]}>
                <label>
                  <input
                    type="radio"
                    name="espejos"
                    value="Bien"
                    checked={formData.espejos === "Bien"}
                    onChange={(e) => updateField("espejos", e.target.value)}
                  />
                  Bien
                </label>
                <label>
                  <input
                    type="radio"
                    name="espejos"
                    value="Regular"
                    checked={formData.espejos === "Regular"}
                    onChange={(e) => updateField("espejos", e.target.value)}
                  />
                  Regular
                </label>
                <label>
                  <input
                    type="radio"
                    name="espejos"
                    value="Mal"
                    checked={formData.espejos === "Mal"}
                    onChange={(e) => updateField("espejos", e.target.value)}
                  />
                  Mal
                </label>
              </div>
            </label>
            <label className={styles["form-label"]}>
              Faros:
              <div className={styles["radio-group"]}>
                <label>
                  <input
                    type="radio"
                    name="faros"
                    value="Bien"
                    checked={formData.faros === "Bien"}
                    onChange={(e) => updateField("faros", e.target.value)}
                  />
                  Bien
                </label>
                <label>
                  <input
                    type="radio"
                    name="faros"
                    value="Regular"
                    checked={formData.faros === "Regular"}
                    onChange={(e) => updateField("faros", e.target.value)}
                  />
                  Regular
                </label>
                <label>
                  <input
                    type="radio"
                    name="faros"
                    value="Mal"
                    checked={formData.faros === "Mal"}
                    onChange={(e) => updateField("faros", e.target.value)}
                  />
                  Mal
                </label>
              </div>
            </label>
            <label className={styles["form-label"]}>
              Pintura:
              <div className={styles["radio-group"]}>
                <label>
                  <input
                    type="radio"
                    name="pintura"
                    value="Bien"
                    checked={formData.pintura === "Bien"}
                    onChange={(e) => updateField("pintura", e.target.value)}
                  />
                  Bien
                </label>
                <label>
                  <input
                    type="radio"
                    name="pintura"
                    value="Regular"
                    checked={formData.pintura === "Regular"}
                    onChange={(e) => updateField("pintura", e.target.value)}
                  />
                  Regular
                </label>
                <label>
                  <input
                    type="radio"
                    name="pintura"
                    value="Mal"
                    checked={formData.pintura === "Mal"}
                    onChange={(e) => updateField("pintura", e.target.value)}
                  />
                  Mal
                </label>
              </div>
            </label>
          </div>
        </fieldset>

        {/* Sección Interior */}
        <fieldset className={styles["form-fieldset"]}>
          <legend className={styles["form-legend"]}>Inspección Interior</legend>
          <div className={styles["form-group"]}>
            <label className={styles["form-label"]}>
              Asientos:
              <div className={styles["radio-group"]}>
                <label>
                  <input
                    type="radio"
                    name="asientos"
                    value="Bien"
                    checked={formData.asientos === "Bien"}
                    onChange={(e) => updateField("asientos", e.target.value)}
                  />
                  Bien
                </label>
                <label>
                  <input
                    type="radio"
                    name="asientos"
                    value="Regular"
                    checked={formData.asientos === "Regular"}
                    onChange={(e) => updateField("asientos", e.target.value)}
                  />
                  Regular
                </label>
                <label>
                  <input
                    type="radio"
                    name="asientos"
                    value="Mal"
                    checked={formData.asientos === "Mal"}
                    onChange={(e) => updateField("asientos", e.target.value)}
                  />
                  Mal
                </label>
              </div>
            </label>
            <label className={styles["form-label"]}>
              Tapicería:
              <div className={styles["radio-group"]}>
                <label>
                  <input
                    type="radio"
                    name="tapiceria"
                    value="Bien"
                    checked={formData.tapiceria === "Bien"}
                    onChange={(e) => updateField("tapiceria", e.target.value)}
                  />
                  Bien
                </label>
                <label>
                  <input
                    type="radio"
                    name="tapiceria"
                    value="Regular"
                    checked={formData.tapiceria === "Regular"}
                    onChange={(e) => updateField("tapiceria", e.target.value)}
                  />
                  Regular
                </label>
                <label>
                  <input
                    type="radio"
                    name="tapiceria"
                    value="Mal"
                    checked={formData.tapiceria === "Mal"}
                    onChange={(e) => updateField("tapiceria", e.target.value)}
                  />
                  Mal
                </label>
              </div>
            </label>
            <label className={styles["form-label"]}>
              Panel de Instrumentos:
              <div className={styles["radio-group"]}>
                <label>
                  <input
                    type="radio"
                    name="panelInstrumentos"
                    value="Bien"
                    checked={formData.panelInstrumentos === "Bien"}
                    onChange={(e) =>
                      updateField("panelInstrumentos", e.target.value)
                    }
                  />
                  Bien
                </label>
                <label>
                  <input
                    type="radio"
                    name="panelInstrumentos"
                    value="Regular"
                    checked={formData.panelInstrumentos === "Regular"}
                    onChange={(e) =>
                      updateField("panelInstrumentos", e.target.value)
                    }
                  />
                  Regular
                </label>
                <label>
                  <input
                    type="radio"
                    name="panelInstrumentos"
                    value="Mal"
                    checked={formData.panelInstrumentos === "Mal"}
                    onChange={(e) =>
                      updateField("panelInstrumentos", e.target.value)
                    }
                  />
                  Mal
                </label>
              </div>
            </label>
            <label className={styles["form-label"]}>
              Aire Acondicionado:
              <div className={styles["radio-group"]}>
                <label>
                  <input
                    type="radio"
                    name="aireAcondicionado"
                    value="Bien"
                    checked={formData.aireAcondicionado === "Bien"}
                    onChange={(e) => updateField("aireAcondicionado", e.target.value)}
                  />
                  Bien
                </label>
                <label>
                  <input
                    type="radio"
                    name="aireAcondicionado"
                    value="Regular"
                    checked={formData.aireAcondicionado === "Regular"}
                    onChange={(e) => updateField("aireAcondicionado", e.target.value)}
                  />
                  Regular
                </label>
                <label>
                  <input
                    type="radio"
                    name="aireAcondicionado"
                    value="Mal"
                    checked={formData.aireAcondicionado === "Mal"}
                    onChange={(e) => updateField("aireAcondicionado", e.target.value)}
                  />
                  Mal
                </label>
              </div>
            </label>
            <label className={styles["form-label"]}>
              Sistema de Sonido:
              <div className={styles["radio-group"]}>
                <label>
                  <input
                    type="radio"
                    name="sistemaSonido"
                    value="Bien"
                    checked={formData.sistemaSonido === "Bien"}
                    onChange={(e) => updateField("sistemaSonido", e.target.value)}
                  />
                  Bien
                </label>
                <label>
                  <input
                    type="radio"
                    name="sistemaSonido"
                    value="Regular"
                    checked={formData.sistemaSonido === "Regular"}
                    onChange={(e) => updateField("sistemaSonido", e.target.value)}
                  />
                  Regular
                </label>
                <label>
                  <input
                    type="radio"
                    name="sistemaSonido"
                    value="Mal"
                    checked={formData.sistemaSonido === "Mal"}
                    onChange={(e) => updateField("sistemaSonido", e.target.value)}
                  />
                  Mal
                </label>
              </div>
            </label>
          </div>
        </fieldset>

        {/* Sección Seguridad */}
        <fieldset className={styles["form-fieldset"]}>
          <legend className={styles["form-legend"]}>Inspección de Seguridad</legend>
          <div className={styles["form-group"]}>
            <label className={styles["form-label"]}>
              Cinturones de Seguridad:
              <div className={styles["radio-group"]}>
                <label>
                  <input
                    type="radio"
                    name="cinturones"
                    value="Bien"
                    checked={formData.cinturones === "Bien"}
                    onChange={(e) => updateField("cinturones", e.target.value)}
                  />
                  Bien
                </label>
                <label>
                  <input
                    type="radio"
                    name="cinturones"
                    value="Regular"
                    checked={formData.cinturones === "Regular"}
                    onChange={(e) => updateField("cinturones", e.target.value)}
                  />
                  Regular
                </label>
                <label>
                  <input
                    type="radio"
                    name="cinturones"
                    value="Mal"
                    checked={formData.cinturones === "Mal"}
                    onChange={(e) => updateField("cinturones", e.target.value)}
                  />
                  Mal
                </label>
              </div>
            </label>
            <label className={styles["form-label"]}>
              Airbags:
              <div className={styles["radio-group"]}>
                <label>
                  <input
                    type="radio"
                    name="airbags"
                    value="Bien"
                    checked={formData.airbags === "Bien"}
                    onChange={(e) => updateField("airbags", e.target.value)}
                  />
                  Bien
                </label>
                <label>
                  <input
                    type="radio"
                    name="airbags"
                    value="Regular"
                    checked={formData.airbags === "Regular"}
                    onChange={(e) => updateField("airbags", e.target.value)}
                  />
                  Regular
                </label>
                <label>
                  <input
                    type="radio"
                    name="airbags"
                    value="Mal"
                    checked={formData.airbags === "Mal"}
                    onChange={(e) => updateField("airbags", e.target.value)}
                  />
                  Mal
                </label>
              </div>
            </label>
            <label className={styles["form-label"]}>
              Alarmas:
              <div className={styles["radio-group"]}>
                <label>
                  <input
                    type="radio"
                    name="alarmas"
                    value="Bien"
                    checked={formData.alarmas === "Bien"}
                    onChange={(e) => updateField("alarmas", e.target.value)}
                  />
                  Bien
                </label>
                <label>
                  <input
                    type="radio"
                    name="alarmas"
                    value="Regular"
                    checked={formData.alarmas === "Regular"}
                    onChange={(e) => updateField("alarmas", e.target.value)}
                  />
                  Regular
                </label>
                <label>
                  <input
                    type="radio"
                    name="alarmas"
                    value="Mal"
                    checked={formData.alarmas === "Mal"}
                    onChange={(e) => updateField("alarmas", e.target.value)}
                  />
                  Mal
                </label>
              </div>
            </label>
          </div>
        </fieldset>

        {/* Evidencias y Observaciones */}
        <fieldset className={styles["form-fieldset"]}>
          <legend className={styles["form-legend"]}>
            Evidencias y Observaciones
          </legend>
          <div className={styles["form-group"]}>
            <label className={styles["form-label"]}>
              Evidencias (URL o descripción de fotos):
              <textarea
                className={styles["input-field"]}
                value={formData.evidencias}
                onChange={(e) => updateField("evidencias", e.target.value)}
                placeholder="Ej: http://ejemplo.com/foto.jpg"
              />
            </label>
            <label className={styles["form-label"]}>
              Observaciones Generales:
              <textarea
                className={styles["input-field"]}
                value={formData.observaciones}
                onChange={(e) => updateField("observaciones", e.target.value)}
                placeholder="Comentarios generales de la inspección..."
              />
            </label>
          </div>
        </fieldset>
      </form>

      {/* Botón para generar e imprimir el PDF */}
      <button
        type="button"
        className={styles["print-button"]}
        onClick={handlePrint}
      >
        Imprimir PDF
      </button>

      {/* Contenido a imprimir, oculto de la vista moviéndolo fuera del viewport */}
      <div ref={contentRef} className={styles["print-container"]}>
        <h2 className={styles["titulo-cabezera"]}>Informe de Inspección de Vehículo</h2>
        {/* Vehicle Data in PDF */}
        <section className={styles["datos-vehiculo"]}>
          <h3>Datos del Vehículo</h3>
          <p>
            <strong>Placa:</strong> {formData.placa}
          </p>
          <p>
            <strong>Modelo:</strong> {formData.modelo}
          </p>
          <p>
            <strong>Marca:</strong> {formData.marca}
          </p>
          <p>
            <strong>Año:</strong> {formData.anio}
          </p>
        </section>

        {/* Client Data in PDF */}
        <section className={styles["datos-cliente"]}>
          <h3>Datos del Cliente</h3>
          <p>
            <strong>Nombre:</strong> {formData.nombreCliente}
          </p>
          <p>
            <strong>Cédula:</strong> {formData.cedulaCliente}
          </p>
          <p>
            <strong>Teléfono:</strong> {formData.telefonoCliente}
          </p>
          <p>
            <strong>Dirección:</strong> {formData.direccionCliente}
          </p>
        </section>

        {/* Inspection Data in PDF */}
        <section className={styles["datos-inspeccion"]}>
          <h3>Datos de Inspección</h3>
          <p>
            <strong>Fecha de Inspección:</strong> {formData.fechaInspeccion}
          </p>
          <p>
            <strong>Inspector:</strong> {formData.inspector}
          </p>
        </section>

        {/* Mechanical Inspection in PDF */}
        <section className={styles["checklist-section"]}>
          <h3>Inspección Mecánica</h3>
          <p>
            <strong>Frenos:</strong> {formData.frenos}
          </p>
          <p>
            <strong>Motor:</strong> {formData.motor}
          </p>
          <p>
            <strong>Nivel de Aceite:</strong> {formData.nivelAceite}
          </p>
          <p>
            <strong>Sistema de Escape:</strong> {formData.sistemaEscape}
          </p>
          <p>
            <strong>Sistema de Transmisión:</strong>{" "}
            {formData.sistemaTransmision}
          </p>
        </section>

        {/* Exterior Inspection in PDF */}
        <section className={styles["checklist-section"]}>
          <h3>Inspección Exterior</h3>
          <p>
            <strong>Llantas:</strong> {formData.llantas}
          </p>
          <p>
            <strong>Parabrisas:</strong> {formData.parabrisas}
          </p>
          <p>
            <strong>Espejos:</strong> {formData.espejos}
          </p>
          <p>
            <strong>Faros:</strong> {formData.faros}
          </p>
          <p>
            <strong>Pintura:</strong> {formData.pintura}
          </p>
        </section>

        {/* Interior Inspection in PDF */}
        <section className={styles["checklist-section"]}>
          <h3>Inspección Interior</h3>
          <p>
            <strong>Asientos:</strong> {formData.asientos}
          </p>
          <p>
            <strong>Tapicería:</strong> {formData.tapiceria}
          </p>
          <p>
            <strong>Panel de Instrumentos:</strong> {formData.panelInstrumentos}
          </p>
          <p>
            <strong>Aire Acondicionado:</strong> {formData.aireAcondicionado}
          </p>
          <p>
            <strong>Sistema de Sonido:</strong> {formData.sistemaSonido}
          </p>
        </section>

        {/* Security Inspection in PDF */}
        <section className={styles["checklist-section"]}>
          <h3>Inspección de Seguridad</h3>
          <p>
            <strong>Cinturones de Seguridad:</strong> {formData.cinturones}
          </p>
          <p>
            <strong>Airbags:</strong> {formData.airbags}
          </p>
          <p>
            <strong>Alarmas:</strong> {formData.alarmas}
          </p>
        </section>

        {/* Evidences and Observations in PDF */}
        <section className={styles["checklist-section"]}>
          <h3>Evidencias</h3>
          <p>{formData.evidencias}</p>
        </section>
        <section className={styles["observaciones"]}>
          <h3>Observaciones Generales</h3>
          <p>{formData.observaciones}</p>
        </section>
      </div>
    </div>
  );
};

export default InspeccionCompletaVehiculos;