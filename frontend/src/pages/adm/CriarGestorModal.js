import React from 'react';

export default function CriarGestorModal({
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

        <h4
          style={{
            fontWeight: 700,
            marginBottom: '1.5rem'
          }}
        >
          Criar Novo Gestor
        </h4>

        {/* FORM */}
        <div className="d-flex flex-column gap-3">

          <div>

            <label
              style={{
                fontWeight: 600,
                marginBottom: '0.5rem',
                display: 'block'
              }}
            >
              Nome *
            </label>

            <input
              type="text"
              className="form-control"
            />

          </div>

          <div>

            <label
              style={{
                fontWeight: 600,
                marginBottom: '0.5rem',
                display: 'block'
              }}
            >
              Email *
            </label>

            <input
              type="email"
              className="form-control"
            />

          </div>

          <div>

            <label
              style={{
                fontWeight: 600,
                marginBottom: '0.5rem',
                display: 'block'
              }}
            >
              Telefone
            </label>

            <input
              type="text"
              className="form-control"
            />

          </div>

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
            Criar Gestor
          </button>

        </div>

      </div>

    </div>
  );
}