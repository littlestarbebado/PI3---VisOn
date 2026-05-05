import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import VisonLogo from './VisonLogo';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const nav = useNavigate();

  return (
    <nav className="vison-navbar">
      <div className="container">
        <div className="d-flex align-items-center justify-content-between">
          <Link to="/" className="vison-navbar navbar-brand text-decoration-none">
            <VisonLogo size="md" dark />
          </Link>

          {/* Desktop */}
          <div className="d-none d-md-flex align-items-center gap-1">
            {[['/', 'Início'], ['/sobre', 'Sobre'], ['/servicos', 'Serviços'], ['/artigos', 'Artigos'], ['/contactos', 'Contactos']].map(([path, label]) => (
              <NavLink key={path} to={path} end={path === '/'} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>{label}</NavLink>
            ))}
          </div>

          <div className="d-none d-md-flex align-items-center gap-2">
            <button className="btn-area-cliente nav-link" onClick={() => nav('/login')}>Área de Cliente</button>
          </div>

          {/* Mobile toggle */}
          <button className="btn btn-sm d-md-none" style={{ color: '#fff', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 8, padding: '0.4rem 0.7rem' }} onClick={() => setOpen(!open)}>
            <i className={`bi ${open ? 'bi-x-lg' : 'bi-list'}`} />
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="d-md-none mt-2 pb-2" style={{ borderTop: '1px solid var(--vison-border)' }}>
            {[['/', 'Início'], ['/sobre', 'Sobre'], ['/servicos', 'Serviços'], ['/artigos', 'Artigos'], ['/contactos', 'Contactos']].map(([path, label]) => (
              <NavLink key={path} to={path} end={path === '/'} className="nav-link d-block py-2" onClick={() => setOpen(false)}>{label}</NavLink>
            ))}
            <button className="btn-area-cliente nav-link mt-1" onClick={() => { setOpen(false); nav('/login'); }}>Área de Cliente</button>
          </div>
        )}
      </div>
    </nav>
  );
}
