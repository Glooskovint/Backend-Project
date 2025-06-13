import { useState, useEffect } from 'react';
import TaskTable from '../../task/components/TaskTable';
import styles from "../styles/ModalProject.module.css";

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
    <div className={styles["modal-overlay"]} onClick={onClose}>
      <div className={styles["modal-project"]} onClick={(e) => e.stopPropagation()}>
        <button className={styles["modal-close"]} onClick={onClose}>X</button>
        <div className={styles["modal-menu"]} >
          <div className="main">
            <button className={styles["btn-modal active"]}><i className="fas fa-list-ul"></i></button>
            {/* ... otros botones ... */}
          </div>
          <button className={styles["btn-modal"]}><i className="fas fa-download"></i></button>
        </div>
        <div className={styles["sep-v"]}></div>
        <div className={styles["modal-content-info"]}>
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