import React, { useState } from 'react';
import api from '../../services/api';

export default function CriarClienteModal({ show, onClose }) {

  // Estado do formulário com useState
  const [nomeEmpresa, setNomeEmpresa] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(false);
  const [carregando, setCarregando] = useState(false);

  if (!show) return null;

  function fechar() {
    // Limpar estado ao fechar
    setNomeEmpresa('');
    setResponsavel('');
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
    if (!nomeEmpresa) {
      setErro('O nome da empresa é obrigatório.');
      return;
    }

    if (!email || !password) {
      setErro('Email e password inicial sao obrigatorios.');
      return;
    }

    setCarregando(true);

    // Pedido POST à API para criar o cliente
    api.post('/clientes', {
      nome: nomeEmpresa,
      email,
      telefone,
      password,
      respSegurancaNome: responsavel,
      respSegurancaEmail: email,
      respSegurancaTelefone: telefone,
      status: true
    })
      .then(() => {
        setSucesso(true);
        setTimeout(() => fechar(), 1500);
      })
      .catch(err => {
        const mensagem = err.response?.data?.erro || 'Erro ao criar cliente.';
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
          width: 'min(520px, calc(100vw - 24px))',
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
          Criar Novo Cliente
        </h4>

        {/* MENSAGENS */}
        {erro && (
          <div className="alert alert-danger py-2" style={{ fontSize: '0.9rem' }}>
            {erro}
          </div>
        )}

        {sucesso && (
          <div className="alert alert-success py-2" style={{ fontSize: '0.9rem' }}>
            Cliente criado com sucesso!
          </div>
        )}

        {/* EMPRESA */}
        <h5 style={{ fontWeight: 700, marginBottom: '1rem' }}>
          Informações da Empresa
        </h5>

        <div className="mb-4">
          <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>
            Nome da Empresa *
          </label>
          <input
            type="text"
            className="form-control"
            value={nomeEmpresa}
            onChange={(e) => setNomeEmpresa(e.target.value)}
          />
        </div>

        {/* RESPONSÁVEL */}
        <h5 style={{ fontWeight: 700, marginBottom: '1rem' }}>
          Responsável de Segurança
        </h5>

        <div className="row g-3 mb-4">

          <div className="col-md-6">
            <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>
              Nome
            </label>
            <input
              type="text"
              className="form-control"
              value={responsavel}
              onChange={(e) => setResponsavel(e.target.value)}
            />
          </div>

          <div className="col-md-6">
            <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>
              Email
            </label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="col-md-6">
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

          <div className="col-md-6">
            <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>
              Password Inicial *
            </label>
            <input
              type="text"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

        </div>

        {/* BOTÃO */}
        <button
          onClick={submeter}
          disabled={carregando}
          className="btn w-100"
          style={{
            background: '#050b23',
            color: '#fff',
            padding: '0.8rem',
            borderRadius: '10px',
            fontWeight: 600
          }}
        >
          {carregando ? 'A criar...' : 'Criar Cliente'}
        </button>

      </div>

    </div>
  );
}
