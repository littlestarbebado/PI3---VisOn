import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function Contactos() {

  const [mensagens, setMensagens] = useState([]);
  const [selecionada, setSelecionada] = useState(null);

  useEffect(() => {
    carregarMensagens();
  }, []);

  const carregarMensagens = async () => {
    try {
      const res = await api.get('/contacto');
      setMensagens(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const marcarLida = async (id) => {
    try {
      await api.put(`/contacto/${id}/lida`);
      carregarMensagens();
    } catch (err) {
      console.error(err);
    }
  };

  const apagarMensagem = async (id) => {
    if (!window.confirm('Apagar mensagem?')) return;

    try {
      await api.delete(`/contacto/${id}`);
      carregarMensagens();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>

      <div className="mb-4">

        <h2
          style={{
            fontWeight: 800,
            color: '#111827',
            marginBottom: '5px'
          }}
        >
          Mensagens de Contacto
        </h2>

        <p
          style={{
            color: '#64748b',
            margin: 0
          }}
        >
          Gestão das mensagens recebidas através do formulário de contacto
        </p>

      </div>

      <div
        style={{
          background: '#fff',
          borderRadius: '14px',
          border: '1px solid #e5e7eb',
          padding: '20px'
        }}
      >

        <h5
  style={{
    fontWeight: 700,
    marginBottom: '20px',
    color: '#111827'
  }}
>
  Mensagens Recebidas ({mensagens.length})
</h5>

        {mensagens.map((msg) => (

          <div
            key={msg.id}
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '12px',
              background: msg.lida ? '#fff' : '#f8fafc'
            }}
          >

            <div
              className="d-flex justify-content-between align-items-center"
            >

              <div>

                <div
                  className="d-flex align-items-center gap-2"
                >

                  <strong>{msg.nome}</strong>

                  {!msg.lida && (
                    <span
                      style={{
                        background: '#dbeafe',
                        color: '#2563eb',
                        padding: '2px 8px',
                        borderRadius: '999px',
                        fontSize: '11px'
                      }}
                    >
                      Nova
                    </span>
                  )}

                </div>

                <div
                  style={{
                    color: '#64748b',
                    fontSize: '14px'
                  }}
                >
                  {msg.email}
                </div>

                {msg.empresa && (
                  <div
                    style={{
                      color: '#2563eb',
                      fontSize: '14px'
                    }}
                  >
                    {msg.empresa}
                  </div>
                )}

              </div>

              <div
                className="d-flex gap-2"
              >

                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => setSelecionada(msg)}
                >
                  Ver
                </button>

                {!msg.lida && (
                  <button
                    className="btn btn-sm btn-outline-success"
                    onClick={() => marcarLida(msg.id)}
                  >
                    Lida
                  </button>
                )}

                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => apagarMensagem(msg.id)}
                >
                  Apagar
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

      {selecionada && (

        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '12px',
            zIndex: 999
          }}
        >

          <div
            style={{
              width: 'min(600px, calc(100vw - 24px))',
              maxHeight: 'calc(100dvh - 24px)',
              overflowY: 'auto',
              background: '#fff',
              borderRadius: '14px',
              padding: '24px'
            }}
          >

            <h4
              style={{
                fontWeight: 700,
                marginBottom: '20px'
              }}
            >
              Mensagem de Contacto
            </h4>

            <p><strong>Nome:</strong> {selecionada.nome}</p>

            <p><strong>Email:</strong> {selecionada.email}</p>

            {selecionada.telefone && (
              <p><strong>Telefone:</strong> {selecionada.telefone}</p>
            )}

            {selecionada.empresa && (
              <p><strong>Empresa:</strong> {selecionada.empresa}</p>
            )}

            <p>
              <strong>Mensagem:</strong>
            </p>

            <div
              style={{
                background: '#f8fafc',
                padding: '12px',
                borderRadius: '8px'
              }}
            >
              {selecionada.mensagem}
            </div>

            <button
              className="btn btn-dark mt-3"
              onClick={() => setSelecionada(null)}
            >
              Fechar
            </button>

          </div>

        </div>

      )}

    </div>
  );
}
