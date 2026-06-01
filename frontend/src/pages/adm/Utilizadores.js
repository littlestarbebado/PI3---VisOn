import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import CriarGestorModal from './CriarGestorModal';
import CriarClienteModal from './CriarClienteModal';

export default function Utilizadores() {

  const [showGestorModal, setShowGestorModal] = useState(false);
  const [showClienteModal, setShowClienteModal] = useState(false);

  // Estado para os utilizadores vindos da API (não hardcoded)
  const [utilizadores, setUtilizadores] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  // Função reutilizável para ir buscar os utilizadores à API
  function carregarUtilizadores() {
    setCarregando(true);
    api.get('/auth/utilizadores')
      .then(res => {
        setUtilizadores(res.data);
        setErro(null);
      })
      .catch(err => {
        console.error('Erro ao carregar utilizadores:', err);
        setErro('Não foi possível carregar os utilizadores.');
      })
      .finally(() => setCarregando(false));
  }

  // Carregar ao montar o componente
  useEffect(() => {
    carregarUtilizadores();
  }, []);

  // Eliminar utilizador
  function eliminarUtilizador(id) {
    if (!window.confirm('Tens a certeza que queres eliminar este utilizador?')) return;

    api.delete(`/auth/utilizadores/${id}`)
      .then(() => {
        // Após eliminar, atualizar a lista (sem reload)
        carregarUtilizadores();
      })
      .catch(err => {
        console.error('Erro ao eliminar utilizador:', err);
        alert('Erro ao eliminar utilizador.');
      });
  }

  return (
    <div>

      {/* MODAIS — ao fechar, recarregar a lista */}
      <CriarGestorModal
        show={showGestorModal}
        onClose={() => {
          setShowGestorModal(false);
          carregarUtilizadores();
        }}
      />

      <CriarClienteModal
        show={showClienteModal}
        onClose={() => {
          setShowClienteModal(false);
          carregarUtilizadores();
        }}
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

        {/* ESTADOS DE CARREGAMENTO / ERRO */}
        {carregando && (
          <p style={{ color: '#6b7280' }}>A carregar utilizadores...</p>
        )}

        {erro && (
          <p style={{ color: '#ef4444' }}>{erro}</p>
        )}

        {/* LISTA — key usa o id real da base de dados */}
{!carregando && !erro && utilizadores.map((user) => {
  // Configuração dinâmica de cores por perfil (Role)
  let badgeBg = '#e5e7eb';
  let badgeColor = '#111827';
  
  if (user.role === 'Admin') {
    badgeBg = '#fef2f2';
    badgeColor = '#dc2626'; // Vermelho suave admin
  } else if (user.role === 'Gestor') {
    badgeBg = '#eff6ff';
    badgeColor = '#2563eb'; // Azul suave gestor
  } else if (user.role === 'Cliente') {
    badgeBg = '#f0fdf4';
    badgeColor = '#16a34a'; // Verde suave cliente
  }

  return (
    <div
      key={user.id}
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
              <h6 style={{ margin: 0, fontWeight: 700 }}>
                {user.nome}
              </h6>

              <span
                style={{
                  background: badgeBg,
                  color: badgeColor,
                  fontSize: '0.72rem',
                  padding: '0.15rem 0.55rem',
                  borderRadius: '999px',
                  fontWeight: 600,
                  border: `1px solid ${badgeColor}40` // Adiciona uma borda suave transparente
                }}
              >
                {user.role || 'Cliente'}
              </span>
            </div>

            <small style={{ display: 'block', color: '#6b7280', marginTop: '0.2rem' }}>
              {user.email}
            </small>

            {user.telefone && (
              <small style={{ display: 'block', color: '#6b7280' }}>
                <i className="bi bi-telephone me-1" style={{ fontSize: '0.75rem' }}></i> {user.telefone}
              </small>
            )}
          </div>
        </div>

        {/* AÇÕES — só visíveis para não-admins */}
        {user.role !== 'Admin' && (
          <div className="d-flex gap-3">
            <button
              onClick={() => eliminarUtilizador(user.id)}
              style={{
                border: 'none',
                background: 'transparent',
                color: '#ef4444',
                cursor: 'pointer',
                fontSize: '1.1rem'
              }}
              title="Revogar Acesso"
            >
              <i className="bi bi-trash"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
})}

        {/* Sem utilizadores */}
        {!carregando && !erro && utilizadores.length === 0 && (
          <p style={{ color: '#6b7280' }}>Nenhum utilizador encontrado.</p>
        )}

      </div>

    </div>
  );
}