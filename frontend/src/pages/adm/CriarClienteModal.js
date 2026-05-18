import React from 'react';

export default function CriarClienteModal({
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
          maxHeight: '90vh',
          overflowY: 'auto',
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
          Criar Novo Cliente
        </h4>

        {/* EMPRESA */}
        <h5
          style={{
            fontWeight: 700,
            marginBottom: '1rem'
          }}
        >
          Informações da Empresa
        </h5>

        <div className="mb-4">

          <label
            style={{
              fontWeight: 600,
              marginBottom: '0.5rem',
              display: 'block'
            }}
          >
            Nome da Empresa *
          </label>

          <input
            type="text"
            className="form-control"
          />

        </div>

        {/* CLIENTE */}
        <h5
          style={{
            fontWeight: 700,
            marginBottom: '1rem'
          }}
        >
          Cliente (Acesso ao Portal)
        </h5>

        <div className="row g-3 mb-4">

          <div className="col-md-6">

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

          <div className="col-md-6">

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

          <div className="col-md-6">

            <label
              style={{
                fontWeight: 600,
                marginBottom: '0.5rem',
                display: 'block'
              }}
            >
              Telefone *
            </label>

            <input
              type="text"
              className="form-control"
            />

          </div>

        </div>

        {/* RESPONSÁVEL */}
        <h5
          style={{
            fontWeight: 700,
            marginBottom: '1rem'
          }}
        >
          Responsável de Segurança
        </h5>

        <div className="row g-3 mb-4">

          <div className="col-md-6">

            <label
              style={{
                fontWeight: 600,
                marginBottom: '0.5rem',
                display: 'block'
              }}
            >
              Nome
            </label>

            <input
              type="text"
              className="form-control"
            />

          </div>

          <div className="col-md-6">

            <label
              style={{
                fontWeight: 600,
                marginBottom: '0.5rem',
                display: 'block'
              }}
            >
              Email
            </label>

            <input
              type="email"
              className="form-control"
            />

          </div>

          <div className="col-md-6">

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

        </div>

        {/* CONTACTO */}
        <h5
          style={{
            fontWeight: 700,
            marginBottom: '1rem'
          }}
        >
          Contacto Permanente
        </h5>

        <div className="row g-3 mb-4">

          <div className="col-md-6">

            <label
              style={{
                fontWeight: 600,
                marginBottom: '0.5rem',
                display: 'block'
              }}
            >
              Nome
            </label>

            <input
              type="text"
              className="form-control"
            />

          </div>

          <div className="col-md-6">

            <label
              style={{
                fontWeight: 600,
                marginBottom: '0.5rem',
                display: 'block'
              }}
            >
              Email
            </label>

            <input
              type="email"
              className="form-control"
            />

          </div>

          <div className="col-md-6">

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

        </div>

        {/* BOTÃO */}
        <button
          className="btn w-100"
          style={{
            background: '#050b23',
            color: '#fff',
            padding: '0.8rem',
            borderRadius: '10px',
            fontWeight: 600
          }}
        >
          Criar Cliente
        </button>

      </div>

    </div>
  );
}