import React, { useRef, useState } from "react";
import html2pdf from "html2pdf.js";
import style from "./CrearFuec.module.css";
import imagen1 from "../../../assets/fuec/Imagen1.jpg";
import imagen2 from "../../../assets/fuec/Imagen2.png";
import imagen3 from "../../../assets/fuec/Imagen3.jpg";
import imagen4 from "../../../assets/fuec/Imagen4.jpg";
import imagen5 from "../../../assets/fuec/Imagen5.png";

const initialFuecData = {
  datosEmpresa: {
    razonSocial: "FACTORY INTEGRATED LOGISTICS SAS",
    nit: "900.453.378-7",
  },
  datosContratante: {
    nombre: "FACTORY INTEGRATED LOGISTICS SAS",
    nit: "900453378",
    contrato: "1234",
  },
  objetoContrato: "TRANSPORTE EMPRESARIAL DISPOSICION TOTAL VEHICULO",
  origenDestino: {
    origen: "ORIGEN_PLACEHOLDER",
    destino: "DESTINO_PLACEHOLDER",
  },
  contratoInfo: {
    tipo: "CONTRATO DE TRANSPORTE TERRESTRE AUTOMOTOR ESPECIAL",
    numero: "No. 2200023202025123403623",
  },
  vigenciaContrato: {
    inicial: {
      fechaCompleta: "",
      dia: "",
      mes: "",
      anio: "",
    },
    vencimiento: {
      fechaCompleta: "",
      dia: "",
      mes: "",
      anio: "",
    },
  },
  caracteristicasVehiculo: {
    placa: "",
    modelo: "",
    marca: "",
    clase: "",
    numeroInterno: "",
    numeroTarjeta: "",
  },
  conductores: [
    {
      nombre: "",
      cedula: "",
      licencia: "",
      vigencia: "",
    },
  ],
  responsableContratante: {
    nombre: "JHONSON CALDERON MARTINEZ",
    cedula: "1140842539",
    telefono: "3008427490",
    direccion: "Calle 65B No 42 - 45, Barranquilla",
  },
  firmaDigital: {
    empresa: "FACTORY INTEGRATED LOGISTICS SAS",
    telefono: "3226137916 - 3016144399",
    email: "proveedor@factoryil.com",
    direccion: "Calle 65B No 42 - 45 Barranquilla",
  },
};

const CrearFuec = () => {
  const [fuecData, setFuecData] = useState(initialFuecData);
  const contentRef = useRef();

  // Función para generar el PDF
  const handlePrint = async () => {
    const content = contentRef.current;
    // Guarda el display actual
    const originalDisplay = content.style.display;
    // Muestra el contenido temporalmente
    content.style.display = "block";
    
    const opt = {
      margin: 0.1,
      filename: "fuec.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    await html2pdf().set(opt).from(content).save();
    // Restaura el estado de ocultación
    content.style.display = originalDisplay;
  };

  const updateField = (section, field, value) => {
    setFuecData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  // Separa la fecha en día, mes y año
  const handleDateChange = (key, e) => {
    const fechaCompleta = e.target.value; // "YYYY-MM-DD"
    let dia = "", mes = "", anio = "";
    if (fechaCompleta) {
      const dateObj = new Date(fechaCompleta);
      dia = String(dateObj.getDate()).padStart(2, "0");
      mes = String(dateObj.getMonth() + 1).padStart(2, "0");
      anio = dateObj.getFullYear();
    }
    setFuecData((prev) => ({
      ...prev,
      vigenciaContrato: {
        ...prev.vigenciaContrato,
        [key]: { fechaCompleta, dia, mes, anio },
      },
    }));
  };

  const updateConductorField = (index, field, value) => {
    const updatedConductores = fuecData.conductores.map((cond, i) =>
      i === index ? { ...cond, [field]: value } : cond
    );
    setFuecData((prev) => ({
      ...prev,
      conductores: updatedConductores,
    }));
  };

  const addConductor = () => {
    setFuecData((prev) => ({
      ...prev,
      conductores: [
        ...prev.conductores,
        { nombre: "", cedula: "", licencia: "", vigencia: "" },
      ],
    }));
  };

  const removeConductor = (index) => {
    setFuecData((prev) => ({
      ...prev,
      conductores: prev.conductores.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className={style["container-root"]}>
      <h1 className={style["form-title"]}>Formulario FUEC</h1>
      <form className={style["fuec-form"]}>
        {/* Datos de la Empresa */}
        <fieldset className={style["form-fieldset"]}>
          <legend className={style["form-legend"]}>Datos de la Empresa</legend>
          <div className={style["form-group"]}>
            <label className={style["form-label"]}>
              Razón Social:
              <input
                className={style["input-field"]}
                type="text"
                value={fuecData.datosEmpresa.razonSocial}
                onChange={(e) =>
                  updateField("datosEmpresa", "razonSocial", e.target.value)
                }
              />
            </label>
            <label className={style["form-label"]}>
              NIT:
              <input
                className={style["input-field"]}
                type="text"
                value={fuecData.datosEmpresa.nit}
                onChange={(e) =>
                  updateField("datosEmpresa", "nit", e.target.value)
                }
              />
            </label>
          </div>
        </fieldset>

        {/* Datos del Contratante */}
        <fieldset className={style["form-fieldset"]}>
          <legend className={style["form-legend"]}>Datos del Contratante</legend>
          <div className={style["form-group"]}>
            <label className={style["form-label"]}>
              Nombre o Razón Social:
              <input
                className={style["input-field"]}
                type="text"
                value={fuecData.datosContratante.nombre}
                onChange={(e) =>
                  updateField("datosContratante", "nombre", e.target.value)
                }
              />
            </label>
            <label className={style["form-label"]}>
              NIT/CC:
              <input
                className={style["input-field"]}
                type="text"
                value={fuecData.datosContratante.nit}
                onChange={(e) =>
                  updateField("datosContratante", "nit", e.target.value)
                }
              />
            </label>
            <label className={style["form-label"]}>
              Contrato No:
              <input
                className={style["input-field"]}
                type="text"
                value={fuecData.datosContratante.contrato}
                onChange={(e) =>
                  updateField("datosContratante", "contrato", e.target.value)
                }
              />
            </label>
          </div>
        </fieldset>

        {/* Objeto del Contrato y Origen-Destino */}
        <fieldset className={style["form-fieldset"]}>
          <legend className={style["form-legend"]}>
            Objeto del Contrato y Origen-Destino
          </legend>
          <div className={style["form-group"]}>
            <label className={style["form-label"]}>
              Objeto del Contrato:
              <input
                className={style["input-field"]}
                type="text"
                value={fuecData.objetoContrato}
                onChange={(e) =>
                  setFuecData((prev) => ({
                    ...prev,
                    objetoContrato: e.target.value,
                  }))
                }
              />
            </label>
            <label className={style["form-label"]}>
              Origen:
              <input
                className={style["input-field"]}
                type="text"
                value={fuecData.origenDestino.origen}
                onChange={(e) =>
                  setFuecData((prev) => ({
                    ...prev,
                    origenDestino: { ...prev.origenDestino, origen: e.target.value },
                  }))
                }
              />
            </label>
            <label className={style["form-label"]}>
              Destino:
              <input
                className={style["input-field"]}
                type="text"
                value={fuecData.origenDestino.destino}
                onChange={(e) =>
                  setFuecData((prev) => ({
                    ...prev,
                    origenDestino: { ...prev.origenDestino, destino: e.target.value },
                  }))
                }
              />
            </label>
          </div>
        </fieldset>

        {/* Contrato */}
        <fieldset className={style["form-fieldset"]}>
          <legend className={style["form-legend"]}>Contrato</legend>
          <div className={style["form-group"]}>
            <label className={style["form-label"]}>
              Tipo de Contrato:
              <input
                className={style["input-field"]}
                type="text"
                value={fuecData.contratoInfo.tipo}
                onChange={(e) =>
                  updateField("contratoInfo", "tipo", e.target.value)
                }
              />
            </label>
            <label className={style["form-label"]}>
              Número:
              <input
                className={style["input-field"]}
                type="text"
                value={fuecData.contratoInfo.numero}
                onChange={(e) =>
                  updateField("contratoInfo", "numero", e.target.value)
                }
              />
            </label>
          </div>
        </fieldset>

        {/* Vigencia del Contrato */}
        <fieldset className={style["form-fieldset"]}>
          <legend className={style["form-legend"]}>Vigencia del Contrato</legend>
          <div className={style["form-group"]}>
            <label className={style["form-label"]}>
              Fecha Inicial:
              <input
                className={style["input-field"]}
                type="date"
                value={fuecData.vigenciaContrato.inicial.fechaCompleta}
                onChange={(e) => handleDateChange("inicial", e)}
              />
            </label>
            <label className={style["form-label"]}>
              Fecha Vencimiento:
              <input
                className={style["input-field"]}
                type="date"
                value={fuecData.vigenciaContrato.vencimiento.fechaCompleta}
                onChange={(e) => handleDateChange("vencimiento", e)}
              />
            </label>
          </div>
        </fieldset>

        {/* Características del Vehículo */}
        <fieldset className={style["form-fieldset"]}>
          <legend className={style["form-legend"]}>
            Características del Vehículo
          </legend>
          <div className={style["form-group"]}>
            <label className={style["form-label"]}>
              Placa:
              <input
                className={style["input-field"]}
                type="text"
                value={fuecData.caracteristicasVehiculo.placa}
                onChange={(e) =>
                  updateField("caracteristicasVehiculo", "placa", e.target.value)
                }
              />
            </label>
            <label className={style["form-label"]}>
              Modelo:
              <input
                className={style["input-field"]}
                type="text"
                value={fuecData.caracteristicasVehiculo.modelo}
                onChange={(e) =>
                  updateField("caracteristicasVehiculo", "modelo", e.target.value)
                }
              />
            </label>
            <label className={style["form-label"]}>
              Marca:
              <input
                className={style["input-field"]}
                type="text"
                value={fuecData.caracteristicasVehiculo.marca}
                onChange={(e) =>
                  updateField("caracteristicasVehiculo", "marca", e.target.value)
                }
              />
            </label>
            <label className={style["form-label"]}>
              Clase:
              <input
                className={style["input-field"]}
                type="text"
                value={fuecData.caracteristicasVehiculo.clase}
                onChange={(e) =>
                  updateField("caracteristicasVehiculo", "clase", e.target.value)
                }
              />
            </label>
            <label className={style["form-label"]}>
              Número Interno:
              <input
                className={style["input-field"]}
                type="text"
                value={fuecData.caracteristicasVehiculo.numeroInterno}
                onChange={(e) =>
                  updateField("caracteristicasVehiculo", "numeroInterno", e.target.value)
                }
              />
            </label>
            <label className={style["form-label"]}>
              Número Tarjeta:
              <input
                className={style["input-field"]}
                type="text"
                value={fuecData.caracteristicasVehiculo.numeroTarjeta}
                onChange={(e) =>
                  updateField("caracteristicasVehiculo", "numeroTarjeta", e.target.value)
                }
              />
            </label>
          </div>
        </fieldset>

        {/* Conductores */}
        <fieldset className={style["form-fieldset"]}>
          <legend className={style["form-legend"]}>Conductores</legend>
          {fuecData.conductores.map((cond, index) => (
            <div key={index} className={style["conductor-item"]}>
              <label className={style["form-label"]}>
                Nombre:
                <input
                  className={style["input-field"]}
                  type="text"
                  value={cond.nombre}
                  onChange={(e) =>
                    updateConductorField(index, "nombre", e.target.value)
                  }
                />
              </label>
              <label className={style["form-label"]}>
                Cédula:
                <input
                  className={style["input-field"]}
                  type="text"
                  value={cond.cedula}
                  onChange={(e) =>
                    updateConductorField(index, "cedula", e.target.value)
                  }
                />
              </label>
              <label className={style["form-label"]}>
                Licencia:
                <input
                  className={style["input-field"]}
                  type="text"
                  value={cond.licencia}
                  onChange={(e) =>
                    updateConductorField(index, "licencia", e.target.value)
                  }
                />
              </label>
              <label className={style["form-label"]}>
                Vigencia:
                <input
                  className={style["input-field"]}
                  type="text"
                  value={cond.vigencia}
                  onChange={(e) =>
                    updateConductorField(index, "vigencia", e.target.value)
                  }
                />
              </label>
              <button
                type="button"
                className={style["remove-button"]}
                onClick={() => removeConductor(index)}
              >
                Quitar
              </button>
            </div>
          ))}
          <button
            type="button"
            className={style["add-button"]}
            onClick={addConductor}
          >
            Agregar Conductor
          </button>
        </fieldset>
      </form>

      {/* Botón para generar e imprimir el PDF */}
      <button type="button" className={style["print-button"]} onClick={handlePrint}>
        Imprimir PDF
      </button>

      {/* Contenido a imprimir, oculto de la vista */}
      <div ref={contentRef} className={style["print-container"]}>
        <h2 className={style["titulo-cabezera"]}>
          {fuecData.contratoInfo.tipo}
        </h2>
        <div className={style["image-container"]}>
          <img src={imagen1} alt="Logo 1" className={style["imagen1"]} />
          <img src={imagen2} alt="Logo 2" className={style["imagen2"]} />
          <img src={imagen3} alt="Logo 3" className={style["imagen3"]} />
        </div>
        <div className={style["contenedor-titulo-fuec"]}>
          <h2 className={style["titulo-fuec1"]}>
            {fuecData.contratoInfo.tipo}
          </h2>
          <h2 className={style["titulo-fuec2"]}>
            {fuecData.contratoInfo.numero}
          </h2>
        </div>
        <div className={style["datos-contrato-info"]}>
          <p>
            <strong>1. DATOS DE LA EMPRESA DE TRANSPORTE:</strong>
            <br />
            RAZÓN SOCIAL: {fuecData.datosEmpresa.razonSocial}
            <br />
            NIT: {fuecData.datosEmpresa.nit}
          </p>
          <p>
            <strong>2. DATOS DEL CONTRATANTE:</strong>
            <br />
            NOMBRE O RAZÓN SOCIAL: {fuecData.datosContratante.nombre}
            <br />
            NIT/CC: {fuecData.datosContratante.nit}
            <br />
            CONTRATO No: {fuecData.datosContratante.contrato}
          </p>
          <p>
            <strong>3. OBJETO DEL CONTRATO:</strong>
            <br />
            {fuecData.objetoContrato}
          </p>
          <p>
            <strong>4. ORIGEN-DESTINO:</strong>
            <br />
            {fuecData.origenDestino.origen} - {fuecData.origenDestino.destino} – VICEVERSA
          </p>
        </div>
        <table className={style["tabla-vigencia-contrato"]}>
          <tbody>
            <tr>
              <th className={style["tabla-th"]} colSpan="4">
                5. VIGENCIA DEL CONTRATO
              </th>
            </tr>
            <tr>
              <th className={style["tabla-th"]} rowSpan="2">
                FECHA INICIAL
              </th>
              <th className={style["tabla-th"]}>DÍA</th>
              <th className={style["tabla-th"]}>MES</th>
              <th className={style["tabla-th"]}>AÑO</th>
            </tr>
            <tr>
              <td className={style["tabla-td"]}>
                {fuecData.vigenciaContrato.inicial.dia}
              </td>
              <td className={style["tabla-td"]}>
                {fuecData.vigenciaContrato.inicial.mes}
              </td>
              <td className={style["tabla-td"]}>
                {fuecData.vigenciaContrato.inicial.anio}
              </td>
            </tr>
            <tr>
              <th className={style["tabla-th"]} rowSpan="2">
                FECHA VENCIMIENTO
              </th>
              <th className={style["tabla-th"]}>DÍA</th>
              <th className={style["tabla-th"]}>MES</th>
              <th className={style["tabla-th"]}>AÑO</th>
            </tr>
            <tr>
              <td className={style["tabla-td"]}>
                {fuecData.vigenciaContrato.vencimiento.dia}
              </td>
              <td className={style["tabla-td"]}>
                {fuecData.vigenciaContrato.vencimiento.mes}
              </td>
              <td className={style["tabla-td"]}>
                {fuecData.vigenciaContrato.vencimiento.anio}
              </td>
            </tr>
          </tbody>
        </table>
        <br />
        <table className={style["tabla-vigencia-contrato"]}>
          <tbody>
            <tr>
              <th className={style["tabla-th"]} colSpan="4">
                6. CARACTERÍSTICAS DEL VEHÍCULO
              </th>
            </tr>
            <tr>
              <th className={style["tabla-th"]}>PLACA</th>
              <th className={style["tabla-th"]}>MODELO</th>
              <th className={style["tabla-th"]}>MARCA</th>
              <th className={style["tabla-th"]}>CLASE</th>
            </tr>
            <tr>
              <td className={style["tabla-td"]}>
                {fuecData.caracteristicasVehiculo.placa}
              </td>
              <td className={style["tabla-td"]}>
                {fuecData.caracteristicasVehiculo.modelo}
              </td>
              <td className={style["tabla-td"]}>
                {fuecData.caracteristicasVehiculo.marca}
              </td>
              <td className={style["tabla-td"]}>
                {fuecData.caracteristicasVehiculo.clase}
              </td>
            </tr>
            <tr>
              <th className={style["tabla-th"]} colSpan="2">
                NÚMERO INTERNO
              </th>
              <th className={style["tabla-th"]} colSpan="2">
                NÚMERO TARJETA DE OPERACIÓN
              </th>
            </tr>
            <tr>
              <td className={style["tabla-td"]} colSpan="2">
                {fuecData.caracteristicasVehiculo.numeroInterno}
              </td>
              <td className={style["tabla-td"]} colSpan="2">
                {fuecData.caracteristicasVehiculo.numeroTarjeta}
              </td>
            </tr>
          </tbody>
        </table>
        <br />
        <table className={style["tabla-vigencia-contrato"]}>
          <tbody>
            <tr>
              <th className={style["tabla-th"]} colSpan="5">
                7. INFORMACIÓN DEL CONDUCTOR
              </th>
            </tr>
            <tr>
              <th className={style["tabla-th"]}>No.</th>
              <th className={style["tabla-th"]}>NOMBRE Y APELLIDOS</th>
              <th className={style["tabla-th"]}>No. CÉDULA</th>
              <th className={style["tabla-th"]}>No. LICENCIA CONDUCCIÓN</th>
              <th className={style["tabla-th"]}>VIGENCIA</th>
            </tr>
            {fuecData.conductores.map((cond, index) => (
              <tr key={index}>
                <td className={style["tabla-td"]}>{index + 1}</td>
                <td className={style["tabla-td"]}>{cond.nombre}</td>
                <td className={style["tabla-td"]}>{cond.cedula}</td>
                <td className={style["tabla-td"]}>{cond.licencia}</td>
                <td className={style["tabla-td"]}>{cond.vigencia}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <br />
        <table className={style["tabla-vigencia-contrato"]}>
          <tbody>
            <tr>
              <th className={style["tabla-th"]} colSpan="4">
                8. RESPONSABLE DEL CONTRATANTE
              </th>
            </tr>
            <tr>
              <th className={style["tabla-th"]}>NOMBRE Y APELLIDOS</th>
              <th className={style["tabla-th"]}>No. CÉDULA</th>
              <th className={style["tabla-th"]}>TELÉFONO</th>
              <th className={style["tabla-th"]}>DIRECCIÓN</th>
            </tr>
            <tr>
              <td className={style["tabla-td"]}>
                {fuecData.responsableContratante.nombre}
              </td>
              <td className={style["tabla-td"]}>
                {fuecData.responsableContratante.cedula}
              </td>
              <td className={style["tabla-td"]}>
                {fuecData.responsableContratante.telefono}
              </td>
              <td className={style["tabla-td"]}>
                {fuecData.responsableContratante.direccion.split(",").map(
                  (line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      <br />
                    </React.Fragment>
                  )
                )}
              </td>
            </tr>
          </tbody>
        </table>
        <br />
        <table className={style["tabla-vigencia-contrato"]}>
          <tbody>
            <tr>
              <th className={style["tabla-th"]} colSpan="6">
                9. FIRMA DIGITAL LEY 527, DECRETO 2364 DE 2012
              </th>
            </tr>
            <tr>
              <td className={style["tabla-td"]}>
                <img src={imagen5} alt="Logo 3" className={style["imagen5"]} />
              </td>
              <td className={style["tabla-td"]} colSpan="2">
                {fuecData.firmaDigital.empresa}
                <br />
                TEL: {fuecData.firmaDigital.telefono}
                <br />
                Email: {fuecData.firmaDigital.email}
                <br />
                {fuecData.firmaDigital.direccion}
                <br />
              </td>
              <td className={style["tabla-td"]} colSpan="3">
                <img src={imagen4} alt="Logo 4" className={style["imagen4"]} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CrearFuec;
