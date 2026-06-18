const Incident = require('../model/Incident');
const sequelize = require('../model/database');

const controllers = {};

// 1. Listar todos os incidentes (Já com os 3 da foto atualizada)
controllers.getIncidents = async (req, res) => {
  try {
    await sequelize.sync();
    
    let incidents = await Incident.findAll({ order: [['date', 'DESC']] });
    
    // Se a Base de Dados estiver vazia, cria automaticamente estes 3:
    if (incidents.length === 0) {
      await Incident.bulkCreate([
        { title: 'Tentativa de Login Suspeita - IP Estrangeiro', status: 'Resolvido', date: '2024-03-19' },
        { title: 'Alerta de Malware Detetado - Endpoint Workstation 4', status: 'Em Investigação', date: '2024-03-15' },
        { title: 'Acesso não autorizado a pasta partilhada', status: 'Em Investigação', date: '2024-03-12' }
      ]);
      incidents = await Incident.findAll({ order: [['date', 'DESC']] });
    }

    res.json({ success: true, incidents });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 2. Criar um novo incidente através do botão do React
controllers.createIncident = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ success: false, message: "Título é obrigatório" });

    const newIncident = await Incident.create({
      title: title,
      status: 'Em Investigação',
      date: new Date().toISOString().split('T')[0] // Data do dia de hoje
    });

    res.json({ success: true, incident: newIncident });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = controllers;