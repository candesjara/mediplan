import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

export default function Pacientes() {
  const navigate = useNavigate();
  const [pacientes, setPacientes] = useState([]);
  const [form, setForm] = useState({ nombre: "", documento: "", telefono: "", correo: "" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState(null);

  const cargarPacientes = async () => {
    try {
      setLoading(true);
      const res = await api.get("/pacientes");
      setPacientes(res.data);

      if (res.data.length === 0) {
        setMensaje({ tipo: "warning", texto: "No hay pacientes registrados todavia." });
      }
    } catch (error) {
      setMensaje({ tipo: "danger", texto: "Error al cargar pacientes." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPacientes();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editId) {
        await api.put(`/pacientes/${editId}`, form);
        setMensaje({ tipo: "success", texto: "Paciente actualizado correctamente." });
      } else {
        await api.post("/pacientes", form);
        setMensaje({ tipo: "success", texto: "Paciente agregado con exito." });
      }
      setForm({ nombre: "", documento: "", telefono: "", correo: "" });
      setEditId(null);
      await cargarPacientes();
    } catch (error) {
      setMensaje({ tipo: "danger", texto: "Error al guardar el paciente." });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (paciente) => {
    setForm(paciente);
    setEditId(paciente.id);
    setMensaje({ tipo: "warning", texto: "Modo edicion activado." });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Seguro que deseas eliminar este paciente?");
    if (!confirmed) {
      setMensaje({ tipo: "warning", texto: "Eliminacion cancelada por el usuario." });
      return;
    }

    try {
      setLoading(true);
      await api.delete(`/pacientes/${id}`);
      setMensaje({ tipo: "success", texto: "Paciente eliminado correctamente." });
      await cargarPacientes();
    } catch (error) {
      setMensaje({ tipo: "danger", texto: "No se pudo eliminar el paciente." });
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

      <h3>Gestion de Pacientes</h3>

      {mensaje && (
        <div className={`alert alert-${mensaje.tipo} mt-3`} role="alert">
          {mensaje.texto}
        </div>
      )}

      {loading && <p className="mt-2">Cargando...</p>}

      <form className="row g-3 mb-4" onSubmit={handleSubmit}>
        <div className="col-md-3">
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            className="form-control"
            placeholder="Nombre"
            required
          />
        </div>
        <div className="col-md-2">
          <input
            name="documento"
            value={form.documento}
            onChange={handleChange}
            className="form-control"
            placeholder="Documento"
            required
          />
        </div>
        <div className="col-md-2">
          <input
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            className="form-control"
            placeholder="Telefono"
          />
        </div>
        <div className="col-md-3">
          <input
            name="correo"
            value={form.correo}
            onChange={handleChange}
            className="form-control"
            placeholder="Correo"
          />
        </div>
        <div className="col-md-2 d-grid">
          <button className="btn btn-success">{editId ? "Actualizar" : "Agregar"}</button>
        </div>
      </form>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Documento</th>
            <th>Telefono</th>
            <th>Correo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pacientes.map((paciente) => (
            <tr key={paciente.id}>
              <td>{paciente.nombre}</td>
              <td>{paciente.documento}</td>
              <td>{paciente.telefono}</td>
              <td>{paciente.correo}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(paciente)}>
                  Editar
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(paciente.id)}>
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
