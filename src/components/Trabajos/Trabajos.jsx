import React, { useState } from "react"; 
import styles from "./Trabajos.module.css";

const Trabajos = () => {
  // Estado para el número de OT (Orden de Trabajo)
  const [otNumber, setOtNumber] = useState("OT-001");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState([]);
  const [editMode, setEditMode] = useState(true);
  const [facturaGuardada, setFacturaGuardada] = useState(false);

  // Estados para el descuento y su tipo
  const [descuento, setDescuento] = useState("");
  const [discountType, setDiscountType] = useState("percentage");

  // Estados para el modal de mantenimientos y búsqueda
  const [maintenanceModalOpen, setMaintenanceModalOpen] = useState(false);
  const [activeMaintenanceIndex, setActiveMaintenanceIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Opciones predefinidas de mantenimientos
  const maintenanceOptions = [
    "Cambio de aceite",
    "Revisión de frenos",
    "Alineación de ruedas",
    "Cambio de filtros",
    "Alineacion Sencilla Campero Y Camioneta 30 Dias De Garantia (No Valida Si El Vehiculo Sufrio Golpes En La Suspension Y/O Direccion Y/O Si Se Cambian Piezas De La Misma)",
  ];

  // Función para agregar un nuevo ítem
  const agregarItem = () => {
    const nuevoItem = {
      id: items.length + 1,
      tipo: "producto", // valor por defecto
      nombre: "",
      cantidad: 1,
      precio: "",
      impuesto: "",
      total: 0,
    };
    setItems([...items, nuevoItem]);
  };

  // Manejar cambios en los inputs de cada ítem
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const newItems = [...items];

    if (name === "tipo") {
      const oldType = newItems[index].tipo;
      newItems[index][name] = value;
      if (
        (oldType === "mantenimientos" && (value === "producto" || value === "servicio")) ||
        ((oldType === "producto" || oldType === "servicio") && value === "mantenimientos")
      ) {
        newItems[index].nombre = "";
      }
    } else if (name === "cantidad") {
      newItems[index][name] = parseFloat(value) || 0;
    } else if (name === "precio" || name === "impuesto") {
      newItems[index][name] = value;
    } else {
      newItems[index][name] = value;
    }

    const cantidad = parseFloat(newItems[index].cantidad) || 0;
    const precioVal = parseFloat(newItems[index].precio) || 0;
    const impuestoVal = parseFloat(newItems[index].impuesto) || 0;
    const base = cantidad * precioVal;
    const tax = base * (impuestoVal / 100);
    newItems[index].total = base + tax;

    setItems(newItems);
  };

  const handleDescuentoChange = (e) => {
    setDescuento(e.target.value);
  };

  const handleDiscountTypeChange = (e) => {
    setDiscountType(e.target.value);
    setDescuento("");
  };

  const guardarFactura = () => {
    setFacturaGuardada(true);
    setEditMode(false);
  };

  const editarFactura = () => {
    setFacturaGuardada(false);
    setEditMode(true);
  };

  const handleSelectMaintenance = (option) => {
    const newItems = [...items];
    newItems[activeMaintenanceIndex].nombre = option;
    setItems(newItems);
    setMaintenanceModalOpen(false);
    setActiveMaintenanceIndex(null);
    setSearchQuery("");
  };

  const subtotal = items.reduce(
    (acc, item) => acc + item.cantidad * (parseFloat(item.precio) || 0),
    0
  );
  const totalTax = items.reduce(
    (acc, item) =>
      acc + item.cantidad * (parseFloat(item.precio) || 0) * ((parseFloat(item.impuesto) || 0) / 100),
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

  const gridClass = editMode ? styles.gridWithAction : styles.gridWithoutAction;

  return (
    <div className={styles.facturaContainer}>
      {editMode && (
        <button className={styles.agregarItemBtn} onClick={agregarItem}>
          Agregar Ítem
        </button>
      )}

      {/* Lista de ítems */}
      <div className={styles.listaItems}>
        <div className={`${styles.encabezado} ${gridClass}`}>
          <div className={styles.columna}>N°</div>
          <div className={styles.columna}>Tipo</div>
          <div className={styles.columna}>Nombre</div>
          <div className={styles.columna}>Cantidad</div>
          <div className={styles.columna}>Precio</div>
          <div className={styles.columna}>Impuesto (%)</div>
          <div className={styles.columna}>Total</div>
          {editMode && <div className={styles.columna}>Acción</div>}
        </div>

        {items.map((item, index) => (
          <div key={item.id} className={`${styles.itemFactura} ${gridClass}`}>
            <div className={styles.columna}>{index + 1}</div>

            <select
              className={styles.select}
              name="tipo"
              value={item.tipo}
              onChange={(e) => handleInputChange(e, index)}
              disabled={!editMode}
            >
              <option value="producto">Producto</option>
              <option value="servicio">Servicio</option>
              <option value="mantenimientos">Mantenimientos</option>
            </select>

            {item.tipo !== "mantenimientos" ? (
              editMode ? (
                <textarea
                  className={`${styles.input} ${styles.inputNombre}`}
                  name="nombre"
                  value={item.nombre}
                  placeholder="Nombre"
                  onChange={(e) => handleInputChange(e, index)}
                  ref={(el) => {
                    if (el) {
                      el.style.height = "auto";
                      el.style.height = el.scrollHeight + "px";
                    }
                  }}
                />
              ) : (
                <div className={styles.nombreText}>{item.nombre}</div>
              )
            ) : editMode ? (
              <button
                type="button"
                className={styles.maintenanceSelectBtn}
                onClick={() => {
                  setActiveMaintenanceIndex(index);
                  setMaintenanceModalOpen(true);
                }}
              >
                {item.nombre || "Seleccionar mantenimiento"}
              </button>
            ) : (
              <div className={styles.nombreText}>{item.nombre}</div>
            )}

            <input
              className={styles.input}
              type="number"
              name="cantidad"
              value={item.cantidad}
              min="1"
              onChange={(e) => handleInputChange(e, index)}
              disabled={!editMode}
            />

            <input
              className={styles.input}
              type="text"
              name="precio"
              value={item.precio}
              placeholder="Precio"
              onChange={(e) => handleInputChange(e, index)}
              disabled={!editMode}
            />

            <input
              className={styles.input}
              type="text"
              name="impuesto"
              value={item.impuesto}
              placeholder="Impuesto (%)"
              onChange={(e) => handleInputChange(e, index)}
              disabled={!editMode}
            />

            <div className={styles.totalItem}>
              {item.total ? item.total.toFixed(2) : "0.00"}
            </div>

            {editMode && (
              <button
                className={styles.eliminarItemBtn}
                onClick={() => {
                  const newItems = items.filter((_, i) => i !== index);
                  setItems(newItems);
                }}
              >
                Eliminar
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Sección de descuento */}
      {editMode && (
        <div className={styles.descuentoContainer}>
          <label htmlFor="discountType">Tipo de Descuento:</label>
          <select
            id="discountType"
            name="discountType"
            value={discountType}
            onChange={handleDiscountTypeChange}
            className={styles.input}
            disabled={!editMode}
          >
            <option value="percentage">Porcentaje (%)</option>
            <option value="fixed">Valor Fijo</option>
          </select>
          <label htmlFor="descuento">
            Descuento {discountType === "percentage" ? "(%)" : "(Valor)"}:
          </label>
          <input
            type="number"
            id="descuento"
            name="descuento"
            value={descuento}
            onChange={handleDescuentoChange}
            className={styles.input}
            placeholder={discountType === "percentage" ? "ej: 10" : "ej: 2000"}
            disabled={!editMode}
          />
        </div>
      )}

      {/* Resumen de la factura */}
      <div className={styles.resumenFactura}>
        <div className={styles.resumenItem}>
          <span>Subtotal:</span>
          <span>{subtotal.toFixed(2)}</span>
        </div>
        <div className={styles.resumenItem}>
          <span>Impuestos:</span>
          <span>{totalTax.toFixed(2)}</span>
        </div>
        <div className={styles.resumenItem}>
          <span>Total antes de descuento:</span>
          <span>{totalAntesDescuento.toFixed(2)}</span>
        </div>
        <div className={styles.resumenItem}>
          <span>
            {discountType === "percentage"
              ? `Descuento (${descuento}%)`
              : `Descuento (Valor Fijo)`}:
          </span>
          <span>-{discountAmount.toFixed(2)}</span>
        </div>
        <div className={styles.resumenItemTotal}>
          <span>Total:</span>
          <span>{totalFactura.toFixed(2)}</span>
        </div>
      </div>

      {/* Área de observaciones */}
      <div className={styles.notesContainer}>
        <label>Observaciones:</label>
        {editMode ? (
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Añade aquí observaciones o notas adicionales..."
            className={styles.textarea}
          ></textarea>
        ) : (
          <div className={styles.notesText}>{notes}</div>
        )}
      </div>

      {/* Botones para guardar o editar */}
      <div className={styles.buttonsContainer}>
        {facturaGuardada ? (
          <button className={styles.agregarItemBtn} onClick={editarFactura}>
            Editar Factura
          </button>
        ) : (
          <button className={styles.agregarItemBtn} onClick={guardarFactura}>
            Guardar Factura
          </button>
        )}
      </div>

      {/* Modal para selección de mantenimientos */}
      {maintenanceModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Seleccione Mantenimiento</h2>
            <input
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.modalSearchInput}
            />
            {maintenanceOptions
              .filter((option) =>
                option.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((option, idx) => (
                <div
                  key={idx}
                  className={styles.modalOption}
                  onClick={() => handleSelectMaintenance(option)}
                >
                  {option}
                </div>
              ))}
            <button
              className={styles.modalCloseBtn}
              onClick={() => {
                setMaintenanceModalOpen(false);
                setActiveMaintenanceIndex(null);
                setSearchQuery("");
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trabajos;
