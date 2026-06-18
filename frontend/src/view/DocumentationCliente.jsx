import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Documentation() {
  const [docs, setDocs] = useState([]);
  const [search, setSearch] = useState('');

  // Vai buscar os documentos da API ao carregar a página ou pesquisar
  useEffect(() => {
    axios.get(`http://localhost:3000/api/documents/list?search=${search}`)
      .then(res => {
        if (res.data.success) setDocs(res.data.documents);
      })
      .catch(err => console.error("Erro ao carregar documentos", err));
  }, [search]);

  // Função auxiliar para dar a cor correta às Badges (etiquetas) da foto
  const getTagStyle = (tag) => {
    if (tag === 'Relatório') return { backgroundColor: '#e0f7fa', color: '#00acc1' };
    if (tag === 'Documentação') return { backgroundColor: '#f3e5f5', color: '#8e24aa' };
    return { backgroundColor: '#fce4ec', color: '#d81b60' }; // PentTest
  };

  return (
    <div className="container-fluid bg-light min-vh-100 p-0" style={{ fontFamily: 'sans-serif' }}>
      {/* Barra de Topo */}
      <div className="navbar navbar-dark bg-dark px-4 py-3 shadow-sm">
        <span className="navbar-brand fw-bold fs-4">VIS <span className="badge bg-primary">ON</span></span>
      </div>

      <div className="container py-4" style={{ maxWidth: '1000px' }}>
        {/* Cabeçalho principal */}
        <div className="mb-4">
          <h1 className="fw-bold m-0 h2">Documentação</h1>
          <p className="text-muted small">Consulte e descarregue documentos disponibilizados</p>
        </div>

        {/* Caixa de Pesquisa */}
        <div className="card p-4 border-0 shadow-sm mb-4">
          <label className="fw-semibold text-dark mb-2 small">Pesquisar Documentos</label>
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0 text-muted">🔍</span>
            <input 
              type="text" 
              className="form-control bg-light border-start-0 ps-1 small" 
              placeholder="Pesquisar por nome..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ fontSize: '14px' }}
            />
          </div>
        </div>

        {/* Bloco de Listagem de Documentos */}
        <div className="card p-4 border-0 shadow-sm">
          <h5 className="fw-bold text-dark mb-4 h6">Seus Documentos ({docs.length})</h5>

          <div className="d-flex flex-column gap-3">
            {docs.map((doc) => (
              <div 
                key={doc.id} 
                className="card p-3 border border-light-subtle rounded-3 d-flex flex-md-row justify-content-between align-items-md-center gap-3"
                style={{ backgroundColor: '#fff' }}
              >
                {/* Lado Esquerdo: Ícone + Info */}
                <div className="d-flex align-items-center gap-3">
                  <div className="rounded-3 d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px', backgroundColor: '#e8f0fe' }}>
                    <span className="fs-5 text-primary">📄</span>
                  </div>
                  <div>
                    <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                      <h6 className="m-0 fw-bold text-dark" style={{ fontSize: '15px' }}>{doc.title}</h6>
                      <span className="badge rounded-pill fw-medium px-2 py-1" style={getTagStyle(doc.tag)}>
                        {doc.tag}
                      </span>
                    </div>
                    <div className="text-muted" style={{ fontSize: '12px' }}>
                      <span className="fw-semibold">{doc.type}</span> &nbsp;•&nbsp; {doc.size} &nbsp;•&nbsp; Carregado por {doc.uploadedBy} {doc.date}
                    </div>
                  </div>
                </div>

                {/* Lado Direito: Botão Descarregar */}
                <div className="text-end">
                  <button className="btn btn-sm btn-light border px-3 py-2 fw-semibold d-inline-flex align-items-center gap-1" style={{ fontSize: '13px' }}>
                    📥 Descarregar
                  </button>
                </div>
              </div>
            ))}

            {docs.length === 0 && (
              <div className="text-center text-muted py-4">Nenhum documento encontrado com esse nome.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Documentation;