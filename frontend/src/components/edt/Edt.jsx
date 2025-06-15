import { useEffect, useState } from "react";
import Tree from 'react-d3-tree';

function convertirATreeD3(tasks) {
  return tasks.map((tarea) => ({
    name: tarea.nombre,
    children: tarea.subtareas && tarea.subtareas.length > 0
      ? convertirATreeD3(tarea.subtareas)
      : [],
  }));
}

function DataTree(tasks) {
  return {
    name: "Proyecto",
    children: convertirATreeD3(tasks),
  };
}

export default function EDT({ tasks }) {
  const [data, setTreeData] = useState(null); // null porque no es un array

  useEffect(() => {
    if (tasks && tasks.length > 0) {
      const treeData = DataTree(tasks);
      setTreeData(treeData);
    }
  }, [tasks]);

  return (
    <div style={{height: '100%', width: '100%'}}>
      <h3>DIAGRAMA EDT</h3>
      <div style={{ width: '100%', height: '500px' }}>
      {data && <Tree data={data} orientation="vertical" />}
    </div>
    </div>
  );
}
