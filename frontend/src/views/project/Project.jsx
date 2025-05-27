import { useEffect, useState } from "react";

import { jsPDF } from "jspdf";

import "./Project.css"; // Asegúrate de tener un archivo CSS para estilos
import Footer from "../../components/footer/Footer"; // Asegúrate de que la ruta sea correcta
import ModalProject from "../../components/modal-project/ModalProject"; // Asegúrate de que la ruta sea correcta

const Project = ({ projectId }) => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/proyectos/${projectId}`)
      .then((res) => res.json())
      .then((data) => {
        setProject(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar el proyecto:", err);
        setLoading(false);
      });
  }, [projectId]);

  const handleDescargarPDF = () => {
    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();

    const titulo = project?.titulo || "Proyecto Sin Título";
    const description = project?.descripcion || "No hay descripción disponible.";
    const owner = project?.owner?.nombre || "Desconocido";
    const fechaInicio = new Date(project?.fecha_inicio).toLocaleDateString("es-ES", {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    const fechaFin = new Date(project?.fecha_fin).toLocaleDateString("es-ES", {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    const header = `Creado por: ${owner || "Desconocido"}`;

    doc.setFont("arial", "bold");
    doc.setFontSize(18);
    doc.text(titulo, pageWidth / 2, 20, { align: "center" });

    doc.setFont("arial", "normal");
    doc.setFontSize(12);
    doc.text(header, 10, 30);
    doc.text(`Fecha de inicio: ${fechaInicio}`, 10, 40);
    doc.text(`Fecha de fin: ${fechaFin}`, 10, 50);
    
    const lineas = doc.splitTextToSize(description, 180);
    doc.text(lineas, 10, 60);

    doc.save(project.titulo + ".pdf");
  };

  if (loading) return <div>Cargando...</div>;

  if (!project) return <div>No se encontró el proyecto.</div>;

  const date = new Date(project.fecha_inicio);

  return (
    <>
      <div class="container">

        <ModalProject visible={showModal} onClose={() => setShowModal(false)} />

        <aside class="sidebar">
          <h2>PLANNING<br/><span>TOOL</span></h2>
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
            <li><button><i class="fas fa-folder"></i> Proyecto 1</button></li>
            <li><button><i class="fas fa-folder"></i> Proyecto 2</button></li>
            <li><button class="active"><i class="fas fa-folder"> </i> PROYECTO 3</button></li>
            <li><button><i class="fas fa-folder"></i> Proyecto 4</button></li>
            <li><button><i class="fas fa-folder"></i> Proyecto 5</button></li>
            <li><button><i class="fas fa-folder"></i> Proyecto 6</button></li>
            <li><button><i class="fas fa-folder"></i> Proyecto 7</button></li>
          </ul>
        </aside>

        <main class="main-content">
          <header>
            <h1><i class="fas fa-link"></i> {project.titulo}</h1>
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
              <h3><i class="fas fa-users"></i> Colaboradores</h3>
              {/*Todos los colaboradores */}
            </section>

            <section class="resumen">
              <h3><i class="fas fa-file"></i> Resumen del Proyecto</h3>
              <div class="descripcion">
                <input type="text" class="input-value" value={project.descripcion || "No se ha registrado el resumen"} />
              </div>
              <div class="objetivos">
                <div class="objetivo-general">
                  <input type="text" class="input-value" value={project.obetivo_general || "No se ha registrado el objetivo principal"} />
                </div>
                <div class="objetivos-especificos">
                  <div class="objetivo-especifico">
                    <input type="text" class="input-value" value={project.obetivos || "No se ha registrado objetivo especifico"} />
                  </div>
                  <div class="objetivo-especifico">
                    <input type="text" class="input-value" value={project.obetivos || "No se ha registrado objetivo especifico"} />
                  </div>
                  <div class="objetivo-especifico">
                    <input type="text" class="input-value" value={project.obetivos || "No se ha registrado objetivo especifico"} />
                  </div>
                </div>
              </div>
              <div class="acciones">
                <button class="btn-action" onClick={() => setShowModal(true)}><i class="fas fa-table"></i> Tabla de Actividades</button>
                <button class="btn-action"><i class="fas fa-link"></i> Compartir</button>
                <button class="btn-action" onClick={handleDescargarPDF}><i class="fas fa-download"></i>Descargar</button>
                <button class="btn-action"><i class="fas fa-list-ol"></i> Backlog</button>
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
    day: '2-digit',
    month: 'short'
  });
};

export default Project;
