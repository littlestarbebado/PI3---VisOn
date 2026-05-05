const express = require('express');
const router = express.Router();
const multer = require('multer');
const ativoController = require('../controllers/ativoController');

// Configuração do Multer para definir onde guardar e com que nome os ficheiros chegam
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Pasta que criámos no Passo 1
  },
  filename: (req, file, cb) => {
    // Cria um nome único com a data atual para evitar conflitos de ficheiros iguais
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

// Rotas existentes
router.get('/cliente/:clienteId', ativoController.getAtivosPorCliente);
router.post('/manual', ativoController.criarAtivoManual);

// NOVA ROTA: Upload do Excel (Usa o middleware upload.single('excelFile'))
router.post('/upload-excel', upload.single('excelFile'), ativoController.importarExcel);

module.exports = router;