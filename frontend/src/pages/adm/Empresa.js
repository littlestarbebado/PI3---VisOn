import React, { useState } from 'react';

export default function Empresa() {

  const [valores, setValores] = useState([
    {
      titulo: 'Confiança',
      descricao: 'Descrição do valor'
    },
    {
      titulo: 'Excelência',
      descricao: 'Descrição do valor'
    },
    {
      titulo: 'Inovação',
      descricao: 'Descrição do valor'
    },
    {
      titulo: 'Responsabilidade',
      descricao: 'Descrição do valor'
    }
  ]);

  const adicionarValor = () => {
    setValores([
      ...valores,
      {
        titulo: '',
        descricao: ''
      }
    ]);
  };

  return (
    <div>

      <h2
        style={{
          fontWeight: 800,
          marginBottom: '0.3rem'
        }}
      >
        Empresa
      </h2>

      <p
        style={{
          color: '#6b7280',
          marginBottom: '2rem'
        }}
      >
        Gerir informações institucionais
      </p>

      <div
        style={{
          background: '#fff',
          borderRadius: '14px',
          padding: '1.5rem',
          border: '1px solid #e5e7eb',
          maxWidth: '900px'
        }}
      >

        <div className="mb-4">

          <label
            style={{
              fontWeight: 600,
              marginBottom: '0.6rem',
              display: 'block'
            }}
          >
            Missão
          </label>

          <textarea
            className="form-control"
            rows={3}
            style={{
              background: '#f9fafb'
            }}
          />

        </div>

        <div className="mb-4">

          <label
            style={{
              fontWeight: 600,
              marginBottom: '0.6rem',
              display: 'block'
            }}
          >
            Visão
          </label>

          <textarea
            className="form-control"
            rows={3}
            style={{
              background: '#f9fafb'
            }}
          />

        </div>

        <div>

          <label
            style={{
              fontWeight: 600,
              marginBottom: '1rem',
              display: 'block'
            }}
          >
            Valores
          </label>

          {valores.map((item, index) => (

            <div
              key={index}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: '10px',
                padding: '1rem',
                marginBottom: '1rem'
              }}
            >

              <input
                type="text"
                value={item.titulo}
                className="form-control mb-3"
                style={{
                  background: '#f9fafb'
                }}
              />

              <textarea
                rows={3}
                value={item.descricao}
                className="form-control"
                style={{
                  background: '#f9fafb'
                }}
              />

            </div>

          ))}

          <button
            onClick={adicionarValor}
            className="btn btn-light border"
            style={{
              marginBottom: '1.5rem'
            }}
          >
            <i className="bi bi-plus-lg me-2"></i>
            Adicionar Valor
          </button>

        </div>

        <button
          className="btn"
          style={{
            background: '#050b23',
            color: '#fff',
            borderRadius: '10px',
            padding: '0.7rem 1.3rem',
            fontWeight: 600
          }}
        >
          Guardar Alterações
        </button>

      </div>

    </div>
  );
}