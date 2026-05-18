import React, { useState } from 'react';

export default function ServicosAdmin() {

  const [servicos, setServicos] = useState([
    {
      titulo: 'Avaliação de Maturidade IT',
      descricao:
        'Análise completa do nível de maturidade da sua infraestrutura tecnológica.'
    },
    {
      titulo: 'Testes de Penetração (PenTest)',
      descricao:
        'Simulação de ataques reais para identificar vulnerabilidades.'
    }
  ]);

  const apagarServico = (index) => {
    const novos = [...servicos];
    novos.splice(index, 1);
    setServicos(novos);
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
            Serviços
          </h2>

          <p
            style={{
              color: '#6b7280',
              margin: 0
            }}
          >
            Gerir serviços disponibilizados
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
          Novo Serviço
        </button>

      </div>

      <div className="row g-4">

        {servicos.map((item, index) => (

          <div
            key={index}
            className="col-md-6"
          >

            <div
              style={{
                background: '#fff',
                borderRadius: '14px',
                border: '1px solid #e5e7eb',
                padding: '1.3rem'
              }}
            >

              <div className="d-flex justify-content-between mb-3">

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
                    onClick={() => apagarServico(index)}
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
                  color: '#6b7280',
                  margin: 0
                }}
              >
                {item.descricao}
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}