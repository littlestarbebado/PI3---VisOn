import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const cardStyle = {
  background: '#ffffff',
  borderRadius: '16px',
  border: '1px solid #e5e7eb',
  boxShadow: '0 12px 30px rgba(17, 24, 39, 0.08)'
};

const sectionTitleStyle = {
  color: '#111827',
  fontWeight: 800,
  fontSize: '1.05rem',
  marginBottom: '1rem'
};

const quickActions = [
  { label: 'Gerir Conteúdos', icon: 'bi-file-text' },
  { label: 'Criar Novo Utilizador', icon: 'bi-person-plus' },
  { label: 'Gerir Documentos', icon: 'bi-folder' },
  { label: 'Ver Logs de Atividade', icon: 'bi-clock-history' },
  { label: 'Abrir Suporte / Chat', icon: 'bi-chat-dots' }
];

const recentActivities = [
  {
    author: 'Gestor Silva',
    action: 'Upload de Documento',
    description: "Carregou 'Relatório de Avaliação de Risco' para TechCorp",
    date: 'Hoje, 10:42'
  },
  {
    author: 'Admin Marta',
    action: 'Criação de Utilizador',
    description: 'Criou o acesso do gestor operacional para a área administrativa',
    date: 'Hoje, 09:18'
  },
  {
    author: 'Gestor Ramos',
    action: 'Atualização de Cliente',
    description: 'Atualizou os dados de contacto e o estado do cliente BlueWave',
    date: 'Ontem, 17:05'
  },
  {
    author: 'Sistema VisOn',
    action: 'Sincronização',
    description: 'Validou documentos recentes e recalculou indicadores do dashboard',
    date: 'Ontem, 14:30'
  }
];

export default function Dashboard() {
  const [data, setData] = useState({
    clientes: 0,
    utilizadores: 0,
    documentos: 0,
    atividade: 0,
    clientesRecentes: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/auth/stats')
      .then(res => {
        setData({
          clientes: res.data.clientes || 0,
          utilizadores: res.data.utilizadores || 0,
          documentos: res.data.documentos || 0,
          atividade: res.data.atividade || 0,
          clientesRecentes: res.data.clientesRecentes || []
        });
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
      value: data.clientes,
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
      value: data.documentos,
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
    return <div className="p-4 fw-bold" style={{ color: '#111827' }}>A carregar dados do servidor...</div>;
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
        {stats.map((item) => (
          <div key={item.title} className="col-md-3">
            <div
              style={{
                ...cardStyle,
                padding: '1.5rem',
                transition: 'transform 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p style={{ color: '#4b5563', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                    {item.title}
                  </p>
                  <h2 style={{ fontWeight: 800, color: '#111827', fontSize: '2.2rem', margin: 0, letterSpacing: '-0.03em' }}>
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

        <div className="col-md-5">
          <div style={{ ...cardStyle, padding: '1.5rem', height: '100%' }}>
            <h3 style={sectionTitleStyle}>Ações Rápidas</h3>
            <div className="d-flex flex-column gap-3">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  className="btn d-flex align-items-center text-start"
                  style={{
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    color: '#111827',
                    fontWeight: 700,
                    padding: '0.9rem 1rem',
                    boxShadow: '0 4px 12px rgba(17, 24, 39, 0.04)'
                  }}
                >
                  <i className={`bi ${action.icon} me-3`} style={{ color: '#2563eb', fontSize: '1.15rem' }}></i>
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="col-md-7">
          <div style={{ ...cardStyle, padding: '1.5rem', height: '100%' }}>
            <h3 style={sectionTitleStyle}>Clientes Recentes</h3>
            <div className="d-flex flex-column">
              {data.clientesRecentes && data.clientesRecentes.length > 0 ? (
                data.clientesRecentes && data.clientesRecentes.map((cliente, index) => (
                  <div
                    key={cliente.id || index}
                    className="d-flex justify-content-between align-items-center flex-wrap gap-3"
                    style={{
                      padding: '1rem 0',
                      borderBottom: index === data.clientesRecentes.length - 1 ? '0' : '1px solid #e5e7eb'
                    }}
                  >
                    <div>
                      <p style={{ color: '#111827', fontWeight: 800, marginBottom: '0.25rem' }}>
                        {cliente.nome}
                      </p>
                      <p style={{ color: '#4b5563', margin: 0, fontSize: '0.92rem' }}>
                        {cliente.email}
                      </p>
                    </div>
                    <span
                      className="badge"
                      style={{
                        background: '#dbeafe',
                        color: '#1d4ed8',
                        border: '1px solid #bfdbfe',
                        borderRadius: '999px',
                        fontWeight: 800,
                        padding: '0.55rem 0.85rem'
                      }}
                    >
                      Score: {cliente.score ?? 0}
                    </span>
                  </div>
                ))
              ) : (
                <p style={{ color: '#4b5563', margin: 0 }}>Ainda não existem clientes recentes para apresentar.</p>
              )}
            </div>
          </div>
        </div>

        <div className="col-12">
          <div style={{ ...cardStyle, padding: '1.5rem' }}>
            <h3 style={sectionTitleStyle}>Atividade Recente</h3>
            <div className="d-flex flex-column">
              {recentActivities.map((activity, index) => (
                <div
                  key={`${activity.author}-${activity.action}`}
                  className="d-flex align-items-start gap-3"
                  style={{
                    padding: index === 0 ? '0 0 1.15rem' : '1.15rem 0',
                    borderBottom: index === recentActivities.length - 1 ? '0' : '1px solid #e5e7eb'
                  }}
                >
                  <span
                    style={{
                      width: '11px',
                      height: '11px',
                      minWidth: '11px',
                      marginTop: '0.45rem',
                      borderRadius: '999px',
                      background: '#2563eb',
                      boxShadow: '0 0 0 4px #dbeafe'
                    }}
                  ></span>
                  <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 w-100">
                    <div>
                      <p style={{ color: '#111827', fontWeight: 800, marginBottom: '0.25rem' }}>
                        {activity.author}
                        <span style={{ color: '#4b5563', fontWeight: 700 }}> · {activity.action}</span>
                      </p>
                      <p style={{ color: '#4b5563', margin: 0, fontSize: '0.93rem' }}>
                        {activity.description}
                      </p>
                    </div>
                    <span style={{ color: '#9ca3af', fontSize: '0.88rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                      {activity.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
