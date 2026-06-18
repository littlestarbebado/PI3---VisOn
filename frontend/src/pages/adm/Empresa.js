import React, { useState } from 'react';

export default function Empresa() {
  const [missao, setMissao] = useState('');
  const [visao, setVisao] = useState('');

  const [valores, setValores] = useState([
    'Confiança',
    'Excelência',
    'Inovação',
    'Responsabilidade'
  ]);

  const adicionarValor = () => {
    setValores([...valores, '']);
  };

  const alterarValor = (index, novoValor) => {
    const novosValores = [...valores];
    novosValores[index] = novoValor;
    setValores(novosValores);
  };

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '2rem',
        border: '1px solid #e5e7eb'
      }}
    >
      <h3
        style={{
          color: '#111827',
          fontWeight: '700',
          marginBottom: '2rem'
        }}
      >
        Informações da Empresa
      </h3>

      <div style={{ marginBottom: '2rem' }}>
        <label
          style={{
            display: 'block',
            color: '#111827',
            fontWeight: '600',
            marginBottom: '10px'
          }}
        >
          Missão
        </label>

        <textarea
          value={missao}
          onChange={(e) => setMissao(e.target.value)}
          rows={4}
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #d1d5db',
            borderRadius: '8px'
          }}
        />
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <label
          style={{
            display: 'block',
            color: '#111827',
            fontWeight: '600',
            marginBottom: '10px'
          }}
        >
          Visão
        </label>

        <textarea
          value={visao}
          onChange={(e) => setVisao(e.target.value)}
          rows={4}
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #d1d5db',
            borderRadius: '8px'
          }}
        />
      </div>

      <div>
        <label
          style={{
            display: 'block',
            color: '#111827',
            fontWeight: '600',
            marginBottom: '15px'
          }}
        >
          Valores
        </label>

        {valores.map((valor, index) => (
          <div
            key={index}
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: '10px',
              padding: '16px',
              marginBottom: '16px'
            }}
          >
            <input
              type="text"
              value={valor}
              onChange={(e) =>
                alterarValor(index, e.target.value)
              }
              placeholder="Nome do valor"
              style={{
                width: '100%',
                marginBottom: '10px',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '8px'
              }}
            />

            <textarea
              rows={2}
              placeholder="Descrição do valor"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '8px'
              }}
            />
          </div>
        ))}

        <button
          type="button"
          onClick={adicionarValor}
          className="btn btn-light"
          style={{
            marginBottom: '20px'
          }}
        >
          + Adicionar Valor
        </button>
      </div>

      <br />

      <button
        className="btn btn-dark"
      >
        Guardar Alterações
      </button>
    </div>
  );
}