import React, { useState, useEffect } from 'react'; 
import { useNavigate, useLocation } from 'react-router-dom'; 
import * as XLSX from 'xlsx'; 
import styles from './Tabla.module.css';

const Tabla = ({
  children,
  datos,
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
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const paginaInicial = parseInt(queryParams.get("page"), 10) || 1;

  const [paginaActual, setPaginaActual] = useState(paginaInicial);
  const [filtro, setFiltro] = useState("");
  const [columnaSeleccionada, setColumnaSeleccionada] = useState("Todo"); 
  const [columnaOrdenada, setColumnaOrdenada] = useState(null);
  const [ordenAscendente, setOrdenAscendente] = useState(true);

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

  const datosFiltrados = datos.filter((item) => {
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
      navigate(`?page=${nuevaPagina}`);
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
              {Object.keys(datos[0])
                .filter((columna) =>
                  columnasVisibles.length === 0 || columnasVisibles.includes(columna)
                )
                .map((columna) => (
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
                  navigate("?page=1");
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
            {Object.keys(datos[0]).map((key) => (
              columnasVisibles.length === 0 || columnasVisibles.includes(key) ? (
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
              ) : null
            ))}
            {mostrarAcciones && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {datosPaginados.map((fila, index) => (
            <tr key={index}>
              {Object.entries(fila).map(([key, valor], i) => (
                columnasVisibles.length === 0 || columnasVisibles.includes(key) ? (
                  <td key={i}>{valor !== null && valor !== undefined ? valor : ''}</td>
                ) : null
              ))}
              {mostrarAcciones && (
                <td className={styles.acciones}>
                {botonesAccion.map((boton, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      // Verificamos si la tecla Ctrl está presionada
                      const url = `${boton.link}${fila[columnaAccion]}`;
                      if (e.ctrlKey) {
                        // Abrimos el enlace en una nueva pestaña
                        window.open(url, "_blank");
                      } else {
                        // Redirigimos en la misma pestaña si no se presiona Ctrl
                        navigate(url);
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
