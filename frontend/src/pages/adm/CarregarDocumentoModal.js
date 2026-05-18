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
          width: '420px',
          background: '#fff',
          borderRadius: '14px',
          padding: '1.5rem',
          position: 'relative'
        }}
      >

        {/* FECHAR */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            right: '1rem',
            top: '1rem',
            border: 'none',
            background: 'transparent',
            fontSize: '1.2rem',
            color: '#6b7280'
          }}
        >
          ×
        </button>

        {/* TÍTULO */}
        <h4
          style={{
            fontWeight: 700,
            marginBottom: '1.5rem'
          }}
        >
          Carregar Novo Documento
        </h4>

        {/* FORM */}
        <div className="d-flex flex-column gap-3">

          {/* FICHEIRO */}
          <div>

            <label
              style={{
                fontWeight: 600,
                marginBottom: '0.5rem',
                display: 'block'
              }}
            >
              Ficheiro *
            </label>

            <input
              type="file"
              className="form-control"
            />

          </div>

          {/* NOME */}
          <div>

            <label
              style={{
                fontWeight: 600,
                marginBottom: '0.5rem',
                display: 'block'
              }}
            >
              Nome do Documento
            </label>

            <input
              type="text"
              className="form-control"
              placeholder="Ex: Relatório Q1"
            />

          </div>

          {/* CATEGORIA */}
          <div>

            <label
              style={{
                fontWeight: 600,
                marginBottom: '0.5rem',
                display: 'block'
              }}
            >
              Categoria *
            </label>

            <select
              className="form-select"
            >
              <option>
                Selecionar categoria
              </option>

              <option>
                Relatório
              </option>

              <option>
                Política
              </option>

              <option>
                Pentest
              </option>

            </select>

          </div>

          {/* CLIENTE */}
          <div>

            <label
              style={{
                fontWeight: 600,
                marginBottom: '0.5rem',
                display: 'block'
              }}
            >
              Cliente *
            </label>

            <select
              className="form-select"
            >
              <option>
                Selecionar cliente
              </option>

              <option>
                TechCorp Solutions
              </option>

              <option>
                Digital Innovations
              </option>

            </select>

          </div>

          {/* BOTÃO */}
          <button
            className="btn"
            style={{
              background: '#050b23',
              color: '#fff',
              marginTop: '1rem',
              padding: '0.8rem',
              borderRadius: '10px',
              fontWeight: 600
            }}
          >
            Carregar
          </button>

        </div>

      </div>

    </div>
  );
}