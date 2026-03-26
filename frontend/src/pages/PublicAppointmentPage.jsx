import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosConfig";

const initialForm = {
  nombre: "",
  documento: "",
  correo: "",
  telefono: "",
  fecha: "",
  doctor_id: "",
};

export default function PublicAppointmentPage() {
  const [doctores, setDoctores] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  useEffect(() => {
    const cargarDoctores = async () => {
      try {
        const { data } = await api.get("/doctores");
        setDoctores(data);
      } catch (error) {
        setStatus({
          type: "danger",
          message: "No fue posible cargar la disponibilidad medica en este momento.",
        });
      } finally {
        setLoadingDoctors(false);
      }
    };

    cargarDoctores();
  }, []);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const { data } = await api.post("/citas/publica", form);
      setStatus({
        type: "success",
        message: data.message || "Tu cita fue registrada correctamente.",
      });
      setForm(initialForm);
    } catch (error) {
      setStatus({
        type: "danger",
        message: error.response?.data?.message || "No fue posible registrar la cita.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="public-appointment-page py-4 py-md-5">
      <div className="container">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <Link to="/" className="text-decoration-none text-success fw-semibold">
              <i className="bi bi-arrow-left me-2" />
              Volver al inicio
            </Link>
            <h1 className="mt-3 mb-2">Solicitar cita medica</h1>
            <p className="text-secondary mb-0">
              Completa tus datos y selecciona el profesional con el que deseas agendar tu cita.
            </p>
          </div>
          <Link to="/admin/login" className="btn btn-outline-success rounded-pill px-4">
            Ingresar como administrador
          </Link>
        </div>

        <div className="row g-4">
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4 p-md-5">
                <h2 className="h4 mb-4">Formulario de agendamiento</h2>

                {status.message && (
                  <div className={`alert alert-${status.type}`} role="alert">
                    {status.message}
                  </div>
                )}

                <form className="row g-3" onSubmit={handleSubmit}>
                  <div className="col-md-6">
                    <label className="form-label">Nombre completo</label>
                    <input
                      type="text"
                      name="nombre"
                      className="form-control"
                      value={form.nombre}
                      onChange={handleChange}
                      minLength={3}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Documento</label>
                    <input
                      type="text"
                      name="documento"
                      className="form-control"
                      value={form.documento}
                      onChange={handleChange}
                      pattern="\d{3,15}"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Correo</label>
                    <input
                      type="email"
                      name="correo"
                      className="form-control"
                      value={form.correo}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Telefono</label>
                    <input
                      type="text"
                      name="telefono"
                      className="form-control"
                      value={form.telefono}
                      onChange={handleChange}
                      pattern="\d{3,15}"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Fecha y hora</label>
                    <input
                      type="datetime-local"
                      name="fecha"
                      className="form-control"
                      value={form.fecha}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Profesional</label>
                    <select
                      name="doctor_id"
                      className="form-select"
                      value={form.doctor_id}
                      onChange={handleChange}
                      required
                      disabled={loadingDoctors}
                    >
                      <option value="">
                        {loadingDoctors ? "Cargando doctores..." : "Selecciona un doctor"}
                      </option>
                      {doctores.map((doctor) => (
                        <option key={doctor.id} value={doctor.id}>
                          {doctor.nombre} - {doctor.especialidad}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-12 d-grid d-sm-flex gap-3 pt-2">
                    <button
                      type="submit"
                      className="btn btn-success rounded-pill px-4"
                      disabled={loading || loadingDoctors}
                    >
                      {loading ? "Registrando..." : "Confirmar solicitud"}
                    </button>
                    <Link to="/" className="btn btn-outline-secondary rounded-pill px-4">
                      Cancelar
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="public-side-panel">
              <span className="badge text-bg-success-subtle text-success-emphasis mb-3">
                Proceso guiado
              </span>
              <h3 className="mb-3">Tu solicitud queda lista para gestion administrativa</h3>
              <p className="text-secondary">
                Una vez registrada la cita, el equipo de MediPlan puede revisar la agenda y dar
                seguimiento a la atencion programada.
              </p>
              <div className="public-side-list">
                <div className="public-side-item">
                  <i className="bi bi-check-circle-fill text-success" />
                  <span>Selecciona el doctor y el horario que necesitas.</span>
                </div>
                <div className="public-side-item">
                  <i className="bi bi-check-circle-fill text-success" />
                  <span>Comparte tus datos para vincular la cita con tu registro.</span>
                </div>
                <div className="public-side-item">
                  <i className="bi bi-check-circle-fill text-success" />
                  <span>El sistema evita horarios duplicados para una mejor organizacion.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
