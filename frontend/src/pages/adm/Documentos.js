import React, { useState } from 'react';

import CarregarDocumentoModal from './CarregarDocumentoModal';

export default function Documentos() {

  const [showModal, setShowModal] = useState(false);

  const documentos = [
    {
      nome: 'Relatório de Avaliação de Risco - Q1 2024',
      cliente: 'TechCorp Solutions',
      data: '2024-03-15',
      categoria: 'Relatório',
      categoriaCor: '#2563eb'
    },
    {
      nome: 'Política de Segurança da Informação',
      cliente: 'Digital Innovations',
      data: '2024-03-10',
      categoria: 'Documento',
      categoriaCor: '#16a34a'
    },
    {
      nome: 'Pentest Report - Infraestrutura Web',
      cliente: 'TechCorp Solutions',
      data: '2024-03-05',
      categoria: 'Pentest',
      categoriaCor: '#ef4444'
    }
  ];

  return (
    <div>

      {/* MODAL */}
      <CarregarDocumentoModal
        show={showModal}
        onClose={() => setShowModal(false)}
      />

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>

          <h2
            style={{
              fontWeight: 800,
              marginBottom: '0.3rem'
            }}
          >
            Gestão de Documentos
          </h2>

          <p
            style={{
              color: '#6b7280',
              margin: 0
            }}
          >
            Carregar e gerir documentos de clientes
          </p>

        </div>

        <button
          onClick={() => setShowModal(true)}
          className="btn"
          style={{
            background: '#050b23',
            color: '#fff',
            borderRadius: '10px',
            padding: '0.6rem 1rem',
            fontWeight: 600
          }}
        >
          <i className="bi bi-upload me-2"></i>
          Carregar Documento
        </button>

      </div>

      {/* FILTROS */}
      <div
        style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '14px',
          padding: '1rem',
          marginBottom: '1.5rem'
        }}
      >

        <div className="row g-3">

          <div className="col-md-6">

            <label
              style={{
                fontWeight: 600,
                marginBottom: '0.5rem',
                display: 'block'
              }}
            >
              Categoria
            </label>

            <select
              className="form-select"
            >
              <option>
                Todas
              </option>

              <option>
                Relatório
              </option>

              <option>
                Pentest
              </option>

            </select>

          </div>

          <div className="col-md-6">

            <label
              style={{
                fontWeight: 600,
                marginBottom: '0.5rem',
                display: 'block'
              }}
            >
              Cliente
            </label>

            <select
              className="form-select"
            >
              <option>
                Todos
              </option>

              <option>
                TechCorp Solutions
              </option>

              <option>
                Digital Innovations
              </option>

            </select>

          </div>

        </div>

      </div>

      {/* LISTA */}
      <div
        style={{
          background: '#fff',
          borderRadius: '14px',
          border: '1px solid #e5e7eb',
          padding: '1rem'
        }}
      >

        <h5
          style={{
            fontWeight: 700,
            marginBottom: '1.5rem'
          }}
        >
          Documentos ({documentos.length})
        </h5>

        {documentos.map((doc, index) => (

          <div
            key={index}
            style={{
              border: '1px solid #f1f5f9',
              borderRadius: '12px',
              padding: '1rem',
              marginBottom: '1rem',
              background: '#fff'
            }}
          >

            <div className="d-flex justify-content-between align-items-center">

              {/* ESQUERDA */}
              <div className="d-flex align-items-center gap-3">

                {/* ÍCONE */}
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: '#eef4ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#2563eb'
                  }}
                >
                  <i className="bi bi-file-earmark-text"></i>
                </div>

                {/* INFO */}
                <div>

                  <div className="d-flex align-items-center gap-2 flex-wrap">

                    <h6
                      style={{
                        margin: 0,
                        fontWeight: 700
                      }}
                    >
                      {doc.nome}
                    </h6>

                    <span
                      style={{
                        background: `${doc.categoriaCor}20`,
                        color: doc.categoriaCor,
                        padding: '0.2rem 0.6rem',
                        borderRadius: '999px',
                        fontSize: '0.72rem',
                        fontWeight: 600
                      }}
                    >
                      {doc.categoria}
                    </span>

                  </div>

                  <small
                    style={{
                      display: 'block',
                      color: '#6b7280'
                    }}
                  >
                    {doc.cliente}
                  </small>

                  <small
                    style={{
                      display: 'block',
                      color: '#9ca3af'
                    }}
                  >
                    {doc.data}
                  </small>

                </div>

              </div>

              {/* AÇÕES */}
              <div className="d-flex gap-3">

                <button
                  style={{
                    border: 'none',
                    background: 'transparent',
                    color: '#2563eb',
                    cursor: 'pointer'
                  }}
                >
                  <i className="bi bi-download"></i>
                </button>

                <button
                  style={{
                    border: 'none',
                    background: 'transparent',
                    color: '#ef4444',
                    cursor: 'pointer'
                  }}
                >
                  <i className="bi bi-trash"></i>
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}   