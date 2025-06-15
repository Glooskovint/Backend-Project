import { useState, useEffect } from 'react';
import TaskTable from '../table/TaskTable';
import "./Modal-project.css";
import EDT from '../edt/edt';

export default function ModalProject({ visible, onClose, projectId }) {
  const [tasks, setTasks] = useState([]);
  const [select, setSelect] = useState(1);
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

  const handleSelectChange = (value) => {
    setSelect(value);
  }

  if (!visible) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-project" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>X</button>
        <div className="modal-menu">
          <div className="main">
            <button className={select === 1 ? 'btn-modal active' : 'btn-modal' } onClick={() => handleSelectChange(1)}><i className="fas fa-list-ul"></i></button>
            <button className={select === 2 ? 'btn-modal active' : 'btn-modal' } onClick={() => handleSelectChange(2)}><i className="fas fa-chart-bar"></i></button>
            <button className={select === 3 ? 'btn-modal active' : 'btn-modal' } ><i className="fas fa-users"></i></button>
          </div>
          <button className="btn-modal"><i className="fas fa-download"></i></button>
        </div>
        <div className="sep-v"></div>
        <div className="modal-content-info">
          {loading ? (
            <div>Cargando tareas...</div>
          ) : select === 1 ? (
            <TaskTable 
              tasks={tasks} 
              onUpdateTasks={setTasks}
              projectId={projectId}
            />
          ) : select === 2 ? (
            <EDT tasks={tasks} />
          ) : (
            <div>Colaboradores del proyecto</div>
          )}
        </div>
      </div>
    </div>
  );
};