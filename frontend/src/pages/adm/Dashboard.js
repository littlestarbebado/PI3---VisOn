import React from 'react';

export default function Dashboard() {

  const stats = [
    {
      title: 'Clientes Ativos',
      value: 2,
      icon: 'bi-buildings'
    },
    {
      title: 'Utilizadores',
      value: 8,
      icon: 'bi-people'
    },
    {
      title: 'Documentos',
      value: 3,
      icon: 'bi-file-earmark-text'
    },
    {
      title: 'Atividade (Hoje)',
      value: 12,
      icon: 'bi-activity'
    }
  ];

  return (
    <div>

      <h2
        style={{
          fontWeight: 800,
          marginBottom: '0.3rem'
        }}
      >
        Dashboard Administrador
      </h2>

      <p
        style={{
          color: '#6b7280',
          marginBottom: '2rem'
        }}
      >
        Visão geral do sistema
      </p>

      <div className="row g-4">

        {stats.map((item, index) => (
          <div key={index} className="col-md-3">

            <div
              style={{
                background: '#fff',
                borderRadius: '14px',
                padding: '1.5rem',
                border: '1px solid #e5e7eb'
              }}
            >

              <div className="d-flex justify-content-between align-items-center">

                <div>

                  <p
                    style={{
                      color: '#6b7280',
                      fontSize: '0.85rem',
                      marginBottom: '0.3rem'
                    }}
                  >
                    {item.title}
                  </p>

                  <h2
                    style={{
                      fontWeight: 700,
                      margin: 0
                    }}
                  >
                    {item.value}
                  </h2>

                </div>

                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    background: '#eef4ff',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#2563eb',
                    fontSize: '1.2rem'
                  }}
                >
                  <i className={`bi ${item.icon}`}></i>
                </div>

              </div>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}