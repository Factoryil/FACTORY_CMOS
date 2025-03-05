import React, { useState, useEffect } from "react";
import styles from "./TrabajosSinEdicion.module.css";
import { apiManager } from "../../api/apiManager"; // Asegúrate de que la ruta sea correcta

const TrabajosSinEdicion = ({ ot, placa }) => {
  const [otNumber] = useState(ot);
  const [items, setItems] = useState([]);
  const [notes, setNotes] = useState("");
  const [descuento, setDescuento] = useState("");
  const [discountType, setDiscountType] = useState("percentage");
  const [facturaId, setFacturaId] = useState(null);

  // Helper para formatear valores como moneda
  const formatCurrency = (value) =>
    "$" +
    Number(value)
      .toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

  // Helper para formatear porcentajes
  const formatPercentage = (value) => {
    if (value === null || value === undefined || value === "") return "0.00%";
    const num = Number(value);
    return num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + "%";
  };

  // Función para obtener los ítems asociados a la OT
  const fetchItems = async () => {
    try {
      const response = await apiManager.obtenerItemTrabajoPorOT(otNumber);
      const transformedItems = response.map((item) => ({
        id: item.ID_ITEM,
        tempId: `temp-${Date.now()}-${Math.random()}`,
        tipo: item.TIPO,
        nombre: item.NOMBRE,
        cantidad: item.CANTIDAD,
        precio: item.PRECIO,
        impuesto: item.IMPUESTO,
        total:
          item.total ||
          (item.CANTIDAD * parseFloat(item.PRECIO) +
            item.CANTIDAD *
              parseFloat(item.PRECIO) *
              (parseFloat(item.IMPUESTO) / 100)),
      }));
      setItems(transformedItems);
    } catch (error) {
      console.error("Error al obtener items de OT:", error);
    }
  };

  // Efecto para cargar los ítems al cargar la vista
  useEffect(() => {
    if (otNumber) {
      fetchItems();
    }
  }, [otNumber]);

  // Función para cargar la factura asociada a la OT (si existe)
  const fetchFactura = async () => {
    try {
      const response = await apiManager.obtenerFacturaPorOT(otNumber);
      if (response && response.ID_FACTURA) {
        setFacturaId(response.ID_FACTURA);
        setDescuento(response.DESCUENTO);
        setDiscountType(
          response.DESCUENTO_TIPO === "Porcentaje" ? "percentage" : "fixed"
        );
        if (response.observacion) {
          setNotes(response.observacion);
        }
      }
    } catch (error) {
      console.error("Error al obtener factura:", error);
    }
  };

  useEffect(() => {
    if (otNumber) {
      fetchFactura();
    }
  }, [otNumber]);

  // Cálculo de totales
  const subtotal = items.reduce(
    (acc, item) => acc + item.cantidad * (parseFloat(item.precio) || 0),
    0
  );
  const totalTax = items.reduce(
    (acc, item) =>
      acc +
      item.cantidad *
        (parseFloat(item.precio) || 0) *
        ((parseFloat(item.impuesto) || 0) / 100),
    0
  );
  const totalAntesDescuento = subtotal + totalTax;
  const discountValue = parseFloat(descuento) || 0;
  let discountAmount = 0;
  if (discountType === "percentage") {
    discountAmount = totalAntesDescuento * (discountValue / 100);
  } else if (discountType === "fixed") {
    discountAmount = discountValue;
  }
  const totalFactura = totalAntesDescuento - discountAmount;

  if (!placa) {
    return <div>Cargando información...</div>;
  }

  return (
    <div className={styles.facturaContainer}>
      {/* Lista de ítems */}
      <div className={styles.listaItemsContainer}>
        <div className={styles.listaItems}>
          <div className={`${styles.encabezado} ${styles.gridWithoutAction}`}>
            <div className={styles.columna}>N°</div>
            <div className={styles.columna}>Tipo</div>
            <div className={styles.columna}>Nombre</div>
            <div className={styles.columna}>Cantidad</div>
            <div className={styles.columna}>Precio</div>
            <div className={styles.columna}>Impuesto (%)</div>
            <div className={styles.columna}>Total</div>
          </div>

          {items.map((item, index) => (
            <div
              key={item.id || item.tempId}
              className={`${styles.itemFactura} ${styles.gridWithoutAction}`}
            >
              <div className={styles.columna}>{index + 1}</div>
              <div className={styles.columna}>{item.tipo}</div>
              <div className={styles.columna}>{item.nombre}</div>
              <div className={styles.columna}>{item.cantidad}</div>
              <div className={styles.columna}>{formatCurrency(item.precio)}</div>
              <div className={styles.columna}>
                {item.impuesto ? formatPercentage(item.impuesto) : "0.00%"}
              </div>
              <div className={styles.columna}>
                {item.total ? formatCurrency(item.total) : formatCurrency(0)}
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* Resumen de la factura */}
      <div className={styles.resumenFactura}>
        <div className={styles.resumenItem}>
          <span>Subtotal:</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className={styles.resumenItem}>
          <span>Impuestos:</span>
          <span>{formatCurrency(totalTax)}</span>
        </div>
        <div className={styles.resumenItem}>
          <span>Total antes de descuento:</span>
          <span>{formatCurrency(totalAntesDescuento)}</span>
        </div>
        <div className={styles.resumenItem}>
          <span>
            {discountType === "percentage"
              ? `Descuento (${formatPercentage(descuento)})`
              : `Descuento (Valor Fijo)`}:
          </span>
          <span>-{discountType === "percentage" ? formatCurrency(discountAmount) : formatCurrency(discountAmount)}</span>
        </div>
        <div className={styles.resumenItemTotal}>
          <span>Total:</span>
          <span>{formatCurrency(totalFactura)}</span>
        </div>
      </div>

      {/* Área de observaciones */}
      <div className={styles.notesContainer}>
        <label>
          <strong>Observaciones:</strong>
        </label>
        <div className={styles.notesText}>{notes}</div>
      </div>
    </div>
  );
};

export default TrabajosSinEdicion;
