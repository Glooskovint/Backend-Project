import './Footer.module.css';
import AuthButton from '../../../features/auth/components/AuthButton';

const Footer = () => (
  <footer>
    <div className="{style.footer-left}">
      <i className="{style.fas fa-th-large}"></i> Temas
    </div>
    <div className="{style.footer-right}">
      <AuthButton />
    </div>
  </footer>
);

export default Footer;