import './Footer.css';
import AuthButton from '../auth/AuthButton';

const Footer = () => (
  <footer>
    <div className="footer-left">
      <i className="fas fa-th-large"></i> Temas
    </div>
    <div className="footer-right">
      <AuthButton />
    </div>
  </footer>
);

export default Footer;