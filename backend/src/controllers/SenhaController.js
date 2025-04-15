const db = require('../config/db');
const geradorSenha = require('../utils/geradorSenha');

exports.emitirSenha = async (req, res) => {
  try {
    const { tipo } = req.body;
    
    if (!['SP', 'SG', 'SE'].includes(tipo)) {
      return res.status(400).json({ error: 'Tipo de senha inválido' });
    }

    const codigo = await geradorSenha(tipo);
    
    await db.query(
      'INSERT INTO senhas (codigo, tipo) VALUES (?, ?)',
      [codigo, tipo]
    );
    
    res.status(201).json({ codigo });
  } catch (error) {
    console.error('Erro no controller:', error);
    res.status(500).json({ 
      error: 'Erro ao emitir senha',
      detalhes: error.message
    });
  }
};