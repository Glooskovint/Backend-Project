import { useState, useEffect } from 'react';
import TaskTable from '../table/TaskTable';
import "./Modal-project.css";

export default function ModalProject({ visible, onClose, projectId }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!visible || !projectId) return;
    
    setLoading(true);
    fetch(`http://localhost:5000/proyectos/${projectId}/tareas`)
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar tareas');
        return res.json();
      })
      .then(data => {
        setTasks(data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, [visible, projectId]);

  if (!visible) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-project" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>X</button>
        <div className="modal-menu">
          <div className="main">
            <button className="btn-modal active"><i className="fas fa-list-ul"></i></button>
            {/* ... otros botones ... */}
          </div>
          <button className="btn-modal"><i className="fas fa-download"></i></button>
        </div>
        <div className="sep-v"></div>
        <div className="modal-content-info">
          {loading ? (
            <div>Cargando tareas...</div>
          ) : (
            <TaskTable 
              tasks={tasks} 
              onUpdateTasks={setTasks}
              projectId={projectId}
            />
          )}
        </div>
      </div>
    </div>
  );
};