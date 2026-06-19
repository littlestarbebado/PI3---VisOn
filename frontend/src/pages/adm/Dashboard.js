import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import { EmptyState, LoadingState } from '../../components/StatePanel';
/*
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
*/

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
  { label: 'Gerir Conteúdos', icon: 'bi-file-text', path: '/admin/conteudos' },
  { label: 'Criar Novo Utilizador', icon: 'bi-person-plus', path: '/admin/utilizadores' },
  { label: 'Gerir Documentos', icon: 'bi-folder', path: '/admin/documentos' },
  { label: 'Ver Logs de Atividade', icon: 'bi-clock-history', path: '/admin/atividade' },
  { label: 'Abrir Suporte / Chat', icon: 'bi-chat-dots', path: '/admin/suporte' }
];

function formatarData(valor) {
  if (!valor) return '';

  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) return valor;

  return new Intl.DateTimeFormat('pt-PT', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(data);
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    clientes: 0,
    utilizadores: 0,
    documentos: 0,
    nis2Avaliacoes: 0,
    atividade: 0,
    clientesRecentes: []
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/auth/stats')
      .then(res => {
        setData({
          clientes: res.data.clientes || 0,
          utilizadores: res.data.utilizadores || 0,
          documentos: res.data.documentos || 0,
          nis2Avaliacoes: res.data.nis2Avaliacoes || 0,
          atividade: res.data.atividadeHoje ?? res.data.atividade ?? 0,
          clientesRecentes: res.data.clientesRecentes || []
        });
        setLoading(false);
      })
      .catch(err => {
        console.error('Erro ao carregar estatísticas:', err);
        setLoading(false);
      });

    api.get('/logs')
      .then(res => setRecentActivities(res.data || []))
      .catch(err => {
        console.error('Erro ao carregar logs:', err);
        setRecentActivities([]);
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
      title: 'Avaliações NIS2',
      value: data.nis2Avaliacoes,
      icon: 'bi-clipboard2-check',
      color: '#7c3aed',
      bgIcon: '#f5f3ff'
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
    return <LoadingState label="A preparar o dashboard CyberBox…" />;
  }

  return (
    <div className="private-dashboard admin-dashboard" style={{ fontFamily: 'Inter, sans-serif' }}>
      <span className="private-page-eyebrow">CyberBox Secur · Administração</span>
      <h2 style={{ fontWeight: 800, color: '#111827', marginBottom: '0.3rem', letterSpacing: '-0.025em' }}>
        Dashboard Administrador
      </h2>
      <p style={{ color: '#4b5563', marginBottom: '2.5rem', fontSize: '0.95rem' }}>
        Visão geral da operação, clientes e segurança em tempo real.
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

                <div className="col-12">
          <div
            style={{
              ...cardStyle,
              padding: '1.5rem'
            }}
          >
            <h3 style={sectionTitleStyle}>
              Estatísticas do Sistema
            </h3>

            <div style={{ width: '100%', height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
  { nome: 'Clientes', valor: data.clientes },
  { nome: 'Utilizadores', valor: data.utilizadores },
  { nome: 'Documentos', valor: data.documentos },
  { nome: 'Atividade', valor: data.atividade }
]}
                >
                  <XAxis dataKey="nome" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="valor" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            </div>

          </div>
        </div>
        {/*
<div className="col-12">
  <div
    style={{
      ...cardStyle,
      padding: '1.5rem'
    }}
  >
    <h3 style={sectionTitleStyle}>
      Estatísticas do Sistema
    </h3>

    <div style={{ width: '100%', height: '300px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={[
            { nome: 'Clientes', valor: data.clientes },
            { nome: 'Utilizadores', valor: data.utilizadores },
            { nome: 'Documentos', valor: data.documentos },
            { nome: 'Atividade', valor: data.atividade }
          ]}
        >
          <XAxis dataKey="nome" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="valor" fill="#2563eb" />
        </BarChart>
      </ResponsiveContainer>
    </div>

  </div>
</div>
*/}

        <div className="col-md-5">
          <div style={{ ...cardStyle, padding: '1.5rem', height: '100%' }}>
            <h3 style={sectionTitleStyle}>Ações Rápidas</h3>
            <div className="d-flex flex-column gap-3">
              {quickActions.map((action) => (
                <button
                  onClick={() => navigate(action.path)}
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
                <EmptyState icon="bi-buildings" title="Sem clientes recentes" description="Os novos clientes surgirão aqui." />
              )}
            </div>
          </div>
        </div>

        <div className="col-12">
          <div style={{ ...cardStyle, padding: '1.5rem' }}>
            <h3 style={sectionTitleStyle}>Atividade Recente</h3>
            <div className="d-flex flex-column">
              {recentActivities.length > 0 ? recentActivities.map((activity, index) => (
                <div
                  key={activity.id || `${activity.utilizador}-${activity.acao}-${activity.createdAt}`}
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
                        {activity.utilizador}
                        <span style={{ color: '#4b5563', fontWeight: 700 }}> · {activity.acao}</span>
                      </p>
                      <p style={{ color: '#4b5563', margin: 0, fontSize: '0.93rem' }}>
                        {activity.detalhes}
                      </p>
                    </div>
                    <span style={{ color: '#9ca3af', fontSize: '0.88rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                      {formatarData(activity.createdAt)}
                    </span>
                  </div>
                </div>
              )) : (
                <EmptyState icon="bi-activity" title="Sem atividade recente" description="As ações da equipa surgirão nesta cronologia." />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
