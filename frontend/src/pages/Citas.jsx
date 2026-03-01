import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

export default function Citas() {
  const navigate = useNavigate();
  const [citas, setCitas] = useState([]);
  const [doctores, setDoctores] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [form, setForm] = useState({
    fecha: "",
    estado: "pendiente",
    doctor_id: "",
    paciente_id: "",
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState(null);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [resCitas, resDoc, resPac] = await Promise.all([
        api.get("/citas"),
        api.get("/doctores"),
        api.get("/pacientes"),
      ]);
      setCitas(resCitas.data);
      setDoctores(resDoc.data);
      setPacientes(resPac.data);

      if (resCitas.data.length === 0) {
        setMensaje({ tipo: "warning", texto: "No hay citas registradas todavia." });
      }
    } catch (error) {
      setMensaje({ tipo: "danger", texto: "Error cargando citas." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editId) {
        await api.put(`/citas/${editId}`, form);
        setMensaje({ tipo: "success", texto: "Cita actualizada correctamente." });
      } else {
        await api.post("/citas", form);
        setMensaje({ tipo: "success", texto: "Cita creada correctamente." });
      }
      setForm({ fecha: "", estado: "pendiente", doctor_id: "", paciente_id: "" });
      setEditId(null);
      await cargarDatos();
    } catch (error) {
      setMensaje({ tipo: "danger", texto: "Error al guardar la cita." });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cita) => {
    setForm({
      fecha: cita.fecha.slice(0, 16),
      estado: cita.estado,
      doctor_id: cita.doctor_id,
      paciente_id: cita.paciente_id,
    });
    setEditId(cita.id);
    setMensaje({ tipo: "warning", texto: "Modo edicion activado." });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Eliminar esta cita?");
    if (!confirmed) {
      setMensaje({ tipo: "warning", texto: "Eliminacion cancelada por el usuario." });
      return;
    }

    try {
      setLoading(true);
      await api.delete(`/citas/${id}`);
      setMensaje({ tipo: "success", texto: "Cita eliminada correctamente." });
      await cargarDatos();
    } catch (error) {
      setMensaje({ tipo: "danger", texto: "No se pudo eliminar la cita." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        className="btn btn-outline-secondary mb-3"
        onClick={() => navigate("/dashboard")}
      >
        Volver
      </button>

      <h3>Agenda de Citas</h3>

      {mensaje && (
        <div className={`alert alert-${mensaje.tipo} mt-3`} role="alert">
          {mensaje.texto}
        </div>
      )}

      {loading && <p className="mt-2">Cargando...</p>}

      <form className="row g-3 mb-4" onSubmit={handleSubmit}>
        <div className="col-md-3">
          <input
            type="datetime-local"
            name="fecha"
            value={form.fecha}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="col-md-3">
          <select
            name="doctor_id"
            value={form.doctor_id}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Seleccione Doctor</option>
            {doctores.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <select
            name="paciente_id"
            value={form.paciente_id}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Seleccione Paciente</option>
            {pacientes.map((paciente) => (
              <option key={paciente.id} value={paciente.id}>
                {paciente.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <select name="estado" value={form.estado} onChange={handleChange} className="form-select">
            <option value="pendiente">Pendiente</option>
            <option value="confirmada">Confirmada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>
        <div className="col-md-1 d-grid">
          <button className="btn btn-success">{editId ? "Actualizar" : "Agregar"}</button>
        </div>
      </form>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Doctor</th>
            <th>Paciente</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {citas.map((cita) => (
            <tr key={cita.id}>
              <td>{new Date(cita.fecha).toLocaleString()}</td>
              <td>{cita.Doctor?.nombre}</td>
              <td>{cita.Paciente?.nombre}</td>
              <td>{cita.estado}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(cita)}>
                  Editar
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(cita.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
