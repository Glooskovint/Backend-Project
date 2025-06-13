import React, { useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import styles from "../styles/ModalProject.module.css";

export default function JoinProjectModal({ visible, onClose, onJoined }) {
  const { user } = useAuth();
  const [url, setUrl] = useState("");

  const handleJoin = async () => {
    if (!user) {
      return alert("Debes iniciar sesión");
    }
    // Extraer ID del proyecto desde la URL pegada:
    let projectId;
    try {
      const parts = url.split("/");
      projectId = parseInt(parts[parts.length - 1]);
      if (isNaN(projectId)) throw new Error();
    } catch {
      return alert("El enlace no es válido");
    }
    try {
      const response = await fetch("http://localhost:5000/miembros", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuarioId: user.uid,
          proyectoId: projectId,
          rol: "colaborador"
        })
      });
      if (!response.ok) throw new Error();
      alert("Te uniste correctamente al proyecto");
      onJoined();
      onClose();
    } catch {
      alert("Error al unirse al proyecto");
    }
  };

  if (!visible) return null;
  return (
    <div className={styles["modal-overlay"]} onClick={onClose}>
      <div className={styles["modal-content"]} onClick={(e) => e.stopPropagation()}>
        <h2>Unirse a Proyecto</h2>
        <input
          type="text"
          placeholder="Pega el enlace completo del proyecto"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button onClick={handleJoin}>Unirse</button>
        <button onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
}