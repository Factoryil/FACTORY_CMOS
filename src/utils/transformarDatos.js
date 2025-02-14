export const transformarDatos = (datos, mapeo) => {
    return datos.map((item) => {
      const nuevoItem = {};
      Object.keys(item).forEach((key) => {
        // Si el mapeo tiene una traducción para la clave, usamos esa traducción
        if (mapeo[key]) {
          nuevoItem[mapeo[key]] = item[key];
        } else {
          nuevoItem[key] = item[key];
        }
      });
      return nuevoItem;
    });
  };
  