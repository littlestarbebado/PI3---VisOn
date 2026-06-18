import React, { useState } from 'react';

export default function Utilizadores() {

  const [utilizadores, setUtilizadores] = useState([
    {
      id: 1,
      nome: 'Administrador',
      email: 'admin@cybersec.com',
      tipo: 'Admin'
    },
    {
      id: 2,
      nome: 'Gestor Silva',
      email: 'gestor@cybersec.com',
      telefone: '+351 912 345 678',
      tipo: 'Gestor'
    },
    {
      id: 3,
      nome: 'João Cliente',
      email: 'cliente@empresa.com',
      telefone: '+351 913 456 789',
      empresa: 'TechCorp Solutions',
      tipo: 'Cliente'
    }
  ]);

  const [mostrarModalGestor, setMostrarModalGestor] = useState(false);
  const [mostrarModalCliente, setMostrarModalCliente] = useState(false);

  const [novoGestor, setNovoGestor] = useState({
    nome: '',
    email: '',
    telefone: ''
  });

  const [novoCliente, setNovoCliente] = useState({
    empresa: '',
    nome: '',
    email: '',
    telefone: ''
  });

  const criarGestor = () => {

    if (!novoGestor.nome || !novoGestor.email) {
      alert('Preencha Nome e Email');
      return;
    }

    setUtilizadores([
      ...utilizadores,
      {
        id: Date.now(),
        nome: novoGestor.nome,
        email: novoGestor.email,
        telefone: novoGestor.telefone,
        tipo: 'Gestor'
      }
    ]);

    setNovoGestor({
      nome: '',
      email: '',
      telefone: ''
    });

    setMostrarModalGestor(false);
  };

  const criarCliente = () => {

    if (!novoCliente.nome || !novoCliente.email) {
      alert('Preencha Nome e Email');
      return;
    }

    setUtilizadores([
      ...utilizadores,
      {
        id: Date.now(),
        nome: novoCliente.nome,
        email: novoCliente.email,
        telefone: novoCliente.telefone,
        empresa: novoCliente.empresa,
        tipo: 'Cliente'
      }
    ]);

    setNovoCliente({
      empresa: '',
      nome: '',
      email: '',
      telefone: ''
    });

    setMostrarModalCliente(false);
  };

  const apagarUtilizador = (id) => {
    setUtilizadores(
      utilizadores.filter((u) => u.id !== id)
    );
  };

  return (
    <>
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
            <h1
              style={{
                fontWeight: '800',
                color: '#111827',
                marginBottom: '5px'
              }}
            >
              Gestão de Utilizadores
            </h1>

            <p
              style={{
                color: '#64748b',
                margin: 0
              }}
            >
              Criar e gerir utilizadores do sistema
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '10px'
            }}
          >

            <button
              onClick={() => setMostrarModalGestor(true)}
              style={{
                background: '#050b23',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                padding: '10px 18px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              👥 Criar Gestor
            </button>

            <button
              onClick={() => setMostrarModalCliente(true)}
              style={{
                background: '#fff',
                border: '1px solid #d1d5db',
                borderRadius: '10px',
                padding: '10px 18px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              👥 Criar Cliente
            </button>

          </div>

        </div>

        <div
          style={{
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '16px',
            padding: '20px'
          }}
        >

          <h4
            style={{
              marginBottom: '20px',
              fontWeight: '700',
              color: '#111827'
            }}
          >
            Utilizadores Registados
          </h4>

          {utilizadores.map((u) => (

            <div
              key={u.id}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: '14px',
                padding: '18px',
                marginBottom: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >

              <div
                style={{
                  display: 'flex',
                  gap: '15px'
                }}
              >

                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: '#e5edff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  🛡️
                </div>

                <div>

                  <div
                    style={{
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'center'
                    }}
                  >

                    <strong
                      style={{
                        color: '#111827',
                        fontSize: '22px'
                      }}
                    >
                      {u.nome}
                    </strong>

                    <span
                      style={{
                        background:
                          u.tipo === 'Admin'
                            ? '#ef4444'
                            : u.tipo === 'Gestor'
                            ? '#050b23'
                            : '#e5e7eb',

                        color:
                          u.tipo === 'Cliente'
                            ? '#111827'
                            : '#fff',

                        padding: '3px 8px',
                        borderRadius: '999px',
                        fontSize: '12px'
                      }}
                    >
                      {u.tipo}
                    </span>

                  </div>

                  <div style={{ color: '#64748b' }}>
                    {u.email}
                  </div>

                  {u.telefone && (
                    <div style={{ color: '#64748b' }}>
                      {u.telefone}
                    </div>
                  )}

                  {u.empresa && (
                    <div style={{ color: '#2563eb' }}>
                      {u.empresa}
                    </div>
                  )}

                </div>

              </div>

              {u.tipo !== 'Admin' && (

                <div
                  style={{
                    display: 'flex',
                    gap: '18px'
                  }}
                >

                  <button
                    style={{
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer'
                    }}
                  >
                    🔒
                  </button>

                  <button
                    onClick={() => apagarUtilizador(u.id)}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer'
                    }}
                  >
                    🗑️
                  </button>

                </div>

              )}

            </div>

          ))}

        </div>

      </div>

      {mostrarModalGestor && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <div
            style={{
              background: '#fff',
              width: '500px',
              borderRadius: '12px',
              padding: '24px'
            }}
          >
            <h3 style={{ color: '#111827' }}>
              Criar Novo Gestor
            </h3>

            <input
              className="form-control mb-3"
              placeholder="Nome"
              value={novoGestor.nome}
              onChange={(e) =>
                setNovoGestor({
                  ...novoGestor,
                  nome: e.target.value
                })
              }
            />

            <input
              className="form-control mb-3"
              placeholder="Email"
              value={novoGestor.email}
              onChange={(e) =>
                setNovoGestor({
                  ...novoGestor,
                  email: e.target.value
                })
              }
            />

            <input
              className="form-control mb-3"
              placeholder="Telefone"
              value={novoGestor.telefone}
              onChange={(e) =>
                setNovoGestor({
                  ...novoGestor,
                  telefone: e.target.value
                })
              }
            />

            <button
              onClick={criarGestor}
              className="btn btn-dark w-100"
            >
              Criar Gestor
            </button>
          </div>
        </div>
      )}

      {mostrarModalCliente && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <div
            style={{
              background: '#fff',
              width: '700px',
              borderRadius: '12px',
              padding: '24px'
            }}
          >
            <h3 style={{ color: '#111827' }}>
              Criar Novo Cliente
            </h3>

            <input
              className="form-control mb-3"
              placeholder="Nome da Empresa"
              value={novoCliente.empresa}
              onChange={(e) =>
                setNovoCliente({
                  ...novoCliente,
                  empresa: e.target.value
                })
              }
            />

            <input
              className="form-control mb-3"
              placeholder="Nome"
              value={novoCliente.nome}
              onChange={(e) =>
                setNovoCliente({
                  ...novoCliente,
                  nome: e.target.value
                })
              }
            />

            <input
              className="form-control mb-3"
              placeholder="Email"
              value={novoCliente.email}
              onChange={(e) =>
                setNovoCliente({
                  ...novoCliente,
                  email: e.target.value
                })
              }
            />

            <input
              className="form-control mb-3"
              placeholder="Telefone"
              value={novoCliente.telefone}
              onChange={(e) =>
                setNovoCliente({
                  ...novoCliente,
                  telefone: e.target.value
                })
              }
            />

            <button
              onClick={criarCliente}
              className="btn btn-dark w-100"
            >
              Criar Cliente
            </button>
          </div>
        </div>
      )}
    </>
  );
}