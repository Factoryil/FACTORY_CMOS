import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { esTokenValido } from "../utils/authUtils";
import { apiManager } from "../api/apiManager";
import Loader from "../components/Loader/Loader";

const ProtectedRoute = () => {
  const [verificado, setVerificado] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const verificarToken = async () => {
      try {
        const res = await apiManager.verifyToken();
        setVerificado(res?.token);
      } catch (error) {
        setVerificado(false);
      } finally {
        setCargando(false);
      }
    };

    verificarToken();
  }, []);

  if (cargando) {
    return <Loader />;
  }

  const valido = esTokenValido();

  if (!verificado || !valido) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
