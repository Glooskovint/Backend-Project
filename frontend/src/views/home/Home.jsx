import { useState } from "react";
import "./Home.css";
import Hud from "../../components/hud/Hud";
import Footer from "../../components/footer/Footer";
import NewProjectModal from "../../components/modal/NewProjectModal";

const Home = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="home-container">
      <div className="home-center">
        
        <div className="hud-background-element">
          <Hud />
        </div>
        <NewProjectModal visible={showModal} onClose={() => setShowModal(false)} />

        <h1>PLANNING TOOL</h1>
        <div className="horizontal-line"></div>
        <p className="subtitle">¿PUEDEN TUS PROYECTOS CAMBIAR EL MUNDO?</p>

        <div className="home-actions">
          <button aria-label="Add new project" onClick={() => setShowModal(true)}>
            <i className="fas fa-file-alt"></i>
          </button>
          <button aria-label="Link projects">
            <i className="fas fa-link"></i>
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
