const Documento = require('../models/Documento');
const fs = require('fs');

// 1. Listar todos os documentos de um cliente específico
exports.getDocumentosPorCliente = async (req, res) => {
  try {
    const { clienteId } = req.params;
    const documentos = await Documento.findAll({ where: { clienteId } });
    return res.status(200).json(documentos);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao procurar documentos.', error: error.message });
  }
};

// 2. Upload de um novo documento (PDF, Relatório, etc.)
exports.uploadDocumento = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Por favor, envie um ficheiro.' });
    }

    const { tipo, clienteId } = req.body;
    if (!tipo || !clienteId) {
      // Se faltarem dados, apagamos o ficheiro para não lixar o servidor
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'O tipo de documento e o clienteId são obrigatórios.' });
    }

    // Criar o registo na base de dados
    const novoDocumento = await Documento.create({
      nomeFicheiro: req.file.originalname,
      caminho: req.file.path, // Guarda o caminho relativo (ex: uploads/1715...pdf)
      tipo, // 'PenTest', 'PoliticaInterna', 'Evidencia' ou 'Outro'
      clienteId: parseInt(clienteId)
    });

    return res.status(201).json({
      message: 'Documento enviado e registado com sucesso!',
      novoDocumento
    });

  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({ message: 'Erro ao fazer upload do documento.', error: error.message });
  }
};
