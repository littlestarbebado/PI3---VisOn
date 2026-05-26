import React from 'react';

export default function SubmissoesCliente() {
  const zoneEstilo = {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '2rem',
    border: '2px dashed #d1d5db',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', padding: '1rem' }}>
      <h2 style={{ fontWeight: 800, color: '#111827', marginBottom: '0.3rem', letterSpacing: '-0.025em' }}>
        Submissões e Evidências
      </h2>
      <p style={{ color: '#4b5563', marginBottom: '2.5rem', fontSize: '0.95rem' }}>
        Envie os seus ficheiros técnicos e relatórios de incidentes para análise da equipa de gestão.
      </p>

      <div className="row g-4">
        {/* Upload Excel de Ativos */}
        <div className="col-md-6">
          <div style={zoneEstilo} onMouseEnter={(e) => e.currentTarget.style.borderColor = '#2563eb'} onMouseLeave={(e) => e.currentTarget.style.borderColor = '#d1d5db'}>
            <div style={{ fontSize: '2.5rem', color: '#16a34a', marginBottom: '1rem' }}>
              <i className="bi bi-file-earmark-excel"></i>
            </div>
            <h5 style={{ fontWeight: 700, color: '#1f2937' }}>Ativos Tecnológicos (Excel)</h5>
            <p style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Submeta o ficheiro Excel com o inventário dos seus servidores e sistemas para bonificação.
            </p>
            <button className="btn btn-dark btn-sm" style={{ borderRadius: '8px', padding: '0.5rem 1rem' }}>
              Selecionar Ficheiro
            </button>
          </div>
        </div>

        {/* Report de Incidentes CNCS */}
        <div className="col-md-6">
          <div style={zoneEstilo} onMouseEnter={(e) => e.currentTarget.style.borderColor = '#2563eb'} onMouseLeave={(e) => e.currentTarget.style.borderColor = '#d1d5db'}>
            <div style={{ fontSize: '2.5rem', color: '#dc2626', marginBottom: '1rem' }}>
              <i className="bi bi-exclamation-octagon"></i>
            </div>
            <h5 style={{ fontWeight: 700, color: '#1f2937' }}>Report de Incidentes (CNCS)</h5>
            <p style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Registe um incidente de segurança com base no formulário oficial do cncs.gov.pt.
            </p>
            <button className="btn btn-danger btn-sm" style={{ borderRadius: '8px', padding: '0.5rem 1rem' }}>
              Abrir Formulário CNCS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}