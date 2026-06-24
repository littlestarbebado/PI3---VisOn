import React, { useState } from 'react';
import api from '../../services/api';

export default function CriarGestorModal({ show, onClose }) {

  // Estado do formulário com useState
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(false);
  const [carregando, setCarregando] = useState(false);

  if (!show) return null;

  function fechar() {
    // Limpar o estado ao fechar
    setNome('');
    setEmail('');
    setTelefone('');
    setPassword('');
    setErro(null);
    setSucesso(false);
    onClose();
  }

  function submeter() {
    setErro(null);

    // Validação básica no frontend
    if (!nome || !email || !password) {
      setErro('Nome, email e password são obrigatórios.');
      return;
    }

    setCarregando(true);

    // Pedido POST à API para criar o gestor
    api.post('/auth/gestores', { nome, email, telefone, password })
      .then(() => {
        setSucesso(true);
        setTimeout(() => fechar(), 1500);
      })
      .catch(err => {
        const mensagem = err.response?.data?.erro || 'Erro ao criar gestor.';
        setErro(mensagem);
      })
      .finally(() => setCarregando(false));
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px',
        zIndex: 999
      }}
    >

      <div
        style={{
          width: 'min(420px, calc(100vw - 24px))',
          maxHeight: 'calc(100dvh - 24px)',
          overflowY: 'auto',
          background: '#fff',
          borderRadius: '14px',
          padding: '1.5rem',
          position: 'relative'
        }}
      >

        {/* FECHAR */}
        <button
          onClick={fechar}
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

        {/* MENSAGENS */}
        {erro && (
          <div className="alert alert-danger py-2" style={{ fontSize: '0.9rem' }}>
            {erro}
          </div>
        )}

        {sucesso && (
          <div className="alert alert-success py-2" style={{ fontSize: '0.9rem' }}>
            Gestor criado com sucesso!
          </div>
        )}

        {/* FORMULÁRIO */}
        <div className="d-flex flex-column gap-3">

          <div>
            <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>
              Nome *
            </label>
            <input
              type="text"
              className="form-control"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>
              Email *
            </label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>
              Telefone
            </label>
            <input
              type="text"
              className="form-control"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>
              Password *
            </label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            onClick={submeter}
            disabled={carregando}
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
            {carregando ? 'A criar...' : 'Criar Gestor'}
          </button>

        </div>

      </div>

    </div>
  );
}
