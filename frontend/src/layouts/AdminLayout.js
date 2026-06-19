import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import VisonLogo from '../components/VisonLogo';

export default function AdminLayout() {

  const location = useLocation();

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
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: '#f3f4f6'
      }}
    >

      {/* SIDEBAR */}
      <aside
        style={{
          width: '240px',
          background: '#050b23',
          color: '#fff',
          padding: '1.5rem 1rem'
        }}
      >

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

        <div className="d-flex flex-column gap-2">

          {menu.map((item, index) => (
            <Link
              key={index}
              to={item.path}
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

        </div>

      </aside>

      {/* CONTEÚDO */}
      <main
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
