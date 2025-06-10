import { useState } from "react";
import "./Home.module.css";
import Hud from "../../components/layout/hud/Hud";
import Footer from "../../components/layout/footer/Footer";
import NewProjectModal from "../../features/project/components/NewProjectModal";
import JoinProjectModal from "../../features/project/components/JoinProjectModal";

const Home = ({ onProjectCreated }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  return (
    <div className="home-container">
      <div className="home-center">
        <div className="hud-background-element">
          <Hud />
        </div>

        <NewProjectModal
          visible={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onProjectCreated={onProjectCreated}
        />
        <JoinProjectModal
          visible={showJoinModal}
          onClose={() => setShowJoinModal(false)}
          onJoined={() => alert("Redirigir a la vista del proyecto si se desea")}
        />

        <h1>PLANNING TOOL</h1>
        <div className="horizontal-line"></div>
        <p className="subtitle">¿PUEDEN TUS PROYECTOS CAMBIAR EL MUNDO?</p>

        <div className="home-actions">
          <button aria-label="Add new project" onClick={() => setShowCreateModal(true)}>
            <i className="fas fa-file-alt"></i>
          </button>
          <button aria-label="Link projects" onClick={() => setShowJoinModal(true)}>
            <i className="fas fa-link"></i>
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
