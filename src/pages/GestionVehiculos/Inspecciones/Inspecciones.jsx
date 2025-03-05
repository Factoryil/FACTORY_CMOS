import React, { useRef, useState } from "react";
import html2pdf from "html2pdf.js";
import styles from "./InspeccionCompletaVehiculos.module.css";

const InspeccionCompletaVehiculos = () => {
  // Estado para el formulario
  const [formData, setFormData] = useState({
    // Datos del vehículo
    placa: "",
    modelo: "",
    marca: "",
    anio: "",
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

  // Función para actualizar un campo
  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Función para generar el PDF
  const handlePrint = async () => {
    const content = contentRef.current;
    const originalTransform = content.style.transform;
    // Hacemos visible el contenido (quitamos el transform)
    content.style.transform = "none";
    const opt = {
      margin: 0.2,
      filename: "inspeccion_completa_vehiculo.pdf",
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
                onChange={(e) => updateField("placa", e.target.value)}
              />
            </label>
            <label className={styles["form-label"]}>
              Modelo:
              <input
                type="text"
                className={styles["input-field"]}
                value={formData.modelo}
                onChange={(e) => updateField("modelo", e.target.value)}
              />
            </label>
            <label className={styles["form-label"]}>
              Marca:
              <input
                type="text"
                className={styles["input-field"]}
                value={formData.marca}
                onChange={(e) => updateField("marca", e.target.value)}
              />
            </label>
            <label className={styles["form-label"]}>
              Año:
              <input
                type="number"
                className={styles["input-field"]}
                value={formData.anio}
                onChange={(e) => updateField("anio", e.target.value)}
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
                    name="instrumentos"
                    value="Bien"
                    checked={formData.instrumentos === "Bien"}
                    onChange={(e) => updateField("instrumentos", e.target.value)}
                  />
                  Bien
                </label>
                <label>
                  <input
                    type="radio"
                    name="instrumentos"
                    value="Regular"
                    checked={formData.instrumentos === "Regular"}
                    onChange={(e) => updateField("instrumentos", e.target.value)}
                  />
                  Regular
                </label>
                <label>
                  <input
                    type="radio"
                    name="instrumentos"
                    value="Mal"
                    checked={formData.instrumentos === "Mal"}
                    onChange={(e) => updateField("instrumentos", e.target.value)}
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
          </div>
        </fieldset>

        {/* Evidencias y Observaciones */}
        <fieldset className={styles["form-fieldset"]}>
          <legend className={styles["form-legend"]}>Evidencias y Observaciones</legend>
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
        <section className={styles["datos-vehiculo"]}>
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
        <section className={styles["datos-inspeccion"]}>
          <p>
            <strong>Fecha de Inspección:</strong> {formData.fechaInspeccion}
          </p>
          <p>
            <strong>Inspector:</strong> {formData.inspector}
          </p>
        </section>
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
            <strong>Sistema de Transmisión:</strong> {formData.sistemaTransmision}
          </p>
        </section>
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
        <section className={styles["checklist-section"]}>
          <h3>Inspección Interior</h3>
          <p>
            <strong>Asientos:</strong> {formData.asientos}
          </p>
          <p>
            <strong>Tapicería:</strong> {formData.tapiceria}
          </p>
          <p>
            <strong>Panel de Instrumentos:</strong> {formData.instrumentos}
          </p>
          <p>
            <strong>Aire Acondicionado:</strong> {formData.aireAcondicionado}
          </p>
        </section>
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
