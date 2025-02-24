import React, { useState, useEffect } from "react";
import styles from "./Trabajos.module.css";
import { apiManager } from "../../api/apiManager"; // Asegúrate de que la ruta sea correcta

const Trabajos = ({ ot, placa }) => {
  // Estado para el número de OT (Orden de Trabajo)
  const [otNumber, setOtNumber] = useState(ot);
  const [items, setItems] = useState([]);
  const [editMode, setEditMode] = useState(true); // Modo edición activado

  // Estados para el modal de mantenimientos y búsqueda
  const [maintenanceModalOpen, setMaintenanceModalOpen] = useState(false);
  const [activeMaintenanceIndex, setActiveMaintenanceIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [maintenanceOptions, setMaintenanceOptions] = useState([]);

  // Estados adicionales para totales, descuento, observaciones y control de factura
  const [notes, setNotes] = useState("");
  const [descuento, setDescuento] = useState("");
  const [discountType, setDiscountType] = useState("percentage");
  const [facturaGuardada, setFacturaGuardada] = useState(false);
  // Estado para almacenar el ID de la factura (si existe)
  const [facturaId, setFacturaId] = useState(null);

  // Función para obtener los ítems asociados a la OT
  const fetchItems = async () => {
    try {
      const response = await apiManager.obtenerItemTrabajoPorOT(otNumber);
      const transformedItems = response.map((item) => ({
        id: item.ID_ITEM,
        // Se utiliza tempId en caso de que id sea nulo
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

  // Efecto para obtener las opciones de mantenimiento cuando cambia la placa
  useEffect(() => {
    const fetchMaintenanceOptions = async () => {
      try {
        const response = await apiManager.ejecucionesMantenimiento(placa);
        const options = response.map((item) => item.trabajo);
        setMaintenanceOptions(options);
      } catch (error) {
        console.error("Error al obtener mantenimientos:", error);
      }
    };
    if (placa) fetchMaintenanceOptions();
  }, [placa]);

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
        // Cargar descuento y total de la factura existente (opcional)
        setDescuento(response.DESCUENTO);
        setDiscountType(
          response.DESCUENTO_TIPO === "Porcentaje" ? "percentage" : "fixed"
        );
        setFacturaGuardada(true);
        setEditMode(false);
        // Cargar observaciones si están disponibles
        if (response.observacion) {
          setNotes(response.observacion);
        }
      }
    } catch (error) {
      console.error("Error al obtener factura:", error);
    }
  };

  useEffect(() => {
    if (otNumber) fetchFactura();
  }, [otNumber]);

  // Función para agregar un nuevo ítem
  const agregarItem = () => {
    const nuevoItem = {
      id: null, // Ítem nuevo aún no tiene ID asignado
      tempId: `temp-${Date.now()}-${Math.random()}`,
      tipo: "producto",
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
      // Si se cambia entre mantenimiento y otro tipo, se limpia el nombre
      if (
        (oldType === "mantenimientos" &&
          (value === "producto" || value === "servicio")) ||
        ((oldType === "producto" || oldType === "servicio") &&
          value === "mantenimientos")
      ) {
        newItems[index].nombre = "";
      }
    } else if (name === "cantidad") {
      newItems[index][name] = parseFloat(value) || 0;
    } else if (name === "precio") {
      newItems[index][name] = value;
    } else if (name === "impuesto") {
      let sanitized = value.replace(/%/g, "");
      if (value.includes("%")) {
        sanitized = sanitized + "%";
      }
      newItems[index][name] = sanitized;
    } else {
      newItems[index][name] = value;
    }

    // Recalcular total
    const cantidad = parseFloat(newItems[index].cantidad) || 0;
    const precioVal = parseFloat(newItems[index].precio) || 0;
    const impuestoVal = parseFloat(newItems[index].impuesto) || 0;
    const base = cantidad * precioVal;
    const tax = base * (impuestoVal / 100);
    newItems[index].total = base + tax;

    setItems(newItems);
  };

  // Función para eliminar un ítem
  const handleEliminarItem = async (itemId, index) => {
    try {
      if (itemId) {
        await apiManager.eliminarItemTrabajo(itemId);
      }
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
    } catch (error) {
      console.error("Error al eliminar el ítem:", error);
    }
  };

  // Seleccionar un mantenimiento desde el modal
  const handleSelectMaintenance = (option) => {
    const newItems = [...items];
    newItems[activeMaintenanceIndex].nombre = option;
    setItems(newItems);
    setMaintenanceModalOpen(false);
    setActiveMaintenanceIndex(null);
    setSearchQuery("");
  };

  // Funciones para manejar descuento y edición de factura
  const handleDescuentoChange = (e) => {
    setDescuento(e.target.value);
  };

  const handleDiscountTypeChange = (e) => {
    setDiscountType(e.target.value);
    setDescuento("");
  };

  // Función para guardar (o editar) la factura y los ítems asociados
  const handleGuardarFactura = async () => {
    // Armar payload de la factura
    const formDataFactura = new FormData();
    formDataFactura.append(
      "DESCUENTO_TIPO",
      discountType === "percentage" ? "Porcentaje" : "ValorFijo"
    );
    formDataFactura.append("DESCUENTO", parseFloat(descuento) || 0);
    formDataFactura.append("TOTAL", totalFactura);
    formDataFactura.append("observacion", notes);

    try {
      if (facturaId) {
        await apiManager.editarFactura(facturaId, formDataFactura);
        console.log("Factura actualizada correctamente.");
      } else {
        formDataFactura.append("ID_OT", otNumber);
        const response = await apiManager.crearFactura(formDataFactura);
        console.log("Factura creada correctamente:", response);
        if (response && response.id) {
          setFacturaId(response.id);
        }
      }

      // Guardar o actualizar cada ítem
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const formDataItem = new FormData();
        formDataItem.append("TIPO", item.tipo);
        formDataItem.append("NOMBRE", item.nombre);
        formDataItem.append("CANTIDAD", item.cantidad);
        formDataItem.append("PRECIO", item.precio);
        formDataItem.append("IMPUESTO", item.impuesto.replace("%", ""));
        if (item.id) {
          await apiManager.editarItemTrabajo(item.id, formDataItem);
        } else {
          formDataItem.append("ID_OT", otNumber);
          const response = await apiManager.crearItemTrabajo(formDataItem);
          console.log("Ítem creado correctamente:", response);
          if (response && response.id) {
            items[i].id = response.id;
          }
        }
      }
      setFacturaGuardada(true);
      setEditMode(false);
    } catch (error) {
      console.error("Error al guardar la factura y los ítems:", error);
    }
  };

  // Función para cancelar la actualización (descartar cambios)
  const cancelarActualizacion = async () => {
    try {
      if (otNumber) {
        await fetchItems();
      }
      if (otNumber) {
        await fetchFactura();
      }
      setEditMode(false);
    } catch (error) {
      console.error("Error al cancelar actualización:", error);
    }
  };

  const editarFactura = () => {
    setFacturaGuardada(false);
    setEditMode(true);
  };

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

  // Definir la clase de grid según el modo de edición
  const gridClass = editMode ? styles.gridWithAction : styles.gridWithoutAction;

  if (!placa) {
    return <div>Cargando información...</div>;
  }

  return (
    <div className={styles.facturaContainer}>
      {editMode && (
        <button className={styles.agregarItemBtn} onClick={agregarItem}>
          Agregar Ítem
        </button>
      )}

      {/* Lista de ítems */}
      <div className={styles.listaItemsContainer}>
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
            <div
              key={item.id || item.tempId}
              className={`${styles.itemFactura} ${gridClass}`}
            >
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

              {editMode ? (
                <input
                  className={styles.input}
                  type="text"
                  name="impuesto"
                  value={item.impuesto}
                  placeholder="Impuesto (%)"
                  onChange={(e) => handleInputChange(e, index)}
                  disabled={!editMode}
                />
              ) : (
                <div className={styles.nombreText}>
                  {item.impuesto ? item.impuesto : "0.00%"}
                </div>
              )}

              <div className={styles.totalItem}>
                {item.total ? item.total.toFixed(2) : "0.00"}
              </div>

              {editMode && (
                <div className={styles.itemActions}>
                  <button
                    className={styles.eliminarItemBtn}
                    onClick={() => handleEliminarItem(item.id, index)}
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
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

      {/* Botones para guardar, cancelar o editar */}
      <div className={styles.buttonsContainer}>
        {editMode ? (
          <>
            <button className={styles.agregarItemBtn} onClick={handleGuardarFactura}>
              Guardar Factura
            </button>
            <button className={styles.agregarItemBtn} onClick={cancelarActualizacion}>
              Cancelar Actualización
            </button>
          </>
        ) : (
          <button className={styles.agregarItemBtn} onClick={editarFactura}>
            Editar Factura
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
