const express = require('express');
const router = express.Router();
const SenhaController = require('../controllers/SenhaController');

router.post('/', SenhaController.emitirSenha);

module.exports = router;