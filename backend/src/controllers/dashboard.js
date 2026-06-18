const { SecurityArea, RecentDoc } = require('../model/Dashboard');
const sequelize = require('../model/database');

const controllers = {};

controllers.getDashboardData = async (req, res) => {
  try {
    // Sincroniza e cria dados de teste se a BD estiver vazia
    await sequelize.sync();
    
    let areas = await SecurityArea.findAll();
    if (areas.length === 0) {
      await SecurityArea.bulkCreate([
        { name: 'Gestão de Identidade', percentage: 90 },
        { name: 'Segurança de Rede', percentage: 85 },
        { name: 'Proteção de Dados', percentage: 65 },
        { name: 'Gestão de Vulnerabilidades', percentage: 70 }
      ]);
      areas = await SecurityArea.findAll();
    }

    let docs = await RecentDoc.findAll();
    if (docs.length === 0) {
      await RecentDoc.bulkCreate([
        { title: 'Relatório de Avaliação de Risco - Q1 2024', date: '2024-03-20' },
        { title: 'Política de Segurança da Informação', date: '2024-03-18' },
        { title: 'PentTest Report - Infraestrutura Web', date: '2024-03-15' }
      ]);
      docs = await RecentDoc.findAll();
    }

    // Resposta com todos os dados estruturados do Dashboard
    res.json({
      success: true,
      company: "TechCorp Solutions",
      riskScore: 75,
      status: "Boa postura de segurança",
      metrics: {
        documents: 3,
        incidents: 2,
        activeRequests: 2,
        evolution: "+5%"
      },
      recentDocuments: docs,
      securityAreas: areas
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = controllers;