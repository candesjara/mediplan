import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Bienvenido, {user?.nombre}</h3>
        <button className="btn btn-danger" onClick={logout}>Cerrar sesión</button>
      </div>

      <div className="list-group">
        <Link to="/doctores" className="list-group-item list-group-item-action">
          👨‍⚕️ Gestionar Doctores
        </Link>
        <Link to="/pacientes" className="list-group-item list-group-item-action">
          👤 Gestionar Pacientes
        </Link>
        <Link to="/citas" className="list-group-item list-group-item-action">
          📅 Agenda de Citas
        </Link>
      </div>
    </div>
  );
}
