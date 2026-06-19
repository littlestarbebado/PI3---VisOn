import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { EmptyState, LoadingState } from '../../components/StatePanel';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

function classificarRisco(score) {
  if (score <= 30) return { nivel: 'Alto', cor: '#dc2626' };
  if (score <= 70) return { nivel: 'Médio', cor: '#ca8a04' };
  return { nivel: 'Baixo', cor: '#16a34a' };
}

function estadoNIS2Label(estado) {
  return {
    'Nao Iniciado': 'Não Iniciado',
    'Em Analise': 'Em Análise',
    Conforme: 'Conforme',
    'Nao Conforme': 'Não Conforme'
  }[estado] || 'Não Iniciado';
}

export default function DashboardCliente() {
  const { user } = useAuth(); // Vai buscar os dados da empresa logada
  const [documentos, setDocumentos] = useState([]);
  const [nis2, setNis2] = useState(null);
  const [nis2Evidencias, setNis2Evidencias] = useState([]);
  const [loading, setLoading] = useState(true);

  // Como o score real está na BD, usamos o que vem do login ou pomos um fallback slay
  const scoreSeguranca = user?.score ?? 0;
  const risco = classificarRisco(scoreSeguranca);

  useEffect(() => {
    // Busca os documentos específicos desta empresa
    api.get('/documentos')
      .then(res => {
        setDocumentos(res.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erro ao carregar dados do cliente:', err);
        setLoading(false);
      });

    api.get('/nis2')
      .then(response => {
        setNis2(response.data.avaliacao);
        setNis2Evidencias(response.data.evidencias || []);
      })
      .catch(() => setNis2(null));
  }, []);

  return (
    <div className="private-dashboard client-dashboard" style={{ fontFamily: 'Inter, sans-serif', padding: '1rem' }}>
      <span className="private-page-eyebrow">CyberBox Secur · Área do Cliente</span>
      {/* Cabeçalho */}
      <h2 style={{ fontWeight: 800, color: '#111827', marginBottom: '0.3rem', letterSpacing: '-0.025em' }}>
        Painel da Empresa
      </h2>
      <p style={{ color: '#4b5563', marginBottom: '2.5rem', fontSize: '0.95rem' }}>
        Bem-vindo à CyberBox, <strong style={{ color: '#2563eb' }}>{user?.nome || 'Empresa Cliente'}</strong>. Monitorize o seu estado de cibersegurança.
      </p>

      <div className="row g-4">
        <div className="col-12">
          <div style={{ background: '#111827', borderRadius: '12px', padding: '1.2rem 1.4rem', border: '1px solid #1f2937', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <p style={{ color: '#93c5fd', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Interacao com o Gestor
              </p>
              <h5 style={{ color: '#ffffff', fontWeight: 800, margin: 0 }}>Pedidos de esclarecimento</h5>
            </div>
            <div className="d-flex gap-2 flex-wrap">
              <Link to="/cliente/submissoes" className="btn btn-primary fw-bold" style={{ borderRadius: '8px' }}>
                Submissões e Evidências
              </Link>
              <Link to="/cliente/chat" className="btn btn-info text-dark fw-bold" style={{ borderRadius: '8px' }}>
                Abrir Chat
              </Link>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
                <div>
                  <small className="text-uppercase text-muted fw-bold">Conformidade</small>
                  <h4 className="fw-bold mb-0">Avaliação NIS2</h4>
                </div>
                <span className={`badge ${nis2?.estado === 'Conforme' ? 'bg-success' : nis2?.estado === 'Nao Conforme' ? 'bg-danger' : 'bg-primary'}`}>
                  {estadoNIS2Label(nis2?.estado)}
                </span>
              </div>
              <div className="progress mb-3" style={{ height: 12 }}>
                <div className="progress-bar" style={{ width: `${nis2?.percentagem || 0}%` }}>
                  {nis2?.percentagem || 0}%
                </div>
              </div>
              <p className="text-muted mb-0">
                {nis2?.observacoes || 'A avaliação NIS2 ainda não tem observações.'}
              </p>
              {nis2Evidencias.length > 0 && (
                <div className="mt-3">
                  <small className="fw-bold text-muted">Evidências associadas:</small>
                  <ul className="mb-0 mt-1">
                    {nis2Evidencias.map(documento => <li key={documento.id}>{documento.nome}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card do Score de Risco */}
        <div className="col-md-4">
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <p style={{ color: '#6b7280', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
              Score de Segurança
            </p>
            <div className="d-flex align-items-baseline gap-2">
              <h2 style={{ fontWeight: 800, color: '#111827', fontSize: '3rem', margin: 0 }}>{scoreSeguranca}</h2>
              <span style={{ color: '#6b7280', fontWeight: 500 }}>/ 100</span>
            </div>
            {/* Barra de Progresso Estilizada */}
            <div className="progress mt-3" style={{ height: '8px', borderRadius: '4px', background: '#e5e7eb' }}>
              <div 
                className="progress-bar" 
                role="progressbar" 
                style={{ width: `${scoreSeguranca}%`, background: risco.cor, borderRadius: '4px' }}
              ></div>
            </div>
            <p style={{ fontSize: '0.8rem', color: risco.cor, marginTop: '0.75rem', marginBottom: 0, fontWeight: 700 }}>
              Nível de risco: {risco.nivel}
            </p>
          </div>
        </div>

        {/* Card de Documentação Disponibilizada */}
        <div className="col-md-8">
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <p style={{ color: '#6b7280', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
              Documentos & Relatórios Emitidos
            </p>
            
            {loading ? (
              <LoadingState compact label="A carregar relatórios…" />
            ) : documentos.length === 0 ? (
              <EmptyState icon="bi-file-earmark-text" title="Ainda não existem documentos" description="Os relatórios disponibilizados pela equipa aparecerão aqui." />
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle" style={{ margin: 0 }}>
                  <thead>
                    <tr style={{ color: '#374151', fontSize: '0.85rem' }}>
                      <th>Ficheiro</th>
                      <th>Data de Emissão</th>
                      <th className="text-end">Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documentos.map(doc => (
                      <tr key={doc.id} style={{ fontSize: '0.9rem' }}>
                        <td style={{ fontWeight: 500, color: '#111827' }}>
                          <i className="bi bi-file-earmark-pdf text-danger me-2"></i> {doc.nome}
                        </td>
                        <td style={{ color: '#6b7280' }}>{new Date(doc.createdAt).toLocaleDateString('pt-PT')}</td>
                        <td className="text-end">
                          {doc.caminho && <a href={`${BACKEND_URL}${doc.caminho}`} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary" style={{ borderRadius: '8px', fontWeight: 500 }}>
                            <i className="bi bi-download me-1"></i> Descarregar
                          </a>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
