const Document = require('../models/Document');
const { Op } = require('sequelize');
const controllers = {};

// Listar Documentos (com pesquisa)
controllers.getDocuments = async (req, res) => {
  try {
    const { search } = req.query;
    let whereClause = {};
    
    if (search) {
      whereClause = { title: { [Op.iLike]: `%${search}%` } };
    }

    const docs = await Document.findAll({ where: whereClause });
    res.json({ success: true, documents: docs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Criar/Upload de Documento Global
controllers.uploadDocument = async (req, res) => {
  try {
    const { title, tag, uploadedBy } = req.body;
    const file = req.file; // Ficheiro apanhado pelo multer

    const newDoc = await Document.create({
      title: title || (file ? file.originalname : 'Sem título'),
      type: file ? file.mimetype.split('/')[1].toUpperCase() : 'PDF',
      size: file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : '0 MB',
      tag: tag || 'Geral',
      uploadedBy: uploadedBy || 'Gestor',
      date: new Date().toISOString().split('T')[0]
    });

    res.json({ success: true, message: "Documento global carregado!", document: newDoc });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Upload de Documento por Gestor para um Cliente específico
controllers.uploadDocumentPorGestor = async (req, res) => {
  try {
    const clienteId = req.params.id;
    const { title, tag } = req.body;
    const file = req.file;

    const newDoc = await Document.create({
      title: title || (file ? file.originalname : 'Documento Cliente'),
      type: file ? file.mimetype.split('/')[1].toUpperCase() : 'PDF',
      size: file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : '0 MB',
      tag: tag || 'Cliente',
      uploadedBy: `Gestor (Cliente ID: ${clienteId})`,
      date: new Date().toISOString().split('T')[0]
    });

    res.json({ success: true, message: `Documento associado ao cliente ${clienteId}!`, document: newDoc });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Remover Documento
controllers.deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    await Document.destroy({ where: { id } });
    res.json({ success: true, message: "Documento removido com sucesso!" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = controllers;