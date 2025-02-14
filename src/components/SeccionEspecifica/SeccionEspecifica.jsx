import React from "react";
import usePermission from "../../hooks/usePermission";

const SeccionEspecifica = () => {
  const permiso = usePermission("usuarios:lectura");

  if (permiso === null) {
    return <div>Cargando...</div>;
  }

  return permiso ? (
    <button>Acción Restringida</button>
  ) : (
    <p>No tienes permiso para realizar esta acción.</p>
  );
};

export default SeccionEspecifica;
