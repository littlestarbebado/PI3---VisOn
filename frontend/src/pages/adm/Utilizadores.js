import React, { useState } from 'react';

import CriarGestorModal from './CriarGestorModal';
import CriarClienteModal from './CriarClienteModal';

export default function Utilizadores() {

  const [showGestorModal, setShowGestorModal] = useState(false);
  const [showClienteModal, setShowClienteModal] = useState(false);

  const utilizadores = [
    {
      nome: 'Administrador',
      role: 'Admin',
      email: 'admin@cybersec.com',
      telefone: '',
      empresa: ''
    },
    {
      nome: 'Gestor Silva',
      role: 'Gestor',
      email: 'gestor@cybersec.com',
      telefone: '+351 912 345 678',
      empresa: ''
    },
    {
      nome: 'João Cliente',
      role: 'Cliente',
      email: 'cliente@empresa.com',
      telefone: '+351 913 456 789',
      empresa: 'TechCorp Solutions'
    }
  ];

  return (
    <div>

      {/* MODAIS */}
      <CriarGestorModal
        show={showGestorModal}
        onClose={() => setShowGestorModal(false)}
      />

      <CriarClienteModal
        show={showClienteModal}
        onClose={() => setShowClienteModal(false)}
      />

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>

          <h2
            style={{
              fontWeight: 800,
              marginBottom: '0.3rem'
            }}
          >
            Gestão de Utilizadores
          </h2>

          <p
            style={{
              color: '#6b7280',
              margin: 0
            }}
          >
            Criar e gerir utilizadores do sistema
          </p>

        </div>

        {/* BOTÕES */}
        <div className="d-flex gap-2">

          <button
            onClick={() => setShowGestorModal(true)}
            className="btn"
            style={{
              background: '#050b23',
              color: '#fff',
              borderRadius: '10px',
              padding: '0.6rem 1rem',
              fontWeight: 600
            }}
          >
            <i className="bi bi-person-plus me-2"></i>
            Criar Gestor
          </button>

          <button
            onClick={() => setShowClienteModal(true)}
            className="btn btn-light border"
            style={{
              borderRadius: '10px',
              padding: '0.6rem 1rem',
              fontWeight: 600
            }}
          >
            <i className="bi bi-person-plus me-2"></i>
            Criar Cliente
          </button>

        </div>

      </div>

      {/* CARD */}
      <div
        style={{
          background: '#fff',
          borderRadius: '14px',
          border: '1px solid #e5e7eb',
          padding: '1.5rem',
          maxWidth: '950px'
        }}
      >

        <h5
          style={{
            fontWeight: 700,
            marginBottom: '1.5rem'
          }}
        >
          Utilizadores Registados
        </h5>

        {/* LISTA */}
        {utilizadores.map((user, index) => (

          <div
            key={index}
            style={{
              border: '1px solid #f1f5f9',
              borderRadius: '12px',
              padding: '1rem',
              marginBottom: '1rem',
              background: '#fff'
            }}
          >

            <div className="d-flex justify-content-between align-items-center">

              {/* ESQUERDA */}
              <div className="d-flex align-items-center gap-3">

                {/* ÍCONE */}
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: '#eef4ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#2563eb'
                  }}
                >
                  <i className="bi bi-shield"></i>
                </div>

                {/* INFO */}
                <div>

                  <div className="d-flex align-items-center gap-2">

                    <h6
                      style={{
                        margin: 0,
                        fontWeight: 700
                      }}
                    >
                      {user.nome}
                    </h6>

                    <span
                      style={{
                        background:
                          user.role === 'Admin'
                            ? '#ec4899'
                            : user.role === 'Gestor'
                            ? '#111827'
                            : '#e5e7eb',

                        color:
                          user.role === 'Cliente'
                            ? '#111827'
                            : '#fff',

                        fontSize: '0.72rem',
                        padding: '0.15rem 0.55rem',
                        borderRadius: '999px',
                        fontWeight: 600
                      }}
                    >
                      {user.role}
                    </span>

                  </div>

                  <small
                    style={{
                      display: 'block',
                      color: '#6b7280'
                    }}
                  >
                    {user.email}
                  </small>

                  {user.telefone && (
                    <small
                      style={{
                        display: 'block',
                        color: '#6b7280'
                      }}
                    >
                      {user.telefone}
                    </small>
                  )}

                  {user.empresa && (
                    <small
                      style={{
                        display: 'block',
                        color: '#2563eb'
                      }}
                    >
                      {user.empresa}
                    </small>
                  )}

                </div>

              </div>

              {/* AÇÕES */}
              {user.role !== 'Admin' && (

                <div className="d-flex gap-3">

                  <button
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: '#f97316',
                      cursor: 'pointer'
                    }}
                  >
                    <i className="bi bi-unlock"></i>
                  </button>

                  <button
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: '#ef4444',
                      cursor: 'pointer'
                    }}
                  >
                    <i className="bi bi-trash"></i>
                  </button>

                </div>

              )}

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}