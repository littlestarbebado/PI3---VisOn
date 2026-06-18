import React, { useState } from 'react';

export default function ServicosAdmin() {
  const [servicos, setServicos] = useState([
    {
      titulo: 'Avaliação de Maturidade IT',
      descricao:
        'Análise completa do nível de maturidade da sua infraestrutura tecnológica e práticas de segurança.'
    },
    {
      titulo: 'Testes de Penetração (PenTest)',
      descricao:
        'Simulação de ataques reais para identificar vulnerabilidades antes dos atacantes.'
    },
    {
      titulo: 'Conformidade NIS I/II',
      descricao:
        'Apoio à implementação e manutenção da conformidade com as diretivas europeias de cibersegurança.'
    },
    {
      titulo: 'Formação em Cibersegurança',
      descricao:
        'Programas de formação personalizados para equipas técnicas e utilizadores finais.'
    },
    {
      titulo: 'Gestão de Incidentes',
      descricao:
        'Apoio na deteção, resposta e recuperação de incidentes de segurança.'
    },
    {
      titulo: 'Consultoria em Cibersegurança',
      descricao:
        'Aconselhamento estratégico para definição e implementação de políticas de segurança.'
    }
  ]);

  const apagarServico = (index) => {
    const novos = [...servicos];
    novos.splice(index, 1);
    setServicos(novos);
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
          style={{
            background: '#050b23',
            color: 'white',
            border: 'none',
            padding: '12px 20px',
            borderRadius: '10px',
            fontWeight: '600'
          }}
        >
          + Novo Serviço
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '20px'
        }}
      >
        {servicos.map((item, index) => (
          <div
            key={index}
            style={{
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '14px',
              padding: '20px',
              minHeight: '150px'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '15px'
              }}
            >
              <h4
                style={{
                  fontWeight: '700',
                  color: '#111827',
                  margin: 0,
                  width: '85%',
                  lineHeight: '1.3'
                }}
              >
                {item.titulo}
              </h4>

              <div
                style={{
                  display: 'flex',
                  gap: '12px'
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
                  onClick={() => apagarServico(index)}
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
                lineHeight: '1.6',
                margin: 0
              }}
            >
              {item.descricao}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}