import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import * as XLSX from 'xlsx';
import styles from './Tabla.module.css';

const Tabla = ({
  children,
  datos,
  mapeoColumnas, 
  mostrarAcciones,
  columnaAccion,
  botonesAccion,
  filasPorPagina = 3,
  habilitarPaginacion = true,
  habilitarBusqueda = true,
  habilitarOrdenamiento = true,
  columnasVisibles = [],
  habilitarExportacion = false,
  columnasOmitidas = [],
  nombreExcel = "datos_tabla",
  habilitarTotalRegistros = true,
  paginaActualInicial = 1,
  onCambiarPagina,
  incluirPaginacionEnURL = true,
}) => {
  
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const initialPage = incluirPaginacionEnURL
    ? parseInt(queryParams.get("page"), 10) || 1
    : paginaActualInicial;
  const [paginaActual, setPaginaActual] = useState(initialPage);
  const [filtro, setFiltro] = useState("");
  const [columnaSeleccionada, setColumnaSeleccionada] = useState("Todo");
  const [columnaOrdenada, setColumnaOrdenada] = useState(null);
  const [ordenAscendente, setOrdenAscendente] = useState(true);

  // Función para transformar los datos según el mapeo recibido
  const transformarDatos = (datos, mapeo) => {
    return datos.map((item) => {
      const nuevoItem = {};
      Object.keys(item).forEach((key) => {
        // Si el mapeo tiene una traducción para la clave, se usa esa traducción;
        // de lo contrario, se conserva el nombre original.
        nuevoItem[mapeo[key] ? mapeo[key] : key] = item[key];
      });
      return nuevoItem;
    });
  };

  // Si se proporciona mapeoColumnas, transformamos los datos; si no, usamos los datos originales.
  const datosProcesados = mapeoColumnas ? transformarDatos(datos, mapeoColumnas) : datos;

  const ordenarDatos = (datos, columna, ascendente) => {
    if (!columna) return datos;
    return [...datos].sort((a, b) => {
      const valorA = a[columna];
      const valorB = b[columna];

      if (valorA == null) return 1;
      if (valorB == null) return -1;

      if (typeof valorA === "string") {
        return ascendente
          ? valorA.localeCompare(valorB)
          : valorB.localeCompare(valorA);
      } else {
        return ascendente ? valorA - valorB : valorB - valorA;
      }
    });
  };

  const datosFiltrados = datosProcesados.filter((item) => {
    if (columnaSeleccionada === "Todo") {
      return Object.values(item).some((valor) =>
        valor?.toString().toLowerCase().includes(filtro.toLowerCase())
      );
    } else {
      const valor = item[columnaSeleccionada];
      return valor?.toString().toLowerCase().includes(filtro.toLowerCase());
    }
  });

  const datosOrdenados = ordenarDatos(
    datosFiltrados,
    columnaOrdenada,
    ordenAscendente
  );

  const totalPaginas = habilitarPaginacion
    ? Math.ceil(datosOrdenados.length / filasPorPagina)
    : 1;

  const indiceUltimaFila = habilitarPaginacion
    ? paginaActual * filasPorPagina
    : datosOrdenados.length;
  const indicePrimeraFila = habilitarPaginacion
    ? indiceUltimaFila - filasPorPagina
    : 0;
  const datosPaginados = datosOrdenados.slice(
    indicePrimeraFila,
    indiceUltimaFila
  );

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
      if (onCambiarPagina) {
        onCambiarPagina(nuevaPagina);
      }
      if (incluirPaginacionEnURL) {
        navigate(`?page=${nuevaPagina}`);
      }
    }
  };

  const manejarOrdenamiento = (columna) => {
    if (columna === columnaOrdenada) {
      setOrdenAscendente(!ordenAscendente);
    } else {
      setColumnaOrdenada(columna);
      setOrdenAscendente(true);
    }
  };

  const totalRegistros = datosFiltrados.length;
  const primerRegistro = (paginaActual - 1) * filasPorPagina + 1;
  const ultimoRegistro = Math.min(paginaActual * filasPorPagina, totalRegistros);

  const exportarAExcel = () => {
    const datosAExportar = datosFiltrados;
    const datosFiltradosColumnas = datosAExportar.map((fila) => {
      const filaFiltrada = {};
      Object.keys(fila).forEach((key) => {
        if (!columnasOmitidas.includes(key)) {
          filaFiltrada[key] = fila[key];
        }
      });
      return filaFiltrada;
    });

    const ws = XLSX.utils.json_to_sheet(datosFiltradosColumnas);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Datos");
    XLSX.writeFile(wb, `${nombreExcel}.xlsx`);
  };

  // Calcular las columnas a mostrar y su orden
  const allKeys = Object.keys(datosProcesados[0]);
  // Si se define columnasVisibles, se usa esa lista; de lo contrario, se muestran todas las columnas
  const columnasAMostrar = columnasVisibles.length > 0 ? columnasVisibles : allKeys;
  let columnasFinales = columnasAMostrar;

  return (
    <div className={styles.tablaContainer}>
      <div className={styles.ContenedorDeBotonesDeOpciones}>
        {habilitarBusqueda && (
          <div className={styles.filtrado}>
            <select
              className={styles.selectFiltro}
              value={columnaSeleccionada}
              onChange={(e) => setColumnaSeleccionada(e.target.value)}
            >
              <option value="Todo">Todo</option>
              {columnasFinales.map((columna) => (
                <option key={columna} value={columna}>
                  {columna}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Filtrar datos..."
              className={styles.filtro}
              value={filtro}
              onChange={(e) => {
                setFiltro(e.target.value);
                if (habilitarPaginacion) {
                  setPaginaActual(1);
                  if (onCambiarPagina) {
                    onCambiarPagina(1);
                  }
                  if (incluirPaginacionEnURL) {
                    navigate("?page=1");
                  }
                }
              }}
            />
          </div>
        )}
        <div className={styles.contenedorBtnAdicionales}>{children}</div>
        {habilitarExportacion && (
          <button onClick={exportarAExcel} className={styles.botonExportar}>
            Exportar a Excel
          </button>
        )}
      </div>

      <div className={styles.ctabla}>
        <table className={styles.tabla}>
          <thead>
            <tr>
              {columnasFinales.map((key) => (
                <th
                  key={key}
                  className={`${habilitarOrdenamiento ? styles.ordenable : ''}`}
                  onClick={() => habilitarOrdenamiento && manejarOrdenamiento(key)}
                >
                  {key}
                  {habilitarOrdenamiento && columnaOrdenada === key && (
                    <span className={styles.indicadorOrden}>
                      {ordenAscendente ? '▲' : '▼'}
                    </span>
                  )}
                </th>
              ))}
              {mostrarAcciones && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {datosPaginados.map((fila, index) => (
              <tr key={index}>
                {columnasFinales.map((key, i) => (
                  <td key={i}>
                    {fila[key] !== null && fila[key] !== undefined ? fila[key] : ''}
                  </td>
                ))}
                {mostrarAcciones && (
                  <td className={styles.acciones}>
                    {botonesAccion.map((boton, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          if (
                            boton.funcionAccion &&
                            typeof boton.funcionAccion === 'function'
                          ) {
                            boton.funcionAccion(fila);
                          } else {
                            const url = `${boton.link}${fila[columnaAccion]}`;
                            if (e.ctrlKey) {
                              window.open(url, "_blank");
                            } else {
                              navigate(url);
                            }
                          }
                        }}
                        style={{ backgroundColor: boton.color }}
                        className={`${styles.botonAccion} ${boton.icono ? styles.iconoBoton : ''}`}
                      >
                        {boton.icono && <i className={`fas ${boton.icono}`}></i>}
                        {!boton.icono && boton.nombre}
                      </button>
                    ))}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {habilitarPaginacion && (
        <div className={styles.paginacion}>
          <button
            onClick={() => cambiarPagina(paginaActual - 1)}
            disabled={paginaActual === 1}
          >
            Anterior
          </button>
          {[...Array(totalPaginas).keys()].map((_, index) => (
            <button
              key={index}
              onClick={() => cambiarPagina(index + 1)}
              className={paginaActual === index + 1 ? styles.paginaActiva : ''}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => cambiarPagina(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
          >
            Siguiente
          </button>
        </div>
      )}

      {habilitarTotalRegistros && (
        <div className={styles.contenedorTotalDeRegistro}>
          Mostrando registros del {primerRegistro} al {ultimoRegistro} de un total de {totalRegistros} registros
        </div>
      )}
    </div>
  );
};

export default Tabla;
