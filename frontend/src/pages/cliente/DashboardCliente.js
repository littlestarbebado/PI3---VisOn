import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function DashboardCliente() {
  const { user } = useAuth(); // Vai buscar os dados da empresa logada
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Como o score real está na BD, usamos o que vem do login ou pomos um fallback slay
  const scoreSeguranca = user?.score || 75; 

  useEffect(() => {
    // Busca os documentos específicos desta empresa
    api.get('/auth/stats') // Reutiliza a rota de estatísticas por agora
      .then(res => {
        // Mock de documentos caso a rota global ainda não filtre por ID de cliente
        setDocumentos([
          { id: 1, nome: 'Relatório de Avaliação de Risco - Q1 2026.pdf', data: '2026-05-20' },
          { id: 2, nome: 'Políticas de Segurança Interna - V1.pdf', data: '2026-05-15' }
        ]);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erro ao carregar dados do cliente:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', padding: '1rem' }}>
      {/* Cabeçalho */}
      <h2 style={{ fontWeight: 800, color: '#111827', marginBottom: '0.3rem', letterSpacing: '-0.025em' }}>
        Painel da Empresa
      </h2>
      <p style={{ color: '#4b5563', marginBottom: '2.5rem', fontSize: '0.95rem' }}>
        Bem-vindo, <strong style={{ color: '#2563eb' }}>{user?.nome || 'Empresa Cliente'}</strong>. Monitorize o seu estado de cibersegurança.
      </p>

      <div className="row g-4">
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
                style={{ width: `${scoreSeguranca}%`, background: scoreSeguranca > 70 ? '#16a34a' : '#ca8a04', borderRadius: '4px' }}
              ></div>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.75rem', marginWith: 0 }}>
              {scoreSeguranca > 70 ? '🟢 Nível de risco: Baixo' : '🟡 Nível de risco: Moderado'}
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
              <p style={{ color: '#4b5563' }}>A carregar relatórios...</p>
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
                        <td style={{ color: '#6b7280' }}>{doc.data}</td>
                        <td className="text-end">
                          <button className="btn btn-sm btn-outline-primary" style={{ borderRadius: '8px', fontWeight: 500 }}>
                            <i className="bi bi-download me-1"></i> Descarregar
                          </button>
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