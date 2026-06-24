import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import socket from '../services/socket';
import { useAuth } from '../context/AuthContext';
import './NotificationBell.css';

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('pt-PT', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

function getTargetPath(role, item) {
  if (role === 'Admin') return '/admin/suporte';
  if (role === 'Gestor' && item.clienteId) return `/gestor/cliente/${item.clienteId}`;
  if (role === 'Gestor') return '/gestor';
  return '/cliente/chat';
}

export default function NotificationBell() {
  const { role, user } = useAuth();
  const navigate = useNavigate();
  const bellRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [items, setItems] = useState([]);
  const currentRole = role || user?.role;

  const loadNotifications = useCallback(async () => {
    if (!currentRole) return;
    setLoading(true);
    try {
      const { data } = await api.get('/notificacoes');
      setItems(data.items || []);
      setTotal(data.total || 0);
    } catch {
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [currentRole]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  useEffect(() => {
    const handleUpdate = () => loadNotifications();
    socket.on('notificacoes_atualizadas', handleUpdate);
    socket.on('receber_mensagem', handleUpdate);
    return () => {
      socket.off('notificacoes_atualizadas', handleUpdate);
      socket.off('receber_mensagem', handleUpdate);
    };
  }, [loadNotifications]);

  useEffect(() => {
    const closeOnOutsideClick = event => {
      if (bellRef.current && !bellRef.current.contains(event.target)) setOpen(false);
    };
    const closeOnEscape = event => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  const markAllRead = async () => {
    await api.post('/notificacoes/marcar-lidas');
    setItems([]);
    setTotal(0);
  };

  const openNotification = (item) => {
    setOpen(false);
    navigate(getTargetPath(currentRole, item), { state: { pedidoId: item.pedidoId } });
  };

  return (
    <div className="notification-bell" ref={bellRef}>
      <button
        type="button"
        className="notification-bell__trigger"
        onClick={() => {
          setOpen(value => !value);
          if (!open) loadNotifications();
        }}
        aria-label="Abrir notificacoes"
        aria-expanded={open}
      >
        <i className="bi bi-bell" aria-hidden="true" />
        {total > 0 && <span className="notification-bell__badge">{total > 99 ? '99+' : total}</span>}
      </button>

      <div className={`notification-bell__panel ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <div className="notification-bell__header">
          <div>
            <strong>Notificacoes</strong>
            <span>{total} por ler</span>
          </div>
          <button type="button" onClick={markAllRead} disabled={total === 0}>
            Marcar lidas
          </button>
        </div>

        <div className="notification-bell__list">
          {loading ? (
            <div className="notification-bell__empty">A carregar...</div>
          ) : items.length === 0 ? (
            <div className="notification-bell__empty">Sem notificacoes por ler.</div>
          ) : items.map((item, index) => (
            <button
              key={`${item.tipo}-${item.pedidoId}-${item.criadoEm}-${index}`}
              type="button"
              className="notification-bell__item"
              onClick={() => openNotification(item)}
            >
              <span className="notification-bell__item-title">{item.titulo}</span>
              <span className="notification-bell__item-message">{item.remetente}: {item.mensagem}</span>
              <span className="notification-bell__item-date">{formatDate(item.criadoEm)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
