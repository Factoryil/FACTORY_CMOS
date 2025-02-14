import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { eliminarToken } from "../../utils/authUtils";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Limpiar los datos de autenticación del localStorage
    eliminarToken()
    // Redirigir al login, reemplazando el historial
    navigate("/login", { replace: true });
  }, [navigate]);

  return null;
};

export default Logout;
