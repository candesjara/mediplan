import { Link } from "react-router-dom";

const benefits = [
  {
    icon: "bi-calendar2-check",
    title: "Agendamiento rapido",
    description:
      "Programa citas medicas en pocos pasos con una experiencia clara y accesible para pacientes.",
  },
  {
    icon: "bi-people",
    title: "Gestion de pacientes",
    description:
      "Centraliza la informacion esencial de cada paciente para brindar una atencion ordenada.",
  },
  {
    icon: "bi-clipboard2-pulse",
    title: "Administracion de citas",
    description:
      "Organiza horarios, estados de atencion y disponibilidad para mantener la agenda bajo control.",
  },
  {
    icon: "bi-shield-check",
    title: "Control de informacion",
    description:
      "Mantiene procesos consistentes para apoyar una operacion medica profesional y confiable.",
  },
];

const highlights = [
  "Atencion medica oportuna para consultas programadas y seguimiento.",
  "Solicitud de citas sencilla con seleccion de fecha, doctor y datos del paciente.",
  "Gestion organizada de pacientes, doctores y agenda desde un solo sistema.",
  "Acceso rapido para administradores con control centralizado del servicio.",
];

export default function LandingPage() {
  return (
    <div className="landing-page">
      <header className="landing-header py-3">
        <div className="container d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
          <Link to="/" className="text-decoration-none d-flex align-items-center gap-2">
            <span className="landing-brand-mark">
              <i className="bi bi-heart-pulse-fill" />
            </span>
            <div>
              <div className="fw-semibold text-dark">MediPlan</div>
              <small className="text-secondary">Plataforma de citas medicas</small>
            </div>
          </Link>
          <nav className="d-flex align-items-center gap-2 gap-md-3">
            <a href="#beneficios" className="text-decoration-none text-secondary">Beneficios</a>
            <a href="#sobre" className="text-decoration-none text-secondary">Sobre MediPlan</a>
            <Link to="/admin/login" className="btn btn-outline-success rounded-pill px-4">
              Ingresar como administrador
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="landing-hero py-5 py-lg-6">
          <div className="container">
            <div className="row align-items-center g-5">
              <div className="col-lg-6">
                <span className="badge rounded-pill text-bg-success-subtle text-success-emphasis px-3 py-2 mb-3">
                  Agenda medica organizada
                </span>
                <h1 className="display-4 fw-bold text-dark mb-3">
                  MediPlan simplifica el agendamiento de citas medicas
                </h1>
                <p className="lead text-secondary mb-4">
                  Coordina citas, administra doctores y registra pacientes con una experiencia
                  moderna, clara y enfocada en una atencion de salud mas ordenada.
                </p>
                <div className="d-flex flex-column flex-sm-row gap-3">
                  <Link to="/agendar-cita" className="btn btn-success btn-lg rounded-pill px-4">
                    Agendar cita
                  </Link>
                  <Link to="/admin/login" className="btn btn-outline-success btn-lg rounded-pill px-4">
                    Ingresar como administrador
                  </Link>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="landing-hero-card shadow-lg">
                  <div className="row g-3">
                    <div className="col-12">
                      <div className="landing-stat-card">
                        <span className="small text-secondary">Disponibilidad organizada</span>
                        <h3 className="mb-2">Citas mas faciles de coordinar</h3>
                        <p className="text-secondary mb-0">
                          Visualiza doctores, selecciona horarios y registra solicitudes de forma profesional.
                        </p>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="landing-mini-card h-100">
                        <i className="bi bi-person-check fs-3 text-success" />
                        <h5 className="mt-3">Pacientes atendidos</h5>
                        <p className="text-secondary mb-0">
                          Registros claros para mejorar seguimiento y continuidad del servicio.
                        </p>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="landing-mini-card h-100">
                        <i className="bi bi-calendar-week fs-3 text-success" />
                        <h5 className="mt-3">Agenda centralizada</h5>
                        <p className="text-secondary mb-0">
                          Una operacion diaria mas ordenada para citas nuevas y controles.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-5">
          <div className="container">
            <div className="row g-4">
              {highlights.map((item) => (
                <div className="col-md-6" key={item}>
                  <div className="d-flex gap-3 align-items-start landing-info-item">
                    <div className="landing-check">
                      <i className="bi bi-check2" />
                    </div>
                    <p className="mb-0 text-secondary">{item}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="beneficios" className="py-5 landing-benefits">
          <div className="container">
            <div className="text-center mb-5">
              <span className="text-success fw-semibold">Beneficios principales</span>
              <h2 className="mt-2">Una experiencia pensada para el entorno de salud</h2>
              <p className="text-secondary mx-auto landing-section-copy">
                MediPlan ofrece una base clara para gestionar solicitudes de cita y mantener una operacion
                administrativa mas organizada.
              </p>
            </div>
            <div className="row g-4">
              {benefits.map((benefit) => (
                <div className="col-md-6 col-xl-3" key={benefit.title}>
                  <article className="card border-0 shadow-sm h-100 landing-feature-card">
                    <div className="card-body p-4">
                      <div className="landing-icon mb-3">
                        <i className={`bi ${benefit.icon}`} />
                      </div>
                      <h5>{benefit.title}</h5>
                      <p className="text-secondary mb-0">{benefit.description}</p>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="sobre" className="py-5">
          <div className="container">
            <div className="row g-4 align-items-center">
              <div className="col-lg-6">
                <span className="text-success fw-semibold">Sobre MediPlan</span>
                <h2 className="mt-2">Una plataforma simple para una atencion mejor coordinada</h2>
                <p className="text-secondary">
                  MediPlan esta pensado para instituciones y consultorios que necesitan una herramienta
                  confiable para organizar citas, mantener informacion de pacientes y facilitar el trabajo
                  administrativo diario.
                </p>
                <p className="text-secondary mb-0">
                  La experiencia publica ayuda a los pacientes a solicitar su cita, mientras el equipo
                  administrativo mantiene el control del proceso desde el sistema interno.
                </p>
              </div>
              <div className="col-lg-6">
                <div className="landing-about-card">
                  <div className="row g-3">
                    <div className="col-sm-6">
                      <div className="landing-about-metric">
                        <strong>Solicitud guiada</strong>
                        <span>Formulario claro para reservar una cita de manera sencilla.</span>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="landing-about-metric">
                        <strong>Operacion profesional</strong>
                        <span>Herramientas administrativas para trabajar con mayor orden.</span>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="landing-about-metric">
                        <strong>Informacion centralizada</strong>
                        <span>Pacientes, doctores y citas conectados en un mismo flujo.</span>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="landing-about-metric">
                        <strong>Acceso inmediato</strong>
                        <span>Ingreso rapido para administrar el servicio sin pasos extra.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-5">
          <div className="container">
            <div className="landing-cta text-center">
              <span className="badge rounded-pill text-bg-light text-success px-3 py-2 mb-3">
                Comienza hoy
              </span>
              <h2 className="mb-3">Reserva una cita o ingresa a la gestion administrativa</h2>
              <p className="text-white-50 mx-auto landing-section-copy mb-4">
                Los pacientes pueden solicitar una cita en minutos y el administrador puede entrar
                al sistema para gestionar toda la operacion de MediPlan.
              </p>
              <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
                <Link to="/agendar-cita" className="btn btn-light btn-lg rounded-pill px-4">
                  Reservar cita
                </Link>
                <Link to="/admin/login" className="btn btn-outline-light btn-lg rounded-pill px-4">
                  Ingresar al sistema
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-4 border-top bg-white">
        <div className="container d-flex flex-column flex-md-row justify-content-between gap-2 text-secondary">
          <span>MediPlan</span>
          <span>Solucion demo para agendamiento y gestion de citas medicas.</span>
        </div>
      </footer>
    </div>
  );
}
