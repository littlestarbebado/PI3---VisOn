import React from 'react';

export default function CarregarDocumentoModal({
  show,
  onClose
}) {

  if (!show) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999
      }}
    >
      <div
        style={{
          width: '520px',
          background: '#fff',
          borderRadius: '14px',
          padding: '20px',
          position: 'relative',
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            right: '16px',
            top: '12px',
            border: 'none',
            background: 'transparent',
            fontSize: '22px',
            color: '#6b7280',
            cursor: 'pointer'
          }}
        >
          ×
        </button>

        <h3
          style={{
            fontWeight: '700',
            color: '#111827',
            marginBottom: '16px'
          }}
        >
          Carregar Novo Documento
        </h3>

        <div>

          <label
            style={{
              display: 'block',
              marginBottom: '6px',
              color: '#111827',
              fontWeight: '600'
            }}
          >
            Ficheiro *
          </label>

          <input
            type="file"
            className="form-control"
            style={{ marginBottom: '14px' }}
          />

          <label
            style={{
              display: 'block',
              marginBottom: '6px',
              color: '#111827',
              fontWeight: '600'
            }}
          >
            Nome do Documento
          </label>

          <input
            type="text"
            className="form-control"
            placeholder="Ex: Relatório Q1 2024"
            style={{ marginBottom: '14px' }}
          />

          <label
            style={{
              display: 'block',
              marginBottom: '6px',
              color: '#111827',
              fontWeight: '600'
            }}
          >
            Categoria *
          </label>

          <select
            className="form-select"
            style={{ marginBottom: '14px' }}
          >
            <option>Selecione a categoria</option>
            <option>Relatório</option>
            <option>Documentação</option>
            <option>PenTest</option>
          </select>

          <label
            style={{
              display: 'block',
              marginBottom: '6px',
              color: '#111827',
              fontWeight: '600'
            }}
          >
            Cliente *
          </label>

          <select
            className="form-select"
            style={{ marginBottom: '20px' }}
          >
            <option>Selecione o cliente</option>
            <option>TechCorp Solutions</option>
            <option>Digital Innovations</option>
          </select>

          <button
            style={{
              width: '100%',
              background: '#050b23',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '12px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Carregar
          </button>

        </div>

      </div>

    </div>
  );
}