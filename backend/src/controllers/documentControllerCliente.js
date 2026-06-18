const Document = require('../model/Document');
const sequelize = require('../model/database');
const { Op } = require('sequelize');

const controllers = {};

controllers.getDocuments = async (req, res) => {
  try {
    await sequelize.sync(); // Garante que a tabela existe [cite: 988]
    
    // Inserir os dados da foto caso a base de dados esteja vazia
    let docs = await Document.findAll();
    if (docs.length === 0) {
      await Document.bulkCreate([
        { title: 'Relatório de Avaliação de Risco - Q1 2024', type: 'PDF', size: '2.4 MB', tag: 'Relatório', uploadedBy: 'Gestor Silva', date: '2024-03-20' },
        { title: 'Política de Segurança da Informação', type: 'PDF', size: '856 KB', tag: 'Documentação', uploadedBy: 'Admin', date: '2024-03-18' },
        { title: 'PentTest Report - Infraestrutura Web', type: 'PDF', size: '3.1 MB', tag: 'PentTest', uploadedBy: 'Gestor Silva', date: '2024-03-15' }
      ]);
      docs = await Document.findAll();
    }

    // Se houver uma pesquisa pelo nome, filtramos no SQL [cite: 828]
    const { search } = req.query;
    if (search) {
      docs = await Document.findAll({
        where: {
          title: { [Op.iLike]: `%${search}%` } // Funciona perfeitamente no PostgreSQL (Neon)
        }
      });
    }

    res.json({ success: true, count: docs.length, documents: docs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = controllers;