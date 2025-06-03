import { useEffect, useState } from "react";

import { jsPDF } from "jspdf";

import "./Project.css"; // Asegúrate de tener un archivo CSS para estilos
import Footer from "../../components/footer/Footer"; // Asegúrate de que la ruta sea correcta
import ModalProject from "../../components/modal-project/ModalProject"; // Asegúrate de que la ruta sea correcta

const Project = ({ projectId }) => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [descripcion, setDescripcion] = useState(
    project?.descripcion || "No se ha registrado la descripcion"
  );
  const [objetivo_general, setObjetivoGeneral] = useState(
    project?.objetivo_general || "No se ha registrado objetivo general"
  );
  const [objetivos, setObjetivos] = useState(
    Array.isArray(project?.objetivos) ? project.objetivos : []
  );

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/proyectos/${projectId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setProject(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar el proyecto:", err);
        setLoading(false);
      });
  }, [projectId]);

  const handleCompartir = () => {
    const enlace = "http://localhost:5000/proyectos/" + projectId;

    navigator.clipboard
      .writeText(enlace)
      .then(() => {
        console.log("Enlace copiado al portapapeles.");
        alert("¡Enlace copiado!");
      })
      .catch((err) => {
        console.error("Error al copiar: ", err);
      });
  };

  const handleDescargarPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let y = 20; // Posición vertical inicial

    const titulo = project?.titulo || "Proyecto Sin Título";
    const description = descripcion;
    const owner = project?.owner?.nombre || "Desconocido";
    const fechaInicio = new Date(project?.fecha_inicio).toLocaleDateString(
      "es-ES",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );

    const fechaFin = new Date(project?.fecha_fin).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    const saltoLinea = (espacio) => {
      y += espacio;
      if (y > pageHeight - 20) {
        doc.addPage();
        y = 20;
      }
    };

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(24);
    doc.text(titulo, pageWidth / 2, y, { align: "center" });
    saltoLinea(15);

    doc.setFontSize(12);
    doc.text("Creado por: ", 10, y);
    saltoLinea(7);
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(11);
    doc.text(owner, 40, y);
    saltoLinea(10);

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Fecha de inicio:", 10, y);
    saltoLinea(7);
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(11);
    doc.text(fechaInicio, 40, y);
    saltoLinea(10);

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Fecha de fin:", 10, y);
    saltoLinea(7);
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(11);
    doc.text(fechaFin, 40, y);
    saltoLinea(10);

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Descripción:", 10, y);
    saltoLinea(7);
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(11);
    const descLines = doc.splitTextToSize(description, 180);
    descLines.forEach((line) => {
      doc.text(line, 10, y);
      saltoLinea(7);
    });

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Objetivo General:", 10, y);
    saltoLinea(7);
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(11);
    const objGenLines = doc.splitTextToSize(objetivo_general, 180);
    objGenLines.forEach((line) => {
      doc.text(line, 10, y);
      saltoLinea(7);
    });

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Objetivos Específicos:", 10, y);
    saltoLinea(7);
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(11);
    objetivos.forEach((objetivo) => {
      const lines = doc.splitTextToSize("- " + objetivo, 180);
      lines.forEach((line) => {
        doc.text(line, 10, y);
        saltoLinea(7);
      });
    });

    doc.addPage();
    y = 20;
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(16);
    doc.text("ESQUEMA DE DESGLOSE DE TRABAJO (EDT)", pageWidth / 2, y, {
      align: "center",
    });

    doc.addPage();
    y = 20;
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(16);
    doc.text("PRESUPUESTO", pageWidth / 2, y, { align: "center" });

    doc.addPage();
    y = 20;
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(16);
    doc.text("DIAGRAMA DE GANT", pageWidth / 2, y, { align: "center" });

    doc.save(`${titulo}.pdf`);
  };

  const handleObjetivoChange = (index, newValue) => {
    const nuevosObjetivos = [...objetivos];
    nuevosObjetivos[index] = newValue;
    setObjetivos(nuevosObjetivos);
  };

  if (loading) return <div>Cargando...</div>;

  if (!project) return <div>No se encontró el proyecto.</div>;

  const date = new Date(project.fecha_inicio);

  return (
    <>
      <div class="container">
        <ModalProject
          visible={showModal}
          onClose={() => setShowModal(false)}
          projectId={projectId}
        />

        <aside class="sidebar">
          <h2>
            PLANNING
            <br />
            <span>TOOL</span>
          </h2>
          <div class="separator"></div>
          <div className="home-actions">
            <button aria-label="Add new project">
              <i className="fas fa-file-alt"></i>
            </button>
            <button aria-label="Link projects">
              <i className="fas fa-link"></i>
            </button>
          </div>
          <ul class="project-list">
            <li>
              <button>
                <i class="fas fa-folder"></i> Proyecto 1
              </button>
            </li>
            <li>
              <button>
                <i class="fas fa-folder"></i> Proyecto 2
              </button>
            </li>
            <li>
              <button class="active">
                <i class="fas fa-folder"> </i> PROYECTO 3
              </button>
            </li>
            <li>
              <button>
                <i class="fas fa-folder"></i> Proyecto 4
              </button>
            </li>
            <li>
              <button>
                <i class="fas fa-folder"></i> Proyecto 5
              </button>
            </li>
            <li>
              <button>
                <i class="fas fa-folder"></i> Proyecto 6
              </button>
            </li>
            <li>
              <button>
                <i class="fas fa-folder"></i> Proyecto 7
              </button>
            </li>
          </ul>
        </aside>

        <main class="main-content">
          <header>
            <h1>
              <i class="fas fa-link"></i> {project.titulo}
            </h1>
            <p>creado por {project.owner?.nombre || "Desconocido"}</p>
            <div class="date-row">
              <span>{getDate(date, -4)}.</span>
              <span>{getDate(date, -3)}.</span>
              <span>{getDate(date, -2)}.</span>
              <span>{getDate(date, -1)}.</span>
              <span class="selected-date">{getDate(date, 0)}.</span>
              <span>{getDate(date, 1)}.</span>
              <span>{getDate(date, 2)}.</span>
              <span>{getDate(date, 3)}.</span>
              <span>{getDate(date, 4)}.</span>
            </div>
            <div class="selected-date-info">
              <i class="fas fa-caret-up"></i>
              <span>INICIO DEL PROYECTO</span>
            </div>
          </header>

          <div class="project-body">
            <section class="colaboradores">
              <h3>
                <i class="fas fa-users"></i> Colaboradores
              </h3>
              {project.miembros && project.miembros.length > 0 ? (
                <ul className="colaboradores-list">
                  {project.miembros.map((m) => (
                    <li
                      key={`${m.usuarioId}-${m.proyectoId}`}
                      className="colaborador-item"
                    >
                      {m.usuario?.nombre || m.usuarioId}{" "}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No hay colaboradores aún.</p>
              )}
            </section>

            <section class="resumen">
              <h3>
                <i class="fas fa-file"></i> Resumen del Proyecto
              </h3>
              <div class="descripcion">
                <input
                  type="text"
                  class="input-value"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Descripción "
                />
              </div>
              <div class="objetivos">
                <div class="objetivo-general">
                  <input
                    type="text"
                    class="input-value"
                    value={objetivo_general}
                    onChange={(e) => setObjetivoGeneral(e.target.value)}
                    placeholder="Objetivo general"
                  />
                </div>
                <div class="objetivos-especificos">
                  <div class="objetivo-especifico">
                    <input
                      type="text"
                      class="input-value"
                      value={objetivos[0]}
                      onChange={(e) => handleObjetivoChange(0, e.target.value)}
                      placeholder="Objetivo principal"
                    />
                  </div>
                  <div class="objetivo-especifico">
                    <input
                      type="text"
                      class="input-value"
                      value={objetivos[1]}
                      onChange={(e) => handleObjetivoChange(1, e.target.value)}
                      placeholder="Objetivo principal"
                    />
                  </div>
                  <div class="objetivo-especifico">
                    <input
                      type="text"
                      class="input-value"
                      value={objetivos[2]}
                      onChange={(e) => handleObjetivoChange(2, e.target.value)}
                      placeholder="Objetivo principal"
                    />
                  </div>
                </div>
              </div>
              <div class="acciones">
                <button class="btn-action" onClick={() => setShowModal(true)}>
                  <i class="fas fa-table"></i> Tabla de Actividades
                </button>
                <button class="btn-action" onClick={handleCompartir}>
                  <i class="fas fa-link"></i> Compartir
                </button>
                <button class="btn-action" onClick={handleDescargarPDF}>
                  <i class="fas fa-download"></i>Descargar
                </button>
                <button class="btn-action">
                  <i class="fas fa-list-ol"></i> Backlog
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

function getDate(date, day) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + day);
  return newDate.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
  });
}

export default Project;
