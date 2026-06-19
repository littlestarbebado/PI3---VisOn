import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './DadosConta.css';

function getInitials(name) {
  const words = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (!words.length) return 'VO';
  return `${words[0][0]}${words.length > 1 ? words[words.length - 1][0] : ''}`.toUpperCase();
}

function formatDate(value, includeTime = false) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat('pt-PT', includeTime
    ? { dateStyle: 'medium', timeStyle: 'short' }
    : { dateStyle: 'long' }).format(date);
}

function getTokenIssuedAt(token) {
  try {
    const payload = token?.split('.')[1];
    if (!payload) return null;
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const normalized = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
    const decoded = JSON.parse(window.atob(normalized));
    return decoded.iat ? new Date(decoded.iat * 1000) : null;
  } catch {
    return null;
  }
}

const EMPTY_STATS = [
  { label: 'A carregar', value: '—', icon: 'bi-hourglass-split', tone: 'blue' },
  { label: 'A carregar', value: '—', icon: 'bi-hourglass-split', tone: 'violet' },
  { label: 'A carregar', value: '—', icon: 'bi-hourglass-split', tone: 'green' }
];

export default function DadosConta() {
  const { user, role, token, isAuthenticated } = useAuth();
  const currentRole = role || user?.role || 'Cliente';
  const name = user?.nome || user?.name || 'Utilizador CyberBox';
  const [stats, setStats] = useState(EMPTY_STATS);
  const [statsLoading, setStatsLoading] = useState(true);

  const company = user?.empresa?.nome || user?.empresaNome || user?.cliente?.nome
    || user?.clienteNome || (currentRole === 'Cliente' ? name : null);
  const createdAt = formatDate(user?.createdAt || user?.dataCriacao);
  const lastLogin = formatDate(user?.ultimoLogin || user?.lastLogin || getTokenIssuedAt(token), true);

  const information = useMemo(() => [
    { label: 'Nome', value: name, icon: 'bi-person' },
    { label: 'Email', value: user?.email, icon: 'bi-envelope' },
    user?.telefone ? { label: 'Telefone', value: user.telefone, icon: 'bi-telephone' } : null,
    company ? { label: currentRole === 'Cliente' ? 'Empresa' : 'Cliente associado', value: company, icon: 'bi-building' } : null,
    createdAt ? { label: 'Conta criada em', value: createdAt, icon: 'bi-calendar3' } : null
  ].filter(Boolean), [company, createdAt, currentRole, name, user?.email, user?.telefone]);

  useEffect(() => {
    let active = true;

    async function loadStats() {
      try {
        if (currentRole === 'Admin') {
          const { data } = await api.get('/auth/stats');
          if (active) setStats([
            { label: 'Utilizadores', value: data.utilizadores ?? 0, icon: 'bi-people', tone: 'blue' },
            { label: 'Documentos', value: data.documentos ?? 0, icon: 'bi-file-earmark-text', tone: 'violet' },
            { label: 'Clientes', value: data.clientes ?? 0, icon: 'bi-buildings', tone: 'green' }
          ]);
        } else if (currentRole === 'Gestor') {
          const [clientsResponse, documentsResponse] = await Promise.all([
            api.get('/clientes'),
            api.get('/documentos')
          ]);
          const clients = clientsResponse.data || [];
          const assessments = await Promise.allSettled(
            clients.map(client => api.get('/nis2', { params: { clienteId: client.id } }))
          );
          const assessmentCount = assessments.filter(result =>
            result.status === 'fulfilled' && result.value.data?.avaliacao
          ).length;
          if (active) setStats([
            { label: 'Clientes', value: clients.length, icon: 'bi-buildings', tone: 'blue' },
            { label: 'Documentos', value: (documentsResponse.data || []).length, icon: 'bi-file-earmark-text', tone: 'violet' },
            { label: 'Avaliações NIS2', value: assessmentCount, icon: 'bi-clipboard2-check', tone: 'green' }
          ]);
        } else {
          const [documentsResponse, nis2Response] = await Promise.all([
            api.get('/documentos'),
            api.get('/nis2')
          ]);
          const assessment = nis2Response.data?.avaliacao;
          if (active) setStats([
              { label: 'Score de risco', value: `${user?.score ?? 0}/100`, icon: 'bi-shield-check', tone: 'blue' },
              { label: 'Estado NIS2', value: assessment?.estado || 'Não iniciado', icon: 'bi-clipboard2-check', tone: 'violet' },
              { label: 'Documentos', value: (documentsResponse.data || []).length, icon: 'bi-file-earmark-text', tone: 'green' }
            ]);
        }
      } catch {
        if (active) setStats(EMPTY_STATS.map(item => ({ ...item, label: 'Indisponível' })));
      } finally {
        if (active) setStatsLoading(false);
      }
    }

    loadStats();
    return () => { active = false; };
  }, [currentRole, user?.score]);

  return (
    <div className="account-page">
      <div className="account-page__container">
        <div className="account-page__eyebrow">CyberBox Secur · Definições da conta</div>
        <h1>Dados da Conta</h1>
        <p className="account-page__intro">Consulte a sua informação, atividade e estado de segurança num só lugar.</p>

        <section className="account-hero">
          <div className="account-hero__glow" aria-hidden="true" />
          <div className="account-hero__avatar" aria-hidden="true">{getInitials(name)}</div>
          <div className="account-hero__identity">
            <div className="account-hero__name-line">
              <h2>{name}</h2>
              <span className={`account-role account-role--${currentRole.toLowerCase()}`}>{currentRole}</span>
            </div>
            <p>{user?.email || 'Email não disponível'}</p>
            <span className="account-hero__type"><i className="bi bi-person-badge" /> Conta {currentRole}</span>
          </div>
        </section>

        <section className="account-section" aria-labelledby="quick-stats-title">
          <div className="account-section__heading">
            <div><span>Visão geral</span><h2 id="quick-stats-title">Estatísticas rápidas</h2></div>
            {statsLoading && <small>A atualizar…</small>}
          </div>
          <div className="account-stats">
            {stats.map(stat => (
              <article className="account-stat" key={stat.label}>
                <div className={`account-stat__icon account-stat__icon--${stat.tone}`}><i className={`bi ${stat.icon}`} /></div>
                <div><strong>{stat.value}</strong><span>{stat.label}</span></div>
              </article>
            ))}
          </div>
        </section>

        <div className="account-grid">
          <section className="account-card" aria-labelledby="information-title">
            <div className="account-card__heading">
              <div className="account-card__heading-icon"><i className="bi bi-person-lines-fill" /></div>
              <div><span>Perfil</span><h2 id="information-title">Informação</h2></div>
            </div>
            <dl className="account-information">
              {information.map(item => (
                <div className="account-information__row" key={item.label}>
                  <dt><i className={`bi ${item.icon}`} />{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="account-card account-security" aria-labelledby="security-title">
            <div className="account-card__heading">
              <div className="account-card__heading-icon account-card__heading-icon--secure"><i className="bi bi-shield-lock" /></div>
              <div><span>Proteção</span><h2 id="security-title">Segurança</h2></div>
            </div>
            <div className="account-security__status">
              <span className="account-security__pulse" aria-hidden="true" />
              <div><strong>Sessão protegida</strong><small>A sua sessão está autenticada e ativa.</small></div>
            </div>
            <div className="account-security__details">
              <div><span>Estado da sessão</span><strong>{isAuthenticated ? 'Ativa' : 'Inativa'}</strong></div>
              <div><span>JWT</span><strong>{token ? 'Ativo' : 'Inativo'}</strong></div>
              {lastLogin && <div><span>Início da sessão</span><strong>{lastLogin}</strong></div>}
            </div>
            <button type="button" className="account-password-button" disabled title="Funcionalidade ainda não disponível">
              <i className="bi bi-key" /> Alterar Password
              <span>Brevemente</span>
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
