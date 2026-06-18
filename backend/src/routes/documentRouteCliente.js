const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const multer = require('multer');

// Configuração básica para guardar temporariamente os ficheiros na pasta 'uploads'
const upload = multer({ dest: 'uploads/' });

// Listar documentos existentes
router.get('/list', documentController.getDocuments);

// O teu grupo pediu: Upload de documentos (Geral e por Gestor para Cliente)
router.post('/upload', upload.single('file'), documentController.uploadDocument);
router.post('/clientes/:id/documentos', upload.single('file'), documentController.uploadDocumentPorGestor);

// O teu grupo pediu: Remoção de documentos
router.delete('/delete/:id', documentController.deleteDocument);

module.exports = router;