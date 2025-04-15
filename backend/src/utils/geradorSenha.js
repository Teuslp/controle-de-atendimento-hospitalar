const db = require('../config/db');

module.exports = async (tipo) => {
  const hoje = new Date();
  const yy = hoje.getFullYear().toString().slice(-2);
  const mm = String(hoje.getMonth() + 1).padStart(2, '0');
  const dd = String(hoje.getDate()).padStart(2, '0');
  
  // Atualiza a sequência no banco
  await db.query(
    `INSERT INTO sequencias (data, ${tipo.toLowerCase()}_seq) 
     VALUES (CURDATE(), 1)
     ON DUPLICATE KEY UPDATE 
     ${tipo.toLowerCase()}_seq = ${tipo.toLowerCase()}_seq + 1`
  );
  
  // Obtém a sequência atual
  const [result] = await db.query(
    `SELECT ${tipo.toLowerCase()}_seq as seq 
     FROM sequencias 
     WHERE data = CURDATE()`
  );
  
  const sq = String(result[0].seq).padStart(4, '0');
  return `${yy}${mm}${dd}-${tipo}${sq}`;
};