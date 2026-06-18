import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Incidents() {
  const [incidents, setIncidents] = useState([]);

  // Função para carregar a lista do backend
  const fetchIncidents = () => {
    axios.get('http://localhost:3000/api/incidents/list')
      .then(res => {
        if (res.data.success) setIncidents(res.data.incidents);
      })
      .catch(err => console.error("Erro ao carregar incidentes", err));
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  // Função para reportar um novo incidente (Dispara ao clicar no botão)
  const handleReportIncident = () => {
    const title = prompt("Digite a descrição/título do incidente:");
    if (!title) return; // Cancela se tiver vazio

    axios.post('http://localhost:3000/api/incidents/create', { title })
      .then(res => {
        if (res.data.success) {
          alert("Incidente reportado com sucesso!");
          fetchIncidents(); // Atualiza a lista automaticamente
        }
      })
      .catch(err => console.error("Erro ao criar incidente", err));
  };

  return (
    <div className="container-fluid bg-light min-vh-100 p-0" style={{ fontFamily: 'sans-serif' }}>
      {/* Barra de Topo */}
      <div className="navbar navbar-dark bg-dark px-4 py-3 shadow-sm">
        <span className="navbar-brand fw-bold fs-4">VIS <span className="badge bg-primary">ON</span></span>
      </div>

      <div className="container py-4" style={{ maxWidth: '900px' }}>
        {/* Cabeçalho */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="fw-bold m-0 h2">Incidentes</h1>
            <p className="text-muted small mb-0">Registo e acompanhamento de alertas de segurança</p>
          </div>
          {/* Botão Reportar */}
          <button 
            className="btn btn-danger fw-semibold px-3 py-2 d-flex align-items-center gap-2 shadow-sm"
            onClick={handleReportIncident}
            style={{ fontSize: '14px' }}
          >
            ⚠️ Reportar Incidente
          </button>
        </div>

        {/* Lista de Incidentes */}
        <div className="card p-4 border-0 shadow-sm">
          <h5 className="fw-bold text-dark mb-4 h6">Histórico de Alertas ({incidents.length})</h5>

          <div className="d-flex flex-column gap-3">
            {incidents.map((inc) => (
              <div 
                key={inc.id} 
                className="card p-3 border border-light-subtle rounded-3 d-flex flex-md-row justify-content-between align-items-md-center gap-3"
                style={{ backgroundColor: '#fff' }}
              >
                {/* Lado Esquerdo: Ícone + Título e Data */}
                <div className="d-flex align-items-center gap-3">
                  <div className="rounded-3 d-flex align-items-center justify-content-center bg-danger bg-opacity-10" style={{ width: '45px', height: '45px' }}>
                    <span className="fs-5 text-danger">⚠️</span>
                  </div>
                  <div>
                    <h6 className="m-0 fw-bold text-dark mb-1" style={{ fontSize: '15px' }}>{inc.title}</h6>
                    <small className="text-muted" style={{ fontSize: '12px' }}>{inc.date}</small>
                  </div>
                </div>

                {/* Lado Direito: Badge do Estado */}
                <div className="text-end">
                  <span 
                    className="badge rounded-pill px-3 py-2 fw-semibold"
                    style={{ 
                      fontSize: '12px',
                      backgroundColor: inc.status === 'Resolvido' ? '#e2f0d9' : '#fff3cd', 
                      color: inc.status === 'Resolvido' ? '#385723' : '#856404'
                    }}
                  >
                    • {inc.status}
                  </span>
                </div>
              </div>
            ))}

            {incidents.length === 0 && (
              <div className="text-center text-muted py-4">Nenhum incidente registado.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Incidents;