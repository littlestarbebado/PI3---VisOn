const AtivoTecnologico = require('../models/AtivoTecnologico');
const xlsx = require('xlsx');
const fs = require('fs');

// 1. Listar todos os ativos de um cliente específico
exports.getAtivosPorCliente = async (req, res) => {
  try {
    const { clienteId } = req.params;
    const ativos = await AtivoTecnologico.findAll({ where: { clienteId } });
    return res.status(200).json(ativos);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao procurar ativos.', error: error.message });
  }
};

// 2. Criar um ativo manualmente
exports.criarAtivoManual = async (req, res) => {
  try {
    const { nomeAtivo, tipo, criticidade, clienteId } = req.body;
    const novoAtivo = await AtivoTecnologico.create({ nomeAtivo, tipo, criticidade, clienteId });
    return res.status(201).json({ message: 'Ativo criado com sucesso!', novoAtivo });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao criar ativo.', error: error.message });
  }
};

// 3. O BÓNUS: Importar Ativos a partir de um ficheiro Excel
exports.importarExcel = async (req, res) => {
  try {
    // Verificar se o ficheiro foi realmente enviado
    if (!req.file) {
      return res.status(400).json({ message: 'Por favor, envie um ficheiro Excel.' });
    }

    const { clienteId } = req.body; // Vamos receber o ID do cliente associado no corpo da requisição
    if (!clienteId) {
      return res.status(400).json({ message: 'O ID do cliente é obrigatório para associar os ativos.' });
    }

    // 1. Ler o ficheiro guardado na pasta /uploads
    const workbook = xlsx.readFile(req.file.path);
    
    // 2. Pegar na primeira folha (sheet) do Excel
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // 3. Converter as linhas do Excel num Array de Objetos Javascript (JSON)
    const dadosExcel = xlsx.utils.sheet_to_json(worksheet);

    // 4. Mapear os dados do Excel para o formato das colunas da tua Base de Dados
    // O teu Excel deve ter as colunas exatamente com estes nomes: "Nome", "Tipo", "Criticidade"
    const ativosParaInserir = dadosExcel.map(linha => ({
      nomeAtivo: linha.Nome,
      tipo: linha.Tipo,
      criticidade: linha.Criticidade || 'Média',
      clienteId: parseInt(clienteId)
    }));

    // 5. Injetar tudo de uma só vez na Base de Dados (bulkCreate)
    await AtivoTecnologico.bulkCreate(ativosParaInserir);

    // 6. Limpeza: Apagar o ficheiro temporário da pasta /uploads para não encher o teu PC
    fs.unlinkSync(req.file.path);

    return res.status(201).json({
      message: `Sucesso! Foram importados ${ativosParaInserir.length} ativos com êxito.`,
    });

  } catch (error) {
    // Se der erro, garante que apaga o ficheiro temporário na mesma
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({ message: 'Erro ao processar o ficheiro Excel.', error: error.message });
  }
};