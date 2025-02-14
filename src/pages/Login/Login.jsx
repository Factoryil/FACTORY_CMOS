import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiManager } from "../../api/apiManager";
import { guardarToken } from "../../utils/authUtils";
const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const repuesta = await apiManager.login({email, password});
        
        if(repuesta.error) {
            console.error("Error en el login:", repuesta.error);
            return;
        }
        guardarToken(repuesta.token)
        navigate("/")
    };

    return (
        <div>
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Ingresar</button>
            </form>
        </div>
    );
};

export default Login;
