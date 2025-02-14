import { apiManager } from "../../api/apiManager";
import { datosToken } from "../../utils/authUtils";

const Inicio = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const repuesta = await apiManager.verifyToken();
    console.log(repuesta);
    
  };

  const handleSubmit2 = async (e) => {
    e.preventDefault();
    const datos = datosToken();
    const repuesta = await apiManager.getUserPermissions(datos.usuario.ID_USUARIO);
    console.log(repuesta);
    
  };

  return (
    <div>
      <h1>Inicio</h1>
      <button onClick={handleSubmit}>click</button>
      <button onClick={handleSubmit2}>permisos</button>

    </div>
  );
};

export default Inicio;
