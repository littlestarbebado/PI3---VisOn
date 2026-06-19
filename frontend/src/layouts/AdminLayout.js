import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import VisonLogo from '../components/VisonLogo';

export default function AdminLayout() {

  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => setDrawerOpen(false), [location.pathname]);

  useEffect(() => {
    if (!drawerOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = event => {
      if (event.key === 'Escape') setDrawerOpen(false);
    };
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [drawerOpen]);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 901px)');
    const closeOnDesktop = event => {
      if (event.matches) setDrawerOpen(false);
    };
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, []);

  const menu = [
    {
      name: 'Dashboard',
      icon: 'bi-speedometer2',
      path: '/admin'
    },
    {
      name: 'Conteúdos',
      icon: 'bi-file-earmark-text',
      path: '/admin/conteudos'
    },
    {
      name: 'Utilizadores',
      icon: 'bi-people',
      path: '/admin/utilizadores'
    },
    {
      name: 'Documentos',
      icon: 'bi-folder',
      path: '/admin/documentos'
    },
    
    {
      name: 'Atividade',
      icon: 'bi-activity',
      path: '/admin/atividade'
    },
  
    {
  name: 'Mensagens',
  icon: 'bi-envelope',
  path: '/admin/contactos'
     },
  ];

  return (
    <div
      className="admin-shell"
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: '#f3f4f6'
      }}
    >

      <button
        type="button"
        className="admin-drawer-toggle"
        onClick={() => setDrawerOpen(true)}
        aria-label="Abrir menu de administração"
        aria-controls="admin-navigation"
        aria-expanded={drawerOpen}
      >
        <i className="bi bi-list" aria-hidden="true" />
      </button>

      <button
        type="button"
        className={`admin-drawer-overlay ${drawerOpen ? 'is-visible' : ''}`}
        onClick={() => setDrawerOpen(false)}
        aria-label="Fechar menu de administração"
        tabIndex={drawerOpen ? 0 : -1}
      />

      {/* SIDEBAR */}
      <aside
        id="admin-navigation"
        className={`admin-shell__sidebar ${drawerOpen ? 'is-open' : ''}`}
        style={{
          width: '240px',
          background: '#050b23',
          color: '#fff',
          padding: '1.5rem 1rem'
        }}
      >

        <button
          type="button"
          className="admin-drawer-close"
          onClick={() => setDrawerOpen(false)}
          aria-label="Fechar menu"
        >
          <i className="bi bi-x-lg" aria-hidden="true" />
        </button>

        <Link
          to="/admin"
          aria-label="Ir para o dashboard"
          style={{
            display: 'inline-flex',
            marginBottom: '2rem',
            textDecoration: 'none'
          }}
        >
          <VisonLogo size="md" dark />
        </Link>

        <nav className="admin-shell__nav" aria-label="Navegação de administração">

          {menu.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              onClick={() => setDrawerOpen(false)}
              className={`admin-shell__link ${location.pathname === item.path ? 'is-active' : ''}`}
              style={{
                textDecoration: 'none',
                color:
                  location.pathname === item.path
                    ? '#fff'
                    : '#9ca3af',

                background:
                  location.pathname === item.path
                    ? 'rgba(255,255,255,0.08)'
                    : 'transparent',

                padding: '0.9rem 1rem',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem'
              }}
            >
              <i className={`bi ${item.icon}`}></i>
              {item.name}
            </Link>
          ))}

        </nav>

      </aside>

      {/* CONTEÚDO */}
      <main
        className="admin-shell__main"
        style={{
          flex: 1,
          padding: '2rem'
        }}
      >
        <Outlet />
      </main>

    </div>
  );
}
