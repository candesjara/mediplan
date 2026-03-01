import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function NavbarMediPlan() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success fixed-top shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/dashboard">
          MediPlan
        </Link>

        {user && (
          <div className="navbar-nav ms-auto d-flex flex-row gap-2 gap-lg-3 align-items-center">
            <Link to="/dashboard" className="nav-link text-white">Dashboard</Link>
            <Link to="/pacientes" className="nav-link text-white">Pacientes</Link>
            <Link to="/doctores" className="nav-link text-white">Doctores</Link>
            <Link to="/citas" className="nav-link text-white">Citas</Link>
            <button
              type="button"
              onClick={handleLogout}
              className="btn btn-sm btn-outline-light"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
