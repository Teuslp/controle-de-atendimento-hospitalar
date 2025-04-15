const db = require('../config/db');
const { calculatorTM } = require('../services/tempoService');

exports.chamarProxima = async (req, res) => {
  try {
    console.log("Iniciando processo de chamar próxima senha...");
    
    // Verifica se há senhas pendentes
    const [totalPendentes] = await db.query(
      "SELECT COUNT(*) as total FROM senhas WHERE atendida = FALSE"
    );
    
    if (totalPendentes[0].total === 0) {
      console.log("Nenhuma senha pendente encontrada");
      return res.status(404).json({ message: 'Nenhuma senha pendente para atendimento' });
    }

    // Lógica de priorização melhorada
    let proximoTipo = null;
    
    // 1. Tenta encontrar SP
    const [sp] = await db.query(
      `SELECT id, codigo, tipo FROM senhas 
       WHERE tipo = 'SP' AND atendida = FALSE 
       ORDER BY data_emissao LIMIT 1`
    );
    
    // 2. Se não encontrar SP, tenta SE
    if (sp.length === 0) {
      const [se] = await db.query(
        `SELECT id, codigo, tipo FROM senhas 
         WHERE tipo = 'SE' AND atendida = FALSE 
         ORDER BY data_emissao LIMIT 1`
      );
      if (se.length > 0) proximoTipo = se[0];
    } else {
      proximoTipo = sp[0];
    }
    
    // 3. Se não encontrou SP nem SE, pega SG
    if (!proximoTipo) {
      const [sg] = await db.query(
        `SELECT id, codigo, tipo FROM senhas 
         WHERE tipo = 'SG' AND atendida = FALSE 
         ORDER BY data_emissao LIMIT 1`
      );
      if (sg.length > 0) proximoTipo = sg[0];
    }

    if (!proximoTipo) {
      console.log("Nenhuma senha encontrada após busca completa");
      return res.status(404).json({ message: 'Nenhuma senha disponível' });
    }

    console.log("Senha selecionada:", proximoTipo.codigo);

    // Registra atendimento
    await db.query(
      `INSERT INTO atendimentos 
       (senha_id, guiche, inicio_atendimento) 
       VALUES (?, ?, NOW())`,
      [proximoTipo.id, 1]
    );

    await db.query(
      `UPDATE senhas SET atendida = TRUE 
       WHERE id = ?`,
      [proximoTipo.id]
    );

    const tempoMedio = parseFloat(calculatorTM(proximoTipo.tipo)).toFixed(1);
    
    res.json({
      senha: proximoTipo.codigo,
      guiche: 1,
      tempoMedio,
      tipo: proximoTipo.tipo
    });

  } catch (error) {
    console.error("Erro no controller:", error);
    res.status(500).json({ 
      error: 'Erro ao processar requisição',
      detalhes: error.message
    });
  }
};

exports.listarUltimas = async (req, res) => {
  try {
    const [senhas] = await db.query(`
      SELECT
        s.codigo,
        s.tipo,
        a.guiche,
        DATE_FORMAT(a.inicio_atendimento, '%H:%i:%s') as horario
      FROM atendimentos a
      JOIN senhas s ON a.senha_id = s.id
      ORDER BY a.inicio_atendimento DESC 
      LIMIT 5
    `);
    res.status(200).json(senhas);
  } catch (error) {
    console.error('Erro ao listar últimas senhas:', error);
    res.status(500).json({ 
      error: 'Erro ao buscar histórico',
      detalhes: error.message
    });
  }
};