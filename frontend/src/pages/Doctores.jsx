import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

export default function Doctores() {
  const navigate = useNavigate();
  const [doctores, setDoctores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    const cargarDoctores = async () => {
      try {
        setLoading(true);
        const res = await api.get("/doctores");
        setDoctores(res.data);

        if (res.data.length === 0) {
          setMensaje({ tipo: "warning", texto: "No hay doctores registrados todavía." });
        } else {
          setMensaje(null);
        }
      } catch (error) {
        setMensaje({ tipo: "danger", texto: "Error cargando doctores." });
      } finally {
        setLoading(false);
      }
    };

    cargarDoctores();
  }, []);

  return (
    <div>
      <button
        type="button"
        className="btn btn-outline-secondary mb-3"
        onClick={() => navigate("/dashboard")}
      >
        Volver
      </button>

      <h3>Listado de Doctores</h3>

      {mensaje && (
        <div className={`alert alert-${mensaje.tipo} mt-3`} role="alert">
          {mensaje.texto}
        </div>
      )}

      {loading ? (
        <p className="mt-3">Cargando...</p>
      ) : (
        <table className="table table-striped mt-3">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Especialidad</th>
              <th>Correo</th>
            </tr>
          </thead>
          <tbody>
            {doctores.map((d) => (
              <tr key={d.id}>
                <td>{d.nombre}</td>
                <td>{d.especialidad}</td>
                <td>{d.correo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
