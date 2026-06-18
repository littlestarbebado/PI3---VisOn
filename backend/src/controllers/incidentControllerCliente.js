const Incident = require('../model/Incident');
const sequelize = require('../model/database');

const controllers = {};

// 1. Listar todos os incidentes
controllers.getIncidents = async (req, res) => {
  try {
    await sequelize.sync();
    
    let incidents = await Incident.findAll({ order: [['date', 'DESC']] });
    
    // Se a BD estiver vazia, cria os dois da foto de teste
    if (incidents.length === 0) {
      await Incident.bulkCreate([
        { title: 'Tentativa de Login Suspeita - IP Estrangeiro', status: 'Resolvido', date: '2024-03-19' },
        { title: 'Alerta de Malware Detetado - Endpoint Workstation 4', status: 'Em Investigação', date: '2024-03-15' }
      ]);
      incidents = await Incident.findAll({ order: [['date', 'DESC']] });
    }

    res.json({ success: true, incidents });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 2. Criar um novo incidente (Ação do botão)
controllers.createIncident = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ success: false, message: "Título é obrigatório" });

    const newIncident = await Incident.create({
      title: title,
      status: 'Em Investigação', // Entra automaticamente neste estado
      date: new Date().toISOString().split('T')[0] // Data de hoje formato YYYY-MM-DD
    });

    res.json({ success: true, incident: newIncident });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = controllers;