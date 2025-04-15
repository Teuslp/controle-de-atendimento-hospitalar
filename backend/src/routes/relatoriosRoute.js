const express = require('express');
const router = express.Router();
const RelatorioController = require('../controllers/RelatorioController');

// Relatório diário detalhado
router.get('/diario', RelatorioController.gerarDiario);

// Relatório mensal consolidado
router.get('/mensal', RelatorioController.gerarMensal);

// Exporta o router configurado
module.exports = router;