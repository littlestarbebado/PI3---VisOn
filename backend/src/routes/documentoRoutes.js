const express = require('express');
const router = express.Router();
const multer = require('multer');
const documentoController = require('../controllers/documentoController');

// Reutilizamos a mesma configuração do Multer para a pasta /uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

// Rota para listar os documentos de um cliente (GET /api/documentos/cliente/1)
router.get('/cliente/:clienteId', documentoController.getDocumentosPorCliente);

// Rota para fazer upload de um documento (POST /api/documentos/upload)
// O input no frontend terá de se chamar 'documentoFile'
router.post('/upload', upload.single('documentoFile'), documentoController.uploadDocumento);

module.exports = router;