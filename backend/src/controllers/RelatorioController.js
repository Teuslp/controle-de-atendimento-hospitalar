const db = require('../config/db');

exports.gerarDiario = async (req, res) => {
  try {
    // 1. Dados consolidados por tipo
    const [consolidado] = await db.query(`
      SELECT 
        s.tipo,
        COUNT(*) as total_emitidas,
        SUM(s.atendida) as total_atendidas,
        ROUND(SUM(s.atendida) / COUNT(*) * 100, 2) as percentual_atendidas
      FROM senhas s
      WHERE DATE(s.data_emissao) = CURDATE()
      GROUP BY s.tipo
      ORDER BY FIELD(s.tipo, 'SP', 'SE', 'SG')
    `);

    // 2. Detalhamento das senhas
    const [detalhes] = await db.query(`
      SELECT 
        s.codigo,
        s.tipo,
        DATE_FORMAT(s.data_emissao, '%H:%i:%s') as hora_emissao,
        IFNULL(DATE_FORMAT(a.inicio_atendimento, '%H:%i:%s'), '') as hora_chamada,
        IFNULL(DATE_FORMAT(a.fim_atendimento, '%H:%i:%s'), '') as hora_finalizacao,
        IFNULL(a.guiche, '') as guiche,
        IFNULL(TIMESTAMPDIFF(MINUTE, a.inicio_atendimento, a.fim_atendimento), '') as duracao_minutos
      FROM senhas s
      LEFT JOIN atendimentos a ON s.id = a.senha_id
      WHERE DATE(s.data_emissao) = CURDATE()
      ORDER BY s.data_emissao DESC
    `);

    // 3. Tempos médios calculados
    const [temposMedios] = await db.query(`
      SELECT
        s.tipo,
        AVG(TIMESTAMPDIFF(MINUTE, a.inicio_atendimento, a.fim_atendimento)) as tm_real
      FROM atendimentos a
      JOIN senhas s ON a.senha_id = s.id
      WHERE DATE(a.inicio_atendimento) = CURDATE()
      GROUP BY s.tipo
    `);

    res.json({
      consolidado,
      detalhes,
      temposMedios,
      data: new Date().toLocaleDateString('pt-BR')
    });

  } catch (error) {
    console.error('Erro no relatório diário:', error);
    res.status(500).json({ 
      error: 'Erro ao gerar relatório',
      detalhes: error.message
    });
  }
};

exports.gerarMensal = async (req, res) => {
  try {
    const { ano, mes } = req.query;
    
    const [result] = await db.query(`
      SELECT
        DAY(data_emissao) as dia,
        COUNT(*) as total_emitidas,
        SUM(atendida) as total_atendidas
      FROM senhas
      WHERE YEAR(data_emissao) = ? AND MONTH(data_emissao) = ?
      GROUP BY DAY(data_emissao)
      ORDER BY dia
    `, [ano || new Date().getFullYear(), mes || new Date().getMonth() + 1]);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Erro no relatório mensal' });
  }
};