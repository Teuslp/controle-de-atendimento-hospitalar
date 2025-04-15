const express = require('express');
const router = express.Router();
const ChamadaController = require('../controllers/ChamadaController');

router.get('/proxima', ChamadaController.chamarProxima);
router.get('/ultimas', ChamadaController.listarUltimas);

module.exports = router;