import { useEffect, useState } from "react";

const Project = ({ projectId }) => {
  const [project, setProject] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/proyectos/${projectId}`)
      .then((res) => res.json())
      .then((data) => setProject(data))
      .catch((err) => console.error("Error cargando el proyecto", err));
  }, [projectId]);

  if (!project) return <div>Cargando...</div>;

  return (
    <div className="project-container">
      <h1>{project.titulo}</h1>
      <p><strong>Dueño:</strong> {project.owner?.nombre || "Desconocido"}</p>
      <p><strong>Fecha de inicio:</strong> {new Date(project.fecha_inicio).toLocaleDateString()}</p>

      <div className="colaboradores">
        <h3>Colaboradores</h3>
        {/* Aquí puedes mapear a project.miembros si lo tienes */}
      </div>

      <div className="resumen">
        <h3>Resumen</h3>
        <p>{project.descripcion || "No se ha añadido un resumen."}</p>
      </div>

      <div className="objetivos">
        <h3>Objetivos</h3>
        <p>{project.objetivos || "No se han definido objetivos."}</p>
      </div>

      <div className="acciones">
        <button>Tabla</button>
        <button>Compartir</button>
        <button>Descargar</button>
      </div>
    </div>
  );
};

export default Project;
