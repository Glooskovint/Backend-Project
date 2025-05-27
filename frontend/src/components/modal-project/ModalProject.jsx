import "./Modal-project.css";

export default function ModalProject({ visible, onClose }) {

  if (!visible) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
        <div className="modal-project" onClick={(e) => e.stopPropagation()}>
          <button class="modal-close" onClick={onClose}>X</button>
        <div class="modal-menu">
            <div class="main">
                <button class="btn-modal"><i class="fas fa-list-ul"></i></button>
                <button class="btn-modal"><i class="fas fa-network-wired"></i></button>
                <button class="btn-modal"><i class="fas fa-list-ol"></i></button>
                <button class="btn-modal"><i class="fas fa-dollar-sign"></i></button>
            </div>
            <button class="btn-modal"><i class="fas fa-download"></i></button>
        </div>
        <div class="sep-v"></div>
        <div class="modal-content-info">

        </div>
      </div>
    </div>
  );
};
