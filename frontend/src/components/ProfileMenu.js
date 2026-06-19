import React, { useEffect, useRef, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import VisonLogo from './VisonLogo';
import './ProfileMenu.css';

const ROLE_MENUS = {
  Cliente: [
    ['Dados da Conta', 'bi-person', '/cliente'],
    ['Documentos e Relatórios', 'bi-files', '/cliente'],
    ['Avaliação de Risco', 'bi-shield-check', '/cliente'],
    ['Estado NIS2', 'bi-clipboard2-check', '/cliente'],
    ['Pedidos e Suporte', 'bi-chat-left-text', '/cliente/chat']
  ],
  Gestor: [
    ['Dados da Conta', 'bi-person', '/gestor'],
    ['Clientes', 'bi-buildings', '/gestor'],
    ['Documentos', 'bi-files', '/gestor'],
    ['Avaliações NIS2', 'bi-clipboard2-check', '/gestor'],
    ['Pedidos', 'bi-inbox', '/gestor']
  ],
  Admin: [
    ['Dados da Conta', 'bi-person', '/admin'],
    ['Utilizadores', 'bi-people', '/admin/utilizadores'],
    ['Conteúdos', 'bi-layout-text-window-reverse', '/admin/conteudos'],
    ['Documentos', 'bi-files', '/admin/documentos'],
    ['Logs', 'bi-activity', '/admin/atividade']
  ]
};

function getInitials(name) {
  const words = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (!words.length) return 'VO';
  return `${words[0][0]}${words.length > 1 ? words[words.length - 1][0] : ''}`.toUpperCase();
}

export default function ProfileMenu() {
  const { user, role, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const currentRole = role || user?.role || 'Cliente';
  const name = user?.nome || user?.name || (currentRole === 'Cliente' ? 'Empresa Cliente' : `Utilizador ${currentRole}`);
  const email = user?.email || 'Email não disponível';
  const items = ROLE_MENUS[currentRole] || ROLE_MENUS.Cliente;

  useEffect(() => {
    const closeOnOutsideClick = event => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setOpen(false);
    };
    const closeOnEscape = event => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="authenticated-shell">
      <header className="account-bar">
        <Link to={items[0][2]} className="account-bar__brand" aria-label="Ir para o painel principal">
          <VisonLogo size="sm" />
        </Link>

        <div className={`profile-menu ${open ? 'is-open' : ''}`} ref={menuRef}>
          <button
            type="button"
            className="profile-menu__trigger"
            onClick={() => setOpen(value => !value)}
            aria-expanded={open}
            aria-haspopup="menu"
          >
            <span className="profile-avatar profile-avatar--small" aria-hidden="true">{getInitials(name)}</span>
            <span className="profile-menu__trigger-copy">
              <strong>{name}</strong>
              <small>{currentRole}</small>
            </span>
            <i className="bi bi-chevron-down profile-menu__chevron" aria-hidden="true" />
          </button>

          <div className="profile-menu__panel" role="menu" aria-hidden={!open}>
            <div className="profile-menu__identity">
              <span className="profile-avatar" aria-hidden="true">{getInitials(name)}</span>
              <div className="profile-menu__identity-copy">
                <strong>{name}</strong>
                <span>{email}</span>
                <small>{currentRole}</small>
              </div>
            </div>

            <div className="profile-menu__items">
              {items.map(([label, icon, path], index) => (
                <Link
                  key={label}
                  to={path}
                  role="menuitem"
                  className={`profile-menu__item ${index > 0 && location.pathname === path ? 'is-active' : ''}`}
                >
                  <i className={`bi ${icon}`} aria-hidden="true" />
                  <span>{label}</span>
                  <i className="bi bi-chevron-right profile-menu__item-arrow" aria-hidden="true" />
                </Link>
              ))}
            </div>

            <div className="profile-menu__footer">
              <button type="button" className="profile-menu__logout" onClick={handleLogout} role="menuitem">
                <i className="bi bi-box-arrow-right" aria-hidden="true" />
                <span>Terminar Sessão</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="authenticated-shell__content">
        <Outlet />
      </main>
    </div>
  );
}
