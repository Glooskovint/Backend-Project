import './Footer.module.css';
import AuthButton from '../../../features/auth/components/AuthButton';

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