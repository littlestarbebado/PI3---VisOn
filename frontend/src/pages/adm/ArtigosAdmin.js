import React, { useState } from 'react';

export default function ArtigosAdmin() {

  const [artigos, setArtigos] = useState([
    {
      titulo: 'NIS2: O que muda para as empresas portuguesas',
      descricao:
        'A Diretiva NIS2 traz novas obrigações para empresas.',
      autor: 'Dr. António Silva',
      data: '2024-03-15',
      tag: 'Regulamentação'
    },
    {
      titulo: 'Pentesting: Como proteger a sua infraestrutura',
      descricao:
        'Os testes de penetração são essenciais.',
      autor: 'Eng. Maria Costa',
      data: '2024-03-10',
      tag: 'Segurança'
    }
  ]);

  const apagarArtigo = (index) => {
    const novos = [...artigos];
    novos.splice(index, 1);
    setArtigos(novos);
  };

  return (
    <div>

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>

          <h2
            style={{
              fontWeight: 800,
              marginBottom: '0.3rem'
            }}
          >
            Artigos
          </h2>

          <p
            style={{
              color: '#6b7280',
              margin: 0
            }}
          >
            Gerir artigos técnicos
          </p>

        </div>

        <button
          className="btn"
          style={{
            background: '#050b23',
            color: '#fff',
            borderRadius: '10px'
          }}
        >
          <i className="bi bi-plus-lg me-2"></i>
          Novo Artigo
        </button>

      </div>

      <div
        style={{
          background: '#fff',
          borderRadius: '14px',
          border: '1px solid #e5e7eb',
          padding: '1rem'
        }}
      >

        {artigos.map((item, index) => (

          <div
            key={index}
            style={{
              background: '#f9fafb',
              borderRadius: '12px',
              padding: '1rem',
              marginBottom: '1rem'
            }}
          >

            <div className="d-flex justify-content-between mb-2">

              <h5
                style={{
                  fontWeight: 700
                }}
              >
                {item.titulo}
              </h5>

              <div className="d-flex gap-2">

                <button
                  style={{
                    border: 'none',
                    background: 'transparent'
                  }}
                >
                  <i className="bi bi-pencil"></i>
                </button>

                <button
                  onClick={() => apagarArtigo(index)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    color: '#ef4444'
                  }}
                >
                  <i className="bi bi-trash"></i>
                </button>

              </div>

            </div>

            <p
              style={{
                color: '#6b7280'
              }}
            >
              {item.descricao}
            </p>

            <div className="d-flex gap-2 align-items-center">

              <small>{item.autor}</small>

              <small
                style={{
                  color: '#9ca3af'
                }}
              >
                {item.data}
              </small>

              <span
                style={{
                  background: '#dbeafe',
                  color: '#2563eb',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '999px',
                  fontSize: '0.75rem'
                }}
              >
                {item.tag}
              </span>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}