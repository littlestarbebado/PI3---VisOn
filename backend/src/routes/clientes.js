const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { Cliente, AtivoTecnologico, Documento, Admin } = require('../models');
const auth = require('../middlewares/auth');
const { requireRole } = auth;
const { registrarLog } = require('../utils/logger');
const { getRole, clienteWhereForUser, responderSeClienteNaoAcessivel } = require('../utils/accessControl');

// GET /api/clientes
router.get('/', auth, requireRole(['Admin', 'Gestor']), async (req, res) => {
  try {
    const clientes = await Cliente.findAll({
      where: clienteWhereForUser(req),
      attributes: { exclude: ['password'] },
      include: [{ model: Admin, as: 'gestorResponsavel', attributes: ['id', 'nome', 'email', 'role'] }],
      order: [['nome', 'ASC']]
    });
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ erro: 'Erro interno ao aceder a lista de clientes.' });
  }
});

// GET /api/clientes/:id
router.get('/:id', auth, requireRole(['Admin', 'Gestor']), async (req, res) => {
  try {
    if (await responderSeClienteNaoAcessivel(req, res, req.params.id)) return;

    const cliente = await Cliente.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: [
        { model: AtivoTecnologico, as: 'ativos' },
        { model: Documento, as: 'documentos' },
        { model: Admin, as: 'gestorResponsavel', attributes: ['id', 'nome', 'email', 'role'] }
      ]
    });
    if (!cliente) return res.status(404).json({ erro: 'Cliente nao encontrado.' });
    res.json({ cliente, ativos: cliente.ativos || [], documentos: cliente.documentos || [] });
  } catch (error) {
    res.status(500).json({ erro: 'Erro interno ao aceder aos detalhes do cliente.' });
  }
});

// POST /api/clientes — criar cliente
router.post('/', auth, requireRole(['Admin', 'Gestor']), async (req, res) => {
  try {
    const { nome, email, telefone, password, status, respSegurancaNome, respSegurancaEmail,
      respSegurancaTelefone, contactoPermNome, contactoPermEmail, contactoPermTelefone,
      responsavel, nomeAtivo, tipoAtivo, criticidadeAtivo } = req.body;

    if (!nome || !email || !password) {
      return res.status(400).json({ erro: 'Nome, email e password sao obrigatorios.' });
    }

    const existe = await Cliente.findOne({ where: { email } });
    if (existe) return res.status(409).json({ erro: 'Ja existe um cliente com este email.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = getRole(req);
    const cliente = await Cliente.create({
      nome, email, telefone, password: hashedPassword,
      status: typeof status === 'boolean' ? status : true,
      GestorResponsavelId: role === 'Gestor' ? req.user.id : null,
      respSegurancaNome: respSegurancaNome || responsavel,
      respSegurancaEmail, respSegurancaTelefone,
      contactoPermNome, contactoPermEmail, contactoPermTelefone
    });

    if (nomeAtivo) {
      await AtivoTecnologico.create({ nome: nomeAtivo, tipo: tipoAtivo, criticidade: criticidadeAtivo, ClienteId: cliente.id });
    }

    await registrarLog(req.user.email, 'Criar Cliente', `Cliente criado: ${email} (${nome})`);

    const clienteSemPassword = cliente.toJSON();
    delete clienteSemPassword.password;
    res.status(201).json({ mensagem: 'Cliente criado com sucesso.', cliente: clienteSemPassword });
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    res.status(500).json({ erro: 'Erro interno ao criar cliente.' });
  }
});

// PUT /api/clientes/:id — editar cliente
router.put('/:id', auth, requireRole(['Admin', 'Gestor']), async (req, res) => {
  try {
    if (await responderSeClienteNaoAcessivel(req, res, req.params.id)) return;

    const cliente = await Cliente.findByPk(req.params.id);
    if (!cliente) return res.status(404).json({ erro: 'Cliente nao encontrado.' });

    const dados = { ...req.body };
    delete dados.GestorResponsavelId;
    delete dados.gestorResponsavelId;
    if (dados.password) {
      dados.password = await bcrypt.hash(dados.password, 10);
    }
    await cliente.update(dados);

    await registrarLog(req.user.email, 'Editar Cliente', `Cliente editado: ${cliente.email} (${cliente.nome})`);

    const clienteSemPassword = cliente.toJSON();
    delete clienteSemPassword.password;
    res.json({ mensagem: 'Cliente atualizado com sucesso.', cliente: clienteSemPassword });
  } catch (error) {
    res.status(500).json({ erro: 'Erro interno ao atualizar cliente.' });
  }
});

// DELETE /api/clientes/:id — eliminar cliente
router.delete('/:id', auth, requireRole(['Admin', 'Gestor']), async (req, res) => {
  try {
    if (await responderSeClienteNaoAcessivel(req, res, req.params.id)) return;

    const cliente = await Cliente.findByPk(req.params.id);
    if (!cliente) return res.status(404).json({ erro: 'Cliente nao encontrado.' });

    const emailEliminado = cliente.email;
    const nomeEliminado = cliente.nome;
    await cliente.destroy();

    await registrarLog(req.user.email, 'Remover Cliente', `Cliente eliminado: ${emailEliminado} (${nomeEliminado})`);

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ erro: 'Erro interno ao eliminar cliente.' });
  }
});

// PUT /api/clientes/:id/gestor — Admin atribui, altera ou remove gestor responsavel
router.put('/:id/gestor', auth, requireRole(['Admin']), async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    if (!cliente) return res.status(404).json({ erro: 'Cliente nao encontrado.' });

    const gestorId = req.body.GestorResponsavelId ?? req.body.gestorId ?? null;
    const gestorIdNormalizado = gestorId === '' || gestorId === null ? null : Number(gestorId);

    if (gestorIdNormalizado !== null && !Number.isInteger(gestorIdNormalizado)) {
      return res.status(400).json({ erro: 'Gestor invalido.' });
    }

    let gestor = null;
    if (gestorIdNormalizado !== null) {
      gestor = await Admin.findOne({
        where: { id: gestorIdNormalizado, role: 'Gestor', ativo: true },
        attributes: ['id', 'nome', 'email', 'role']
      });
      if (!gestor) return res.status(404).json({ erro: 'Gestor nao encontrado ou inativo.' });
    }

    const anteriorId = cliente.GestorResponsavelId;
    await cliente.update({ GestorResponsavelId: gestorIdNormalizado });

    const acao = gestorIdNormalizado === null
      ? 'Remover Gestor Responsavel'
      : anteriorId ? 'Alterar Gestor Responsavel' : 'Atribuir Gestor Responsavel';
    const detalhe = gestor
      ? `Cliente ${cliente.email} atribuido ao gestor ${gestor.email}`
      : `Cliente ${cliente.email} ficou sem gestor responsavel`;
    await registrarLog(req.user.email, acao, detalhe);

    const atualizado = await Cliente.findByPk(cliente.id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Admin, as: 'gestorResponsavel', attributes: ['id', 'nome', 'email', 'role'] }]
    });
    res.json({ mensagem: 'Gestor responsavel atualizado.', cliente: atualizado });
  } catch (error) {
    console.error('Erro ao atualizar gestor responsavel:', error);
    res.status(500).json({ erro: 'Erro interno ao atualizar gestor responsavel.' });
  }
});

module.exports = router;
