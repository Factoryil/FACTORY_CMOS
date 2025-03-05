import React, { useRef } from 'react';
import html2pdf from 'html2pdf.js';
import styles from './Conciliacion.module.css';

// Formateador de moneda (colombiana)
const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 2
  }).format(value);
};

// Datos de ejemplo para la conciliación
const conciliacionData = {
  company: {
    name: "FACTORY INTEGRATE SAS",
    nit: "900.453.378 - 7"
  },
  conciliacion: {
    conciliacionNumber: "VZ374",
    facturaNumber: "000",
    consecutivo: "374 - Facturado 0000-00-00",
    fecha: "2022-03-29",
    contrato: "CABAN SYSTEMS COLOMBIA DOS S.A.S",
    identificacion: "NIT - 901464222",
    subdivision: "MEDELLÍN",
    encargado: "Carlos Arevalo",
    periodoDesde: "2022-01-01",
    periodoHasta: "2022-01-01",
    tipo: "Contrato",
    metodoPago: "Transferencia",
    centroCosto: "CC-001",
    estadoConciliacion: "Facturado"
  },
  detalles: [
    {
      placa: "JRL895",
      marca: "NISSAN",
      fechaInicio: "2022-03-01",
      fechaFinal: "2022-03-31",
      dias: 29,
      valorMes: 3900000,
      valorDia: 130000,
      total: 3900000,
    },
    {
      placa: "JRL895",
      marca: "NISSAN",
      fechaInicio: "2022-03-01",
      fechaFinal: "2022-03-31",
      dias: 29,
      valorMes: 3900000,
      valorDia: 130000,
      total: 3900000,
    },
    {
      placa: "JRL895",
      marca: "NISSAN",
      fechaInicio: "2022-03-01",
      fechaFinal: "2022-03-31",
      dias: 29,
      valorMes: 3900000,
      valorDia: 130000,
      total: 3900000,
    }
  ]
};

const Conciliacion = () => {
  const { company, conciliacion, detalles } = conciliacionData;
  const totalGeneral = detalles.reduce((acc, item) => acc + item.total, 0);
  
  // Creamos una referencia para el contenido a imprimir
  const contentRef = useRef();

  // Función para generar el PDF usando html2pdf.js
  const handlePrint = () => {
    const element = contentRef.current;
    const opt = {
      margin:       0.1,
      filename:     'conciliacion.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className={styles.contenedor}>
      {/* Botón de imprimir */}
      <button onClick={handlePrint} className={styles.printButton}>
        Imprimir PDF
      </button>

      {/* Contenedor del contenido que se va a convertir en PDF */}
      <div ref={contentRef} className={styles.container}>
        <header className={styles.header}>
          <div className={styles.companyInfo}>
            <h1>{company.name}</h1>
            <p>NIT: {company.nit}</p>
          </div>
          <div className={styles.conciliacionInfo}>
            <h2>CONCILIACIÓN # {conciliacion.conciliacionNumber}</h2>
            <h3>FACTURA # {conciliacion.facturaNumber}</h3>
          </div>
        </header>

        <section className={styles.infoSection}>
          <h2>Detalle de Conciliación</h2>
          <div className={styles.infoGrid}>
            <div>
              <strong>Consecutivo No.:</strong>
              <p>{conciliacion.consecutivo}</p>
            </div>
            <div>
              <strong>Fecha:</strong>
              <p>{conciliacion.fecha}</p>
            </div>
            <div>
              <strong>Contrato:</strong>
              <p>{conciliacion.contrato}</p>
            </div>
            <div>
              <strong>Identificación:</strong>
              <p>{conciliacion.identificacion}</p>
            </div>
            <div>
              <strong>Subdivision:</strong>
              <p>{conciliacion.subdivision}</p>
            </div>
            <div>
              <strong>Encargado:</strong>
              <p>{conciliacion.encargado}</p>
            </div>
            <div>
              <strong>Periodo Desde:</strong>
              <p>{conciliacion.periodoDesde}</p>
            </div>
            <div>
              <strong>Periodo Hasta:</strong>
              <p>{conciliacion.periodoHasta}</p>
            </div>
            <div>
              <strong>Tipo:</strong>
              <p>{conciliacion.tipo}</p>
            </div>
            <div>
              <strong>Método de Pago:</strong>
              <p>{conciliacion.metodoPago}</p>
            </div>
            <div>
              <strong>Centro de Costo:</strong>
              <p>{conciliacion.centroCosto}</p>
            </div>
            <div>
              <strong>Estado Conciliación:</strong>
              <p>{conciliacion.estadoConciliacion}</p>
            </div>
          </div>
        </section>

        <section className={styles.tableSection}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>N°</th>
                <th>Placa</th>
                <th>Marca</th>
                <th>Fecha Inicio</th>
                <th>Fecha Final</th>
                <th>Días</th>
                <th>Valor Mes</th>
                <th>Valor Día</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {detalles.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.placa}</td>
                  <td>{item.marca}</td>
                  <td>{item.fechaInicio}</td>
                  <td>{item.fechaFinal}</td>
                  <td>{item.dias}</td>
                  <td>{formatCurrency(item.valorMes)}</td>
                  <td>{formatCurrency(item.valorDia)}</td>
                  <td>{formatCurrency(item.total)}</td>
                </tr>
              ))}
              <tr className={styles.totalRow}>
                <td colSpan="7"></td>
                <td colSpan="1" className={styles.totalLabel}>Total</td>
                <td className={styles.totalValue}>{formatCurrency(totalGeneral)}</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

export default Conciliacion;

