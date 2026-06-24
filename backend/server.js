const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const jwt = require('jsonwebtoken');
const { Server } = require('socket.io');
require('dotenv').config();

const { sequelize, ensureDefaultAdmin, ensureDemoUsers, Pedido, Admin, Cliente } = require('./src/models');

const app = express();
const server = http.createServer(app);
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3001';
const corsOptions = {
  origin: FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
const io = new Server(server, {
  cors: corsOptions
});

app.set('io', io);

const JWT_SECRET = process.env.JWT_SECRET
  || (process.env.NODE_ENV === 'production' ? null : 'vison_secret_2024');
if (!JWT_SECRET) throw new Error('JWT_SECRET e obrigatorio em producao.');

function normalizarToken(token) {
  if (!token || typeof token !== 'string') return null;
  return token.replace(/^Bearer\s+/i, '').trim();
}

function extrairTokenSocket(socket, payload = {}) {
  return normalizarToken(
    payload.token
    || socket.handshake.auth?.token
    || socket.handshake.headers?.authorization
  );
}

function normalizarPedidoPayload(payload) {
  if (payload && typeof payload === 'object') return payload;
  return { pedidoId: payload };
}

async function autenticarSocket(socket, payload = {}) {
  const token = extrairTokenSocket(socket, payload);
  if (!token) return null;

  const decoded = jwt.verify(token, JWT_SECRET);

  if (decoded.role === 'Admin' || decoded.role === 'Gestor') {
    const utilizador = await Admin.findByPk(decoded.id, { attributes: ['id', 'ativo'] });
    if (!utilizador || utilizador.ativo === false) return null;
  }

  if (decoded.role === 'Cliente') {
    const cliente = await Cliente.findByPk(decoded.id, { attributes: ['id', 'status'] });
    if (!cliente || cliente.status === false) return null;
  }

  return decoded;
}

async function podeEntrarNoPedido(user, pedidoId) {
  const pedido = await Pedido.findByPk(pedidoId, { attributes: ['id', 'ClienteId'] });
  if (!pedido) return { autorizado: false, codigo: 'PEDIDO_INDISPONIVEL' };

  if (user.role === 'Cliente') {
    return {
      autorizado: Number(pedido.ClienteId) === Number(user.id),
      codigo: 'ACESSO_NEGADO'
    };
  }

  if (user.role === 'Admin' || user.role === 'Gestor') {
    return { autorizado: true };
  }

  return { autorizado: false, codigo: 'ACESSO_NEGADO' };
}

io.on('connection', (socket) => {
  socket.on('join_pedido', async (payload, ack) => {
    try {
      const dados = normalizarPedidoPayload(payload);
      const pedidoId = Number(dados.pedidoId);

      if (!Number.isInteger(pedidoId) || pedidoId <= 0) {
        socket.emit('pedido_socket_erro', { codigo: 'PEDIDO_INVALIDO', mensagem: 'Nao foi possivel abrir esta conversa.' });
        if (typeof ack === 'function') ack({ ok: false });
        return;
      }

      const user = await autenticarSocket(socket, dados);
      if (!user) {
        socket.emit('pedido_socket_erro', { codigo: 'NAO_AUTENTICADO', mensagem: 'Sessao invalida para abrir esta conversa.' });
        if (typeof ack === 'function') ack({ ok: false });
        return;
      }

      const permissao = await podeEntrarNoPedido(user, pedidoId);
      if (!permissao.autorizado) {
        socket.emit('pedido_socket_erro', { codigo: permissao.codigo, mensagem: 'Nao foi possivel abrir esta conversa.' });
        if (typeof ack === 'function') ack({ ok: false });
        return;
      }

      socket.join(`pedido_${pedidoId}`);
      if (typeof ack === 'function') ack({ ok: true });
    } catch (error) {
      socket.emit('pedido_socket_erro', { codigo: 'ERRO_CONVERSA', mensagem: 'Nao foi possivel abrir esta conversa.' });
      if (typeof ack === 'function') ack({ ok: false });
    }
  });

  socket.on('leave_pedido', (payload) => {
    const dados = normalizarPedidoPayload(payload);
    const pedidoId = Number(dados.pedidoId);
    if (!Number.isInteger(pedidoId) || pedidoId <= 0) return;
    socket.leave(`pedido_${pedidoId}`);
  });
});

// Middlewares essenciais para ler dados de formulários (JSON)
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir a pasta de uploads para os PDFs
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Registo de Rotas do Sistema
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/clientes', require('./src/routes/clientes')); // <--- Tem de estar aqui!
app.use('/api/ativos', require('./src/routes/ativos'));
app.use('/api/conteudos', require('./src/routes/conteudos'));
app.use('/api/artigos', require('./src/routes/artigos'));
app.use('/api/contacto', require('./src/routes/contacto'));
app.use('/api/pedidos', require('./src/routes/pedidos'));
app.use('/api/notificacoes', require('./src/routes/notificacoes'));
app.use('/api/incidentes', require('./src/routes/incidentes'));
app.use('/api/logs', require('./src/routes/logs'));
app.use('/api/documentos', require('./src/routes/documentos'));
app.use('/api/nis2', require('./src/routes/nis2'));

// Sincronização da Base de Dados PostgreSQL
const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true }).then(async () => {
  await ensureDefaultAdmin();
  await ensureDemoUsers();
  console.log('Base de dados sincronizada com o PostgreSQL');
  server.listen(PORT, () => {
    console.log(`Servidor a correr com sucesso na porta ${PORT}`);
  });
}).catch(err => {
  console.error('Erro ao sincronizar base de dados:', err);
});
