import React, { useState, useEffect } from 'react';
import api from '../../services/api'; // Usa a nossa API configurada na porta 5000!

export default function Dashboard() {
  // Estado para guardar os números reais vindos da BD
  const [data, setData] = useState({ clientes: 0, utilizadores: 0, documentos: 0, atividade: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Puxa as estatísticas assim que a página abre
    api.get('/auth/stats')
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erro ao carregar estatísticas:', err);
        setLoading(false);
      });
  }, []);

  const stats = [
    {
      title: 'Clientes Ativos',
      value: data.clientes, // LIDO DA BD!
      icon: 'bi-buildings',
      color: '#2563eb',
      bgIcon: '#eef4ff'
    },
    {
      title: 'Utilizadores',
      value: data.utilizadores,
      icon: 'bi-people',
      color: '#16a34a',
      bgIcon: '#f0fdf4'
    },
    {
      title: 'Documentos',
      value: data.documentos, // LIDO DA BD!
      icon: 'bi-file-earmark-text',
      color: '#dc2626',
      bgIcon: '#fef2f2'
    },
    {
      title: 'Atividade (Hoje)',
      value: data.atividade,
      icon: 'bi-activity',
      color: '#ca8a04',
      bgIcon: '#fefce8'
    }
  ];

  if (loading) {
    return <div className="p-4 text-dark fw-bold">A carregar dados do servidor...</div>;
  }

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <h2 style={{ fontWeight: 800, color: '#111827', marginBottom: '0.3rem', letterSpacing: '-0.025em' }}>
        Dashboard Administrador
      </h2>
      <p style={{ color: '#4b5563', marginBottom: '2.5rem', fontSize: '0.95rem' }}>
        Visão geral do sistema em tempo real com dados do PostgreSQL.
      </p>

      <div className="row g-4">
        {stats.map((item, index) => (
          <div key={index} className="col-md-3">
            <div
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '1.5rem',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                transition: 'transform 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p style={{ color: '#6b7280', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                    {item.title}
                  </p>
                  <h2 style={{ fontWeight: 800, color: '#1f2937', fontSize: '2.2rem', margin: 0, letterSpacing: '-0.03em' }}>
                    {item.value}
                  </h2>
                </div>
                <div style={{ width: '52px', height: '52px', background: item.bgIcon, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color, fontSize: '1.4rem' }}>
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