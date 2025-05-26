import "./Modal.css";

export default function NewProjectModal({ visible, onClose }) {
  if (!visible) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Nuevo Proyecto</h2>
        <form>
          <input type="text" placeholder="Nombre del proyecto" required />
          <input type="date" required />
          <input type="date" required />
          <button type="submit">Crear</button>
        </form>
      </div>
    </div>
  );
}
