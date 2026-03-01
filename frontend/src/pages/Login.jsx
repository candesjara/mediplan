import { useState, useContext } from "react";
import api from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/login", { correo, password });
      login(data);
      navigate("/dashboard");
    } catch (err) {
      setError("Credenciales inválidas");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h3 className="mb-3 text-center">Iniciar Sesión</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Correo</label>
          <input type="email" className="form-control"
            value={correo} onChange={(e) => setCorreo(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Contraseña</label>
          <input type="password" className="form-control"
            value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button className="btn btn-primary w-100">Ingresar</button>
      </form>
    </div>
  );
}
