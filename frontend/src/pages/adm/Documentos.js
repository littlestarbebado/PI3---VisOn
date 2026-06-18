import React, { useState } from 'react';

import CarregarDocumentoModal from './CarregarDocumentoModal';

export default function Documentos() {

  const [showModal, setShowModal] = useState(false);

  const documentos = [
    {
      nome: 'Relatório de Avaliação de Risco - Q1 2024',
      cliente: 'TechCorp Solutions',
      data: '2024-03-20',
      categoria: 'Relatório',
      categoriaCor: '#2563eb',
      tipo: 'PDF',
      tamanho: '2.4 MB',
      autor: 'Gestor Silva'
    },
    {
      nome: 'Política de Segurança da Informação',
      cliente: 'TechCorp Solutions',
      data: '2024-03-18',
      categoria: 'Documentação',
      categoriaCor: '#16a34a',
      tipo: 'PDF',
      tamanho: '856 KB',
      autor: 'Admin'
    },
    {
      nome: 'PenTest Report - Infraestrutura Web',
      cliente: 'TechCorp Solutions',
      data: '2024-03-15',
      categoria: 'PenTest',
      categoriaCor: '#ef4444',
      tipo: 'PDF',
      tamanho: '3.1 MB',
      autor: 'Gestor Silva'
    }
  ];

  return (
    <div>

      <CarregarDocumentoModal
        show={showModal}
        onClose={() => setShowModal(false)}
      />

      <div
        className="d-flex justify-content-between align-items-center mb-4"
      >
        <div>

          <h2
            style={{
              fontWeight: 800,
              marginBottom: '0.3rem',
              color: '#111827'
            }}
          >
            Gestão de Documentos
          </h2>

          <p
            style={{
              color: '#64748b',
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
            padding: '0.7rem 1rem',
            fontWeight: 600
          }}
        >
          <i className="bi bi-upload me-2"></i>
          Carregar Documento
        </button>

      </div>

      <div
        style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '14px',
          padding: '1.25rem',
          marginBottom: '1.5rem'
        }}
      >

        <div className="row g-3">

          <div className="col-md-6">

            <label
              style={{
                fontWeight: 600,
                marginBottom: '0.5rem',
                display: 'block',
                color: '#111827'
              }}
            >
              Categoria
            </label>

            <select className="form-select">
              <option>Todas</option>
              <option>Relatório</option>
              <option>Documentação</option>
              <option>Pentest</option>
            </select>

          </div>

          <div className="col-md-6">

            <label
              style={{
                fontWeight: 600,
                marginBottom: '0.5rem',
                display: 'block',
                color: '#111827'
              }}
            >
              Cliente
            </label>

            <select className="form-select">
              <option>Todos</option>
              <option>TechCorp Solutions</option>
            </select>

          </div>

        </div>

      </div>

      <div
        style={{
          background: '#fff',
          borderRadius: '14px',
          border: '1px solid #e5e7eb',
          padding: '1.25rem',
          
        }}
      >

        <h5
          style={{
            fontWeight: 700,
            marginBottom: '1.5rem',
            color: '#111827'
          }}
        >
          Documentos ({documentos.length})
        </h5>

        {documentos.map((doc, index) => (

          <div
            key={index}
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '1.2rem',
              marginBottom: '1rem',
              background: '#fff'
            }}
          >

            <div
              className="d-flex justify-content-between align-items-center"
            >

              <div className="d-flex align-items-center gap-3">

                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '12px',
                    background: '#eef4ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#2563eb',
                    fontSize: '22px'
                  }}
                >
                  <i className="bi bi-file-earmark-text"></i>
                </div>

                <div>

                  <div
                    className="d-flex align-items-center gap-2 flex-wrap"
                  >

                    <h6
                      style={{
                        margin: 0,
                        fontWeight: 700,
                        fontSize: '18px',
                        color: '#111827'
                      }}
                    >
                      {doc.nome}
                    </h6>

                    <span
                      style={{
                        background: `${doc.categoriaCor}20`,
                        color: doc.categoriaCor,
                        padding: '0.25rem 0.65rem',
                        borderRadius: '999px',
                        fontSize: '12px',
                        fontWeight: 600
                      }}
                    >
                      {doc.categoria}
                    </span>

                  </div>

                  <div
                    style={{
                      color: '#64748b',
                      fontSize: '14px',
                      marginTop: '6px'
                    }}
                  >
                    {doc.tipo}
                    {'  '}
                    {doc.tamanho}
                    {'  '}
                    Por {doc.autor}
                    {'  '}
                    {doc.data}
                  </div>

                  <div
                    style={{
                      color: '#2563eb',
                      fontSize: '14px',
                      marginTop: '4px'
                    }}
                  >
                    {doc.cliente}
                  </div>

                </div>

              </div>

              <div
                className="d-flex gap-3"
              >

                <button
                  style={{
                    border: 'none',
                    background: 'transparent',
                    color: '#2563eb',
                    cursor: 'pointer',
                    fontSize: '18px'
                  }}
                >
                  <i className="bi bi-download"></i>
                </button>

                <button
                  style={{
                    border: 'none',
                    background: 'transparent',
                    color: '#ef4444',
                    cursor: 'pointer',
                    fontSize: '18px'
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