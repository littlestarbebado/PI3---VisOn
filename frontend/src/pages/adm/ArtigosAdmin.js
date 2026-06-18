import React, { useState } from 'react';

export default function ArtigosAdmin() {

  const [artigos, setArtigos] = useState([
    {
      id: 1,
      titulo: 'NIS2: O que muda para as empresas portuguesas',
      resumo:
        'A Diretiva NIS2 traz novas obrigações para empresas de setores essenciais e importantes. Saiba o que muda.',
      autor: 'Dr. António Silva',
      data: '2024-03-15',
      categoria: 'Regulamentação'
    },
    {
      id: 2,
      titulo: 'Pentesting: Como proteger a sua infraestrutura',
      resumo:
        'Os testes de penetração são essenciais para identificar vulnerabilidades antes dos atacantes.',
      autor: 'Eng. Maria Costa',
      data: '2024-03-10',
      categoria: 'Segurança Ofensiva'
    },
    {
      id: 3,
      titulo: 'Avaliação de Maturidade em Cibersegurança',
      resumo:
        'Conheça os níveis de maturidade e como evoluir a postura de segurança da sua organização.',
      autor: 'Dr. João Pereira',
      data: '2024-03-05',
      categoria: 'Governança'
    }
  ]);

  const apagarArtigo = (id) => {
    setArtigos(artigos.filter(a => a.id !== id));
  };

  return (
    <div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px'
        }}
      >
        <div>
          <h2
            style={{
              fontWeight: '800',
              color: '#111827',
              marginBottom: '5px'
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
            Gerir artigos técnicos do site público
          </p>
        </div>

        <button
          style={{
            background: '#050b23',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            padding: '12px 20px',
            fontWeight: '600'
          }}
        >
          + Novo Artigo
        </button>
      </div>

      <div
        style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '14px',
          padding: '20px'
        }}
      >

        {artigos.map((artigo) => (

          <div
            key={artigo.id}
            style={{
              background: '#f9fafb',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '15px'
            }}
          >

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '10px'
              }}
            >

              <h4
                style={{
                  fontWeight: '700',
                  color: '#111827',
                  margin: 0
                }}
              >
                {artigo.titulo}
              </h4>

              <div
                style={{
                  display: 'flex',
                  gap: '15px'
                }}
              >
                <button
                  style={{
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer'
                  }}
                >
                  ✏️
                </button>

                <button
                  onClick={() => apagarArtigo(artigo.id)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    color: 'red'
                  }}
                >
                  🗑️
                </button>
              </div>

            </div>

            <p
              style={{
                color: '#6b7280',
                marginBottom: '10px'
              }}
            >
              {artigo.resumo}
            </p>

            <div
              style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'center'
              }}
            >
              <small style={{ color: '#9ca3af' }}>
                {artigo.autor}
              </small>

              <small style={{ color: '#9ca3af' }}>
                {artigo.data}
              </small>

              <span
                style={{
                  background: '#dbeafe',
                  color: '#2563eb',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}
              >
                {artigo.categoria}
              </span>
            </div>

          </div>

        ))}

      </div>

    </div>
  );
}