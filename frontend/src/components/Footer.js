import React from 'react';
import { Link } from 'react-router-dom';
import VisonLogo from './VisonLogo';

export default function Footer() {
  return (
    <footer className="vison-footer">
      <div className="container">
        <div className="row g-4">
          {/* Brand */}
          <div className="col-12 col-md-3">
            <div className="d-flex align-items-center gap-2 mb-2">
              <VisonLogo size="sm" dark />
            </div>
            <p className="footer-tagline">Segurança, risco e conformidade numa única plataforma.</p>
          </div>

          {/* Links Rápidos */}
          <div className="col-6 col-md-2 offset-md-1">
            <p className="footer-heading">Links Rápidos</p>
            <ul className="footer-links">
              {[['/', 'Início'], ['/sobre', 'Sobre Nós'], ['/servicos', 'Serviços'], ['/artigos', 'Notícias']].map(([to, label]) => (
                <li key={to}><Link to={to}>{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Serviços */}
          <div className="col-6 col-md-3">
            <p className="footer-heading">Serviços</p>
            <ul className="footer-links">
              {['Avaliação de Maturidade IT', 'Testes de Penetração', 'Conformidade NIS I/II', 'Formação'].map(s => (
                <li key={s}><Link to="/servicos">{s}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div className="col-12 col-md-3">
            <p className="footer-heading">Contacto</p>
            <div className="footer-contact-item"><i className="bi bi-envelope" /><span>info@cyberboxsecur.pt</span></div>
            <div className="footer-contact-item"><i className="bi bi-telephone" /><span>+351 210 123 456</span></div>
            <div className="footer-contact-item"><i className="bi bi-geo-alt" /><span>Viseu, Portugal</span></div>
          </div>
        </div>

        <hr className="footer-divider" />
        <p className="footer-copy">© {new Date().getFullYear()} CyberBox Secur. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
