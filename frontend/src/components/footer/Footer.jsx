import "./Footer.css";

const Footer = () => {
  return (
    <footer>
      <div className="footer-left">
        <i className="fas fa-th-large"></i> Temas
      </div>
      <div className="footer-right">
        Login
        <button aria-label="User profile">
          <i className="fas fa-user"></i>
        </button>
      </div>
    </footer>
  );
};

export default Footer;
