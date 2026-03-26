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
      setError("Credenciales invalidas");
    }
  };

  return (
    <div className="container py-5">
      <div className="mx-auto rounded-4 border bg-white p-4 p-md-5 shadow-sm" style={{ maxWidth: 420 }}>
        <div className="text-center mb-4">
          <span className="badge text-bg-success-subtle text-success-emphasis mb-3">
            Acceso administrativo
          </span>
          <h3 className="mb-2">Iniciar sesion</h3>
          <p className="text-secondary mb-0">
            Ingresa para gestionar pacientes, doctores y citas en MediPlan.
          </p>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label" htmlFor="correo">Correo</label>
            <input
              id="correo"
              type="email"
              className="form-control"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="form-label" htmlFor="password">Contrasena</label>
            <input
              id="password"
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="btn btn-success w-100">Ingresar</button>
        </form>
      </div>
    </div>
  );
}
