import { useState } from "react";
import "./Modal.css";

export default function NewProjectModal({ visible, onClose, onProjectCreated }) {
  const [titulo, setTitulo] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/proyectos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          titulo,
          fecha_inicio: new Date(fechaInicio).toISOString(),
          fecha_fin: new Date(fechaFin).toISOString()
        })
      });

      if (!response.ok) throw new Error("Error al crear el proyecto");

      const data = await response.json();
      setTitulo("");
      setFechaInicio("");
      setFechaFin("");
      onClose();
      onProjectCreated(data.id);
      console.log(data.id) // Notifica a App.jsx para mostrar Project.jsx
    } catch (err) {
      console.error(err.message);
    }
  };

  if (!visible) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Nuevo Proyecto</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre del proyecto"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            required
          />
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            required
          />
          <button type="submit">Crear</button>
        </form>
      </div>
    </div>
  );
}
